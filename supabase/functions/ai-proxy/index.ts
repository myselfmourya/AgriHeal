/**
 * AgriHeal — AI Proxy Edge Function
 *
 * All AI provider keys live here as Deno secrets.
 * The browser never sees any key — it only sends authenticated requests to this function.
 *
 * Supported providers (in priority fallback order):
 *   chat/translate/summarize : groq → gemini → mistral → claude
 *   image                    : gemini → claude
 *   structured/document      : groq → claude → gemini → mistral
 *
 * Groq leads the text-only chains — it's fast and its free tier is generous,
 * so routing ordinary chat/structured/document traffic there first keeps the
 * Gemini/Mistral/Claude quotas free for image analysis and fallback.
 *
 * Request body:
 *   { intent, prompt, systemInstruction?, base64Image?, mimeType? }
 *
 * Response:
 *   { text: string }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── CORS ───────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

function corsHeaders(origin: string | null): Record<string, string> {
  // Any localhost/127.0.0.1 origin is allowed regardless of port — dev servers
  // pick a fallback port when the default is busy (e.g. 5174 instead of 5173).
  // Non-local origins must still match ALLOWED_ORIGINS exactly.
  const isLocalDev = !!origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const allowed = origin && (ALLOWED_ORIGINS.includes(origin) || isLocalDev) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function json(body: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

// ── Models ─────────────────────────────────────────────────────────────────
const MODELS = {
  gemini: "gemini-3.8-flash",
  claude: "claude-3-haiku-20240307",
  mistral: "mistral-small-latest",
  groq: "openai/gpt-oss-120b",
};

// ── Provider implementations ───────────────────────────────────────────────

async function callGemini(
  prompt: string,
  systemInstruction: string | null,
  base64Image: string | null,
  mimeType: string
): Promise<string> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_API_KEY not configured");

  const parts: unknown[] = [];
  if (systemInstruction) parts.push({ text: systemInstruction + "\n\n" });
  parts.push({ text: prompt });
  if (base64Image) parts.push({ inline_data: { mime_type: mimeType, data: base64Image } });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { maxOutputTokens: 4096 } }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${JSON.stringify(data)}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callClaude(
  prompt: string,
  systemInstruction: string | null,
  base64Image: string | null,
  mimeType: string
): Promise<string> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) throw new Error("ANTHROPIC_API_KEY not configured");

  const content: unknown[] = [];
  if (base64Image) {
    content.push({ type: "image", source: { type: "base64", media_type: mimeType, data: base64Image } });
  }
  content.push({ type: "text", text: prompt });

  const payload: Record<string, unknown> = {
    model: MODELS.claude,
    max_tokens: 4096,
    messages: [{ role: "user", content }],
  };
  if (systemInstruction) payload.system = systemInstruction;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Claude error ${res.status}: ${JSON.stringify(data)}`);
  return data.content?.[0]?.text ?? "";
}

async function callGroq(
  prompt: string,
  systemInstruction: string | null
): Promise<string> {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) throw new Error("GROQ_API_KEY not configured");

  const messages: unknown[] = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODELS.groq, messages, max_tokens: 4096 }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Groq error ${res.status}: ${JSON.stringify(data)}`);
  return data.choices?.[0]?.message?.content ?? "";
}

async function callMistral(
  prompt: string,
  systemInstruction: string | null
): Promise<string> {
  const key = Deno.env.get("MISTRAL_API_KEY");
  if (!key) throw new Error("MISTRAL_API_KEY not configured");

  const messages: unknown[] = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODELS.mistral, messages, max_tokens: 4096 }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Mistral error ${res.status}: ${JSON.stringify(data)}`);
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Fallback chains ────────────────────────────────────────────────────────
type Intent = "chat" | "image" | "structured" | "document";

const CHAINS: Record<Intent, string[]> = {
  chat:       ["groq", "gemini", "mistral", "claude"],
  image:      ["gemini", "claude"],
  structured: ["groq", "claude", "gemini", "mistral"],
  document:   ["groq", "claude", "gemini", "mistral"],
};

async function executeWithFallback(
  intent: Intent,
  prompt: string,
  systemInstruction: string | null,
  base64Image: string | null,
  mimeType: string
): Promise<string> {
  const chain = CHAINS[intent] ?? CHAINS.chat;
  const errors: string[] = [];

  for (const provider of chain) {
    try {
      console.log(`[ai-proxy] intent=${intent} trying=${provider}`);
      if (provider === "groq") return await callGroq(prompt, systemInstruction);
      if (provider === "gemini") return await callGemini(prompt, systemInstruction, base64Image, mimeType);
      if (provider === "claude") return await callClaude(prompt, systemInstruction, base64Image, mimeType);
      if (provider === "mistral") return await callMistral(prompt, systemInstruction);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[ai-proxy] ${provider} failed: ${msg}`);
      errors.push(`${provider}: ${msg}`);
    }
  }

  throw new Error(`All providers failed for intent '${intent}'. Errors: ${errors.join(" | ")}`);
}

// ── Rate limiting (simple in-memory per-instance) ─────────────────────────
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // requests per minute per user

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(userId);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Main handler ───────────────────────────────────────────────────────────
serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  try {
    // Auth — require a valid Supabase session
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) return json({ error: "Unauthorized" }, 401, origin);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401, origin);

    // Rate limit
    if (isRateLimited(user.id)) {
      return json({ error: "Too many requests. Please slow down." }, 429, origin);
    }

    // Parse body
    const body = await req.json() as {
      intent?: string;
      prompt?: string;
      systemInstruction?: string | null;
      base64Image?: string | null;
      mimeType?: string;
    };

    const intent = (body.intent ?? "chat") as Intent;
    const prompt = body.prompt ?? "";
    const systemInstruction = body.systemInstruction ?? null;
    const base64Image = body.base64Image ?? null;
    const mimeType = body.mimeType ?? "image/jpeg";

    if (!prompt && !base64Image) {
      return json({ error: "prompt or base64Image is required" }, 400, origin);
    }

    // Execute
    const text = await executeWithFallback(intent, prompt, systemInstruction, base64Image, mimeType);

    return json({ text }, 200, origin);

  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[ai-proxy] error:", message);
    return json({ error: message }, 500, origin);
  }
});
