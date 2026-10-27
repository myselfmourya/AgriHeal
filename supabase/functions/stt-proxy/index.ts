/**
 * AgriHeal — Speech-to-Text Proxy Edge Function
 *
 * Fallback for browsers with no (or unreliable) Web Speech API — notably
 * Safari/iOS, where SpeechRecognition is absent or needs a user gesture per
 * utterance, making the always-listening wake-word pipeline in VaniContext
 * unusable. The client records a short audio clip (MediaRecorder) and posts
 * it here; this function forwards it to Groq's Whisper API server-side so
 * GROQ_API_KEY never reaches the browser, then returns the transcript.
 *
 * Request: multipart/form-data with a single "audio" file field.
 * Response: { text: string }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── CORS ───────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
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

// ── Rate limiting (simple in-memory per-instance) ─────────────────────────
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per minute per user — short clips, generous enough for a conversation

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

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10MB — a few minutes of compressed audio, far more than one utterance needs

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

    if (isRateLimited(user.id)) {
      return json({ error: "Too many requests. Please slow down." }, 429, origin);
    }

    const key = Deno.env.get("GROQ_API_KEY");
    if (!key) return json({ error: "GROQ_API_KEY not configured" }, 500, origin);

    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (contentLength > MAX_AUDIO_BYTES) {
      return json({ error: "Audio clip too large (max 10MB)" }, 400, origin);
    }

    const incomingForm = await req.formData();
    const audioFile = incomingForm.get("audio");
    if (!(audioFile instanceof File)) {
      return json({ error: "Missing 'audio' file field" }, 400, origin);
    }

    const language = (incomingForm.get("language") as string) || undefined;

    const groqForm = new FormData();
    groqForm.append("file", audioFile, audioFile.name || "clip.webm");
    groqForm.append("model", "whisper-large-v3-turbo");
    if (language) groqForm.append("language", language);

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: groqForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[stt-proxy] Groq error:", errText);
      return json({ error: `Transcription failed (${res.status})` }, 502, origin);
    }

    const data = await res.json();
    return json({ text: data.text ?? "" }, 200, origin);

  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[stt-proxy] error:", message);
    return json({ error: message }, 500, origin);
  }
});
