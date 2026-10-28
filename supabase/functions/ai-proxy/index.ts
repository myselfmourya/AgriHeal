/**
 * AgriHeal — AI Proxy Edge Function
 *
 * All AI provider keys live here as Deno secrets.
 * The browser never sees any key — it only sends authenticated requests to this function.
 *
 * Supported providers (in priority fallback order): Google Gemini, Groq, Mistral.
 *   chat/document             : groq → gemini → mistral
 *   image                     : groq (vision) → gemini
 *   structured                : groq → gemini
 *
 * Every provider call has a 6s timeout so a stuck/slow provider fails fast
 * instead of stalling the whole fallback chain — short chains on image/
 * structured bound a two-step analysis (describe, then structure) to a
 * ~24s absolute worst case, well under what it was before. Structured/
 * image/document intents use a low temperature for consistent, factual
 * output; chat keeps the provider default so responses still read
 * naturally.
 *
 * Groq leads the text-only chains — it's fast and its free tier is generous,
 * so routing ordinary chat/structured/document traffic there first keeps the
 * Gemini/Mistral quota free for image analysis and fallback.
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
  mistral: "mistral-small-latest",
  groq: "openai/gpt-oss-120b",
  groqVision: "qwen/qwen3.8-27b",
};

// ── Provider implementations ───────────────────────────────────────────────

// A hung provider (no response, not even an error) stalls the whole fallback
// chain until the edge function's own runtime kills it — by then it's too
// late to fall through to the next provider. Every provider call goes
// through this so a slow/stuck API fails fast instead.
const PROVIDER_TIMEOUT_MS = 6_000;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Request timed out after ${PROVIDER_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(
  prompt: string,
  systemInstruction: string | null,
  base64Image: string | null,
  mimeType: string,
  temperature?: number,
  jsonMode = false
): Promise<string> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_API_KEY not configured");

  const parts: unknown[] = [];
  if (systemInstruction) parts.push({ text: systemInstruction + "\n\n" });
  parts.push({ text: prompt });
  if (base64Image) parts.push({ inline_data: { mime_type: mimeType, data: base64Image } });

  const generationConfig: Record<string, unknown> = { maxOutputTokens: 4096 };
  if (temperature !== undefined) generationConfig.temperature = temperature;
  if (jsonMode) generationConfig.responseMimeType = "application/json";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent?key=${key}`;
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }], generationConfig }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${JSON.stringify(data)}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callGroq(
  prompt: string,
  systemInstruction: string | null,
  jsonMode = false,
  temperature?: number
): Promise<string> {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) throw new Error("GROQ_API_KEY not configured");

  const messages: unknown[] = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({ role: "user", content: prompt });

  const body: Record<string, unknown> = { model: MODELS.groq, messages, max_tokens: 4096 };
  // Prompting alone doesn't reliably stop this model from answering
  // conversationally — Groq's JSON mode makes it actually emit an object.
  if (jsonMode) body.response_format = { type: "json_object" };
  if (temperature !== undefined) body.temperature = temperature;

  const res = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Groq error ${res.status}: ${JSON.stringify(data)}`);
  return data.choices?.[0]?.message?.content ?? "";
}

async function callGroqVision(
  prompt: string,
  systemInstruction: string | null,
  base64Image: string,
  mimeType: string,
  temperature?: number,
  jsonMode = false
): Promise<string> {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) throw new Error("GROQ_API_KEY not configured");

  const messages: unknown[] = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({
    role: "user",
    content: [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
    ],
  });

  const body: Record<string, unknown> = { model: MODELS.groqVision, messages, max_tokens: 4096 };
  if (temperature !== undefined) body.temperature = temperature;
  if (jsonMode) body.response_format = { type: "json_object" };

  const res = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Groq vision error ${res.status}: ${JSON.stringify(data)}`);
  return data.choices?.[0]?.message?.content ?? "";
}

async function callMistral(
  prompt: string,
  systemInstruction: string | null,
  jsonMode = false,
  temperature?: number
): Promise<string> {
  const key = Deno.env.get("MISTRAL_API_KEY");
  if (!key) throw new Error("MISTRAL_API_KEY not configured");

  const messages: unknown[] = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({ role: "user", content: prompt });

  const body: Record<string, unknown> = { model: MODELS.mistral, messages, max_tokens: 4096 };
  if (jsonMode) body.response_format = { type: "json_object" };
  if (temperature !== undefined) body.temperature = temperature;

  const res = await fetchWithTimeout("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Mistral error ${res.status}: ${JSON.stringify(data)}`);
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Fallback chains ────────────────────────────────────────────────────────
type Intent = "chat" | "image" | "structured" | "document";

const CHAINS: Record<Intent, string[]> = {
  chat:       ["groq", "gemini", "mistral"],
  // Groq first: it's consistently fast, and Gemini has been intermittently
  // overloaded/slow — trying it first just means waiting out its timeout
  // before falling through. Gemini stays as a second opinion/fallback.
  image:      ["groqVision", "gemini"],
  // Two providers, not three: structured calls are often the second half
  // of a two-step analysis (image description → structured diagnosis), so
  // keeping this chain short bounds the combined worst-case latency.
  // Mistral stays in chat/document, where it's less likely to be on a
  // tight interactive-latency path.
  structured: ["groq", "gemini"],
  document:   ["groq", "gemini", "mistral"],
};

// Lower temperature for anything that must be factually consistent
// (diagnosis, structured data, document extraction); keep chat's default
// so farming advice still reads naturally rather than terse and robotic.
function temperatureFor(intent: Intent): number | undefined {
  return intent === "chat" ? undefined : 0.3;
}

async function executeWithFallback(
  intent: Intent,
  prompt: string,
  systemInstruction: string | null,
  base64Image: string | null,
  mimeType: string,
  jsonModeOverride?: boolean
): Promise<string> {
  const chain = CHAINS[intent] ?? CHAINS.chat;
  const errors: string[] = [];
  const jsonMode = jsonModeOverride ?? intent === "structured";
  const temperature = temperatureFor(intent);

  for (const provider of chain) {
    try {
      console.log(`[ai-proxy] intent=${intent} trying=${provider}`);
      if (provider === "groq") return await callGroq(prompt, systemInstruction, jsonMode, temperature);
      if (provider === "groqVision") {
        if (!base64Image) throw new Error("groqVision requires an image");
        return await callGroqVision(prompt, systemInstruction, base64Image, mimeType, temperature, jsonMode);
      }
      if (provider === "gemini") return await callGemini(prompt, systemInstruction, base64Image, mimeType, temperature, jsonMode);
      if (provider === "mistral") return await callMistral(prompt, systemInstruction, jsonMode, temperature);
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
      jsonMode?: boolean;
    };

    const intent = (body.intent ?? "chat") as Intent;
    const prompt = body.prompt ?? "";
    const systemInstruction = body.systemInstruction ?? null;
    const base64Image = body.base64Image ?? null;
    const mimeType = body.mimeType ?? "image/jpeg";
    const jsonMode = body.jsonMode;

    if (!prompt && !base64Image) {
      return json({ error: "prompt or base64Image is required" }, 400, origin);
    }

    // Execute
    const text = await executeWithFallback(intent, prompt, systemInstruction, base64Image, mimeType, jsonMode);

    return json({ text }, 200, origin);

  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[ai-proxy] error:", message);
    return json({ error: message }, 500, origin);
  }
});
