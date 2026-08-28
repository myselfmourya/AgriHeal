import { generateStructuredResponse } from './aiProvider';

// Cache structure: { timestamp, location, data }
const CACHE_KEY = "wellpath_news_cache";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const fetchNews = async (location, crops, language = 'en', forceRefresh = false) => {
  // 1. Check Local Cache First
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        // Check if cache is valid and matches the requested location/language
        if (
          Date.now() - cached.timestamp < CACHE_DURATION_MS &&
          cached.location === location
        ) {
          console.log("Serving news from cache");
          return cached.data;
        }
      }
    } catch (e) {
      console.warn("Failed to read news cache", e);
    }
  }

  console.log("Fetching fresh news from AI...");

  const prompt = `Generate 14 realistic, recent agricultural news articles relevant to the location: "${location}". The farmer grows these crops: "${crops.join(', ')}". The response must be in the "en" language. Ensure variety in topics.`;
  const schema = `
  An Array of Objects. Each Object MUST contain:
  - "id": A unique integer ID.
  - "headline": The news headline.
  - "summary": A 2-3 sentence summary of the news.
  - "source": A realistic source (e.g., "ICAR", "IMD", "Local Agri Market").
  - "category": Must be one of: "Crop Diseases", "Weather", "Market", "Govt Policy", "Organic".
  - "date": Relative time (e.g., "2 hours ago").
  - "readTime": Estimated read time (e.g., "3 min read").
  - "featured": true for the first 2 most important articles, false for others.
  - "color": A Tailwind gradient string (e.g., "from-violet-500 to-fuchsia-600").
  - "iconName": The name of the lucide icon (e.g., "ShieldAlert", "CloudRain", "TrendingUp", "Building2", "Leaf", "Globe").
  - "imageKeyword": A single word keyword to fetch a relevant unsplash image (e.g. "tractor", "farm", "wheat", "rain").
  - "articleUrl": A valid URL that searches for this news (e.g., "https://news.google.com/search?q=" followed by URL encoded headline).
  `;

  // 2. Fetch from AI Provider Directly
  try {
    let newsData = await generateStructuredResponse(prompt, schema, "You are an agricultural news API serving the AgriHeal app.");

    // Ensure newsData is an array
    if (!Array.isArray(newsData)) {
      const arrayKey = Object.keys(newsData).find(k => Array.isArray(newsData[k]));
      if (arrayKey) {
        newsData = newsData[arrayKey];
      } else {
        throw new Error("AI returned a JSON object without an array.");
      }
    }
    
    if (!newsData || newsData.length === 0) {
      throw new Error("AI returned empty news array");
    }

    // Ensure articleUrl is present
    newsData = newsData.map(article => ({
      ...article,
      articleUrl: article.articleUrl || `https://news.google.com/search?q=${encodeURIComponent(article.headline || article.title || '')}`
    }));

    // 3. Save to Cache (only if we have data)
    if (newsData.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        location,
        data: newsData
      }));
    }

    return newsData;
  } catch (error) {
    console.warn("Error generating news, using fallback data:", error);
    // Graceful fallback to avoid crashing the app - providing 14 items for a rich feed
    const generateFallbackUrl = (headline) => `https://news.google.com/search?q=${encodeURIComponent(headline)}`;
    
    const fallbackNews = [
      {
        id: 1,
        headline: "Government Announces New Subsidies for Drip Irrigation",
        summary: "The state agricultural department has launched a new scheme providing up to 80% subsidy for farmers installing drip irrigation systems.",
        source: "Ministry of Agriculture",
        category: "Govt Policy",
        date: "2 hours ago",
        readTime: "3 min read",
        featured: true,
        color: "from-green-500 to-emerald-600",
        iconName: "ShieldAlert",
        imageKeyword: "irrigation",
        articleUrl: generateFallbackUrl("Government Announces New Subsidies for Drip Irrigation")
      },
      {
        id: 2,
        headline: "Monsoon Expected to Arrive Early This Year",
        summary: "Meteorological department forecasts an early onset of monsoon, advising farmers to prepare their fields accordingly.",
        source: "IMD",
        category: "Weather",
        date: "5 hours ago",
        readTime: "2 min read",
        featured: true,
        color: "from-blue-500 to-cyan-600",
        iconName: "CloudRain",
        imageKeyword: "monsoon",
        articleUrl: generateFallbackUrl("Monsoon Expected to Arrive Early This Year")
      },
      {
        id: 3,
        headline: "Market Prices for Cotton Surge Due to Export Demand",
        summary: "Domestic cotton prices have seen a 15% increase over the last week driven by strong international demand.",
        source: "Agri Market News",
        category: "Market",
        date: "1 day ago",
        readTime: "4 min read",
        featured: false,
        color: "from-yellow-500 to-orange-600",
        iconName: "TrendingUp",
        imageKeyword: "cotton",
        articleUrl: generateFallbackUrl("Market Prices for Cotton Surge Due to Export Demand")
      },
      {
        id: 4,
        headline: "New Pest Warning Issued for Tomato Crops",
        summary: "Agricultural experts warn of a new strain of fruit borer affecting tomato yields. Farmers are advised to use organic neem-based sprays.",
        source: "ICAR",
        category: "Crop Diseases",
        date: "1 day ago",
        readTime: "2 min read",
        featured: false,
        color: "from-red-500 to-rose-600",
        iconName: "Bug",
        imageKeyword: "tomato",
        articleUrl: generateFallbackUrl("New Pest Warning Issued for Tomato Crops")
      },
      {
        id: 5,
        headline: "Organic Farming Certification Process Simplified",
        summary: "The government has introduced a new digital portal to make the organic farming certification process faster and completely paperless.",
        source: "APEDA",
        category: "Organic",
        date: "2 days ago",
        readTime: "3 min read",
        featured: false,
        color: "from-emerald-500 to-teal-600",
        iconName: "Leaf",
        imageKeyword: "organic",
        articleUrl: generateFallbackUrl("Organic Farming Certification Process Simplified")
      },
      {
        id: 6,
        headline: "Heavy Rains Expected in Coastal Districts",
        summary: "Fishermen and coastal farmers are advised to take precautions as a low-pressure area has formed in the Bay of Bengal.",
        source: "IMD",
        category: "Weather",
        date: "2 days ago",
        readTime: "2 min read",
        featured: false,
        color: "from-blue-500 to-cyan-600",
        iconName: "CloudRain",
        imageKeyword: "rain",
        articleUrl: generateFallbackUrl("Heavy Rains Expected in Coastal Districts")
      },
      {
        id: 7,
        headline: "Wheat Procurement Reaches All-Time High",
        summary: "FCI reports record wheat procurement this Rabi season, ensuring food security and timely MSP payments to farmers.",
        source: "Food Corporation of India",
        category: "Market",
        date: "3 days ago",
        readTime: "5 min read",
        featured: false,
        color: "from-amber-500 to-orange-600",
        iconName: "TrendingUp",
        imageKeyword: "wheat",
        articleUrl: generateFallbackUrl("Wheat Procurement Reaches All-Time High")
      },
      {
        id: 8,
        headline: "Drone Technology Training Camps for Youth",
        summary: "State government is organizing free drone operation training for rural youth to boost precision agriculture adoption.",
        source: "State Agri Dept",
        category: "Govt Policy",
        date: "4 days ago",
        readTime: "3 min read",
        featured: false,
        color: "from-violet-500 to-purple-600",
        iconName: "Crosshair",
        imageKeyword: "drone",
        articleUrl: generateFallbackUrl("Drone Technology Training Camps for Youth")
      },
      {
        id: 9,
        headline: "New High-Yielding Rice Variety Released",
        summary: "Scientists at ICAR have successfully tested a new rice variety that promises 20% higher yield and better disease resistance.",
        source: "ICAR",
        category: "Crop Diseases",
        date: "5 days ago",
        readTime: "4 min read",
        featured: false,
        color: "from-teal-500 to-emerald-600",
        iconName: "Leaf",
        imageKeyword: "rice",
        articleUrl: generateFallbackUrl("New High-Yielding Rice Variety Released")
      },
      {
        id: 10,
        headline: "Solar Pump Subsidy Program Extended",
        summary: "The Ministry of New and Renewable Energy has extended the deadline for the PM-KUSUM solar pump subsidy scheme.",
        source: "Ministry of Power",
        category: "Govt Policy",
        date: "6 days ago",
        readTime: "3 min read",
        featured: false,
        color: "from-yellow-400 to-orange-500",
        iconName: "Sun",
        imageKeyword: "solar",
        articleUrl: generateFallbackUrl("Solar Pump Subsidy Program Extended")
      },
      {
        id: 11,
        headline: "Spike in Onion Prices Concerns Consumers",
        summary: "Unseasonal rains have damaged onion crops in major producing states, leading to a temporary price hike in wholesale markets.",
        source: "Market Watch",
        category: "Market",
        date: "1 week ago",
        readTime: "4 min read",
        featured: false,
        color: "from-red-500 to-pink-600",
        iconName: "TrendingUp",
        imageKeyword: "onion",
        articleUrl: generateFallbackUrl("Spike in Onion Prices Concerns Consumers")
      },
      {
        id: 12,
        headline: "Advancements in Soil Health Card Scheme",
        summary: "Millions of farmers have benefited from the digital integration of the Soil Health Card scheme, enabling real-time nutrient tracking.",
        source: "Ministry of Agriculture",
        category: "Govt Policy",
        date: "1 week ago",
        readTime: "3 min read",
        featured: false,
        color: "from-stone-500 to-orange-700",
        iconName: "FileText",
        imageKeyword: "soil",
        articleUrl: generateFallbackUrl("Advancements in Soil Health Card Scheme")
      },
      {
        id: 13,
        headline: "El Niño Effects Expected to Subside",
        summary: "Global climate models indicate that the El Niño phenomenon is weakening, which could lead to normal monsoon conditions next year.",
        source: "World Meteorological Organization",
        category: "Weather",
        date: "2 weeks ago",
        readTime: "5 min read",
        featured: false,
        color: "from-cyan-500 to-blue-700",
        iconName: "Cloud",
        imageKeyword: "climate",
        articleUrl: generateFallbackUrl("El Niño Effects Expected to Subside")
      },
      {
        id: 14,
        headline: "Export Ban on Certain Pulses Lifted",
        summary: "To support local farmers, the government has lifted the export ban on specific pulses, opening up international markets.",
        source: "Trade Ministry",
        category: "Market",
        date: "2 weeks ago",
        readTime: "3 min read",
        featured: false,
        color: "from-green-600 to-teal-800",
        iconName: "Globe",
        imageKeyword: "pulses",
        articleUrl: generateFallbackUrl("Export Ban on Certain Pulses Lifted")
      }
    ];

    return fallbackNews;
  }
};
