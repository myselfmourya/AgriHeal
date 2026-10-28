/**
 * AgriHeal — News Proxy Edge Function
 *
 * Real, live agricultural news — not AI-invented articles. Fetches Google
 * News' public RSS feed (no API key, no rate limit tied to our AI provider
 * quotas) server-side, since the browser can't hit news.google.com directly
 * (no CORS headers on their end), and returns clean JSON.
 *
 * Request body: { query?: string, location?: string, crops?: string[] }
 * Response: { articles: Array<{ title, link, source, pubDate, summary }> }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

function corsHeaders(origin: string | null): Record<string, string> {
  const isLocalDev = !!origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const allowed = origin && (ALLOWED_ORIGINS.includes(origin) || isLocalDev) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  // Google's RSS <description> is itself HTML-escaped (e.g. "&lt;a href=...&gt;"),
  // so entities must be decoded first — stripping tags before that leaves the
  // now-decoded <a> markup untouched in the final text.
  return decodeEntities(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].trim() : "";
}

interface Article {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  summary: string;
}

function parseRss(xml: string): Article[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map((item) => {
    const rawTitle = stripTags(extractTag(item, "title"));
    // Google News titles are "Headline - Source"; the <source> tag is cleaner when present.
    const sourceMatch = item.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
    const source = sourceMatch ? stripTags(sourceMatch[1]) : (rawTitle.split(" - ").pop() ?? "Google News");
    const title = sourceMatch ? rawTitle : rawTitle.replace(new RegExp(`\\s*-\\s*${source}$`), "");
    const link = extractTag(item, "link").trim();
    const pubDate = extractTag(item, "pubDate").trim();
    const description = stripTags(extractTag(item, "description"));

    return { title, link, source, pubDate, summary: description };
  });
}

serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const body = await req.json().catch(() => ({})) as {
      query?: string;
      location?: string;
      crops?: string[];
    };

    const terms = [
      "agriculture OR farming OR farmers",
      body.location ? body.location.split(",")[0].trim() : "India",
      ...(body.crops ?? []).slice(0, 2),
    ].filter(Boolean);
    const query = body.query || terms.join(" ");

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const res = await fetch(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AgriHealBot/1.0)" },
    });
    if (!res.ok) throw new Error(`Google News RSS returned ${res.status}`);

    const xml = await res.text();
    const articles = parseRss(xml).slice(0, 20);

    if (articles.length === 0) throw new Error("No articles found");

    return new Response(JSON.stringify({ articles, query, fetchedAt: new Date().toISOString() }), {
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      status: 500,
    });
  }
});
