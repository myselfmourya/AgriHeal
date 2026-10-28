import { supabase } from '../lib/supabase';

// Cache structure: { timestamp, location, data }
const CACHE_KEY = "wellpath_news_cache";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes — real news changes faster than the old 24h AI-cache did

const CATEGORY_RULES = [
  { category: 'Weather', keywords: ['monsoon', 'rain', 'weather', 'cyclone', 'flood', 'drought', 'imd'] },
  { category: 'Crop Diseases', keywords: ['pest', 'disease', 'blight', 'fungus', 'infestation', 'virus'] },
  { category: 'Market', keywords: ['price', 'market', 'export', 'import', 'msp', 'mandi', 'procurement'] },
  { category: 'Organic', keywords: ['organic', 'natural farming', 'sustainable'] },
  { category: 'Govt Policy', keywords: ['scheme', 'subsidy', 'policy', 'ministry', 'government', 'kisan', 'yojana'] },
];

const CATEGORY_META = {
  'Weather': { color: 'from-blue-500 to-cyan-600', iconName: 'CloudRain', imageKeyword: 'rain' },
  'Crop Diseases': { color: 'from-red-500 to-rose-600', iconName: 'Bug', imageKeyword: 'crop' },
  'Market': { color: 'from-amber-500 to-orange-600', iconName: 'TrendingUp', imageKeyword: 'market' },
  'Organic': { color: 'from-emerald-500 to-teal-600', iconName: 'Leaf', imageKeyword: 'organic' },
  'Govt Policy': { color: 'from-purple-500 to-violet-600', iconName: 'ShieldAlert', imageKeyword: 'government' },
  'default': { color: 'from-gray-500 to-slate-600', iconName: 'Globe', imageKeyword: 'farm' },
};

function categorize(text) {
  const lower = text.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.category;
  }
  return 'Govt Policy';
}

function relativeDate(pubDate) {
  const then = new Date(pubDate).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function readTimeFor(summary) {
  const words = (summary || '').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 150));
  return `${mins} min read`;
}

export const fetchNews = async (location, crops, language = 'en', forceRefresh = false) => {
  // 1. Check Local Cache First
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (
          Date.now() - cached.timestamp < CACHE_DURATION_MS &&
          cached.location === location
        ) {
          return cached.data;
        }
      }
    } catch (e) {
      console.warn("Failed to read news cache", e);
    }
  }

  // 2. Fetch real, live articles from Google News via our server-side proxy
  // (the browser can't hit news.google.com directly — no CORS headers there).
  const { data, error } = await supabase.functions.invoke('news-proxy', {
    body: { location, crops },
  });

  if (error) {
    console.error("News proxy error:", error);
    throw new Error(`[news-proxy] ${error.message}`);
  }
  if (!data?.articles?.length) {
    throw new Error("No live news articles returned");
  }

  const newsData = data.articles.map((a, i) => {
    const category = categorize(`${a.title} ${a.summary}`);
    const meta = CATEGORY_META[category] || CATEGORY_META.default;
    return {
      id: i + 1,
      headline: a.title,
      summary: a.summary || a.title,
      source: a.source,
      category,
      date: relativeDate(a.pubDate),
      readTime: readTimeFor(a.summary),
      featured: i < 2,
      color: meta.color,
      iconName: meta.iconName,
      imageKeyword: meta.imageKeyword,
      articleUrl: a.link,
    };
  });

  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    location,
    data: newsData,
  }));

  return newsData;
};
