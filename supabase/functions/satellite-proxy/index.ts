/**
 * AgriHeal — Satellite Proxy Edge Function
 *
 * Returns real vegetation-health (NDVI) data for a farm location, sourced from
 * Microsoft Planetary Computer's public Sentinel-2 STAC catalog. No API key is
 * needed for Planetary Computer — it's a free, unauthenticated public API — but
 * this function still requires a valid Supabase session, matching every other
 * proxy in this repo, so only signed-in app users can spend the rate-limit budget.
 *
 * Request body:
 *   { lat: number, lon: number }
 *
 * Response:
 *   { ndvi: number, sceneDate: string, cloudCover: number, itemId: string }
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

const STAC_SEARCH_URL = "https://planetarycomputer.microsoft.com/api/stac/v1/search";
const DATA_API_BASE = "https://planetarycomputer.microsoft.com/api/data/v1";

// ── Rate limiting (simple in-memory per-instance) ─────────────────────────
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per minute per user

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
    const body = await req.json() as { lat?: number; lon?: number };
    const { lat, lon } = body;

    if (typeof lat !== "number" || typeof lon !== "number") {
      return json({ error: "lat and lon (numbers) are required" }, 400, origin);
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return json({ error: "lat/lon out of range" }, 400, origin);
    }

    // 1. Find the most recent, mostly cloud-free Sentinel-2 scene over this point
    const searchRes = await fetch(STAC_SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collections: ["sentinel-2-l2a"],
        intersects: { type: "Point", coordinates: [lon, lat] },
        query: { "eo:cloud_cover": { lt: 20 } },
        sortby: [{ field: "properties.datetime", direction: "desc" }],
        limit: 1,
      }),
    });

    if (!searchRes.ok) {
      console.error("[satellite-proxy] STAC search error:", await searchRes.text());
      return json({ error: "Satellite catalog search failed" }, 502, origin);
    }

    const searchData = await searchRes.json();
    const item = searchData.features?.[0];
    if (!item) {
      return json({ error: "No recent cloud-free satellite scene found for this location" }, 404, origin);
    }

    // 2. Query the NDVI value at this exact point from that scene's red/NIR bands
    const pointParams = new URLSearchParams();
    pointParams.append("collection", "sentinel-2-l2a");
    pointParams.append("item", item.id);
    pointParams.append("assets", "B04");
    pointParams.append("assets", "B08");
    pointParams.append("expression", "(B08-B04)/(B08+B04)");
    pointParams.append("asset_as_band", "true");

    const pointUrl = `${DATA_API_BASE}/item/point/${lon},${lat}?${pointParams.toString()}`;
    const pointRes = await fetch(pointUrl);

    if (!pointRes.ok) {
      console.error("[satellite-proxy] Point query error:", await pointRes.text());
      return json({ error: "NDVI lookup failed" }, 502, origin);
    }

    const pointData = await pointRes.json();
    const ndvi = pointData.values?.[0];
    if (typeof ndvi !== "number") {
      return json({ error: "NDVI value unavailable for this location" }, 502, origin);
    }

    return json({
      ndvi,
      sceneDate: item.properties?.datetime ?? null,
      cloudCover: item.properties?.["eo:cloud_cover"] ?? null,
      itemId: item.id,
    }, 200, origin);

  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[satellite-proxy] error:", message);
    return json({ error: message }, 500, origin);
  }
});
