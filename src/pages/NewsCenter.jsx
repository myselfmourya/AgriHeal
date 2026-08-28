import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVani } from '../contexts/VaniContext';
import { useFarmer } from '../contexts/FarmerContext';
import { Volume2, Search, ArrowLeft, Globe, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchNews } from '../services/aiNewsService';
import { useTranslation } from 'react-i18next';

const CATEGORY_COLORS = {
  "Crop Diseases": "bg-red-100 text-red-700",
  "Weather": "bg-sky-100 text-sky-700",
  "Market": "bg-amber-100 text-amber-700",
  "Govt Policy": "bg-purple-100 text-purple-700",
  "Organic": "bg-green-100 text-green-700",
  "default": "bg-gray-100 text-gray-700"
};

const CATEGORIES = ['All', 'Crop Diseases', 'Weather', 'Market', 'Govt Policy', 'Organic'];

export default function NewsCenter() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { speak } = useVani();
  const { profile } = useFarmer();
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const loadNews = async (forceRefresh = false) => {
    setNewsLoading(true);
    try {
      const fetchedNews = await fetchNews(profile?.location || "India", profile?.crops || ["Wheat", "Rice"], 'en', forceRefresh);
      if (fetchedNews && fetchedNews.length > 0) {
        setNews(fetchedNews);
      }
    } catch (err) {
      console.error("Error loading news:", err);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [profile]);

  const handleListen = (article) => {
    speak(`${article.headline || article.title}. ${article.summary || article.description}`);
  };

  const filteredNews = useMemo(() => {
    return news.filter(article => {
      const matchText = ((article.headline || article.title) + " " + (article.summary || article.description)).toLowerCase();
      const matchesSearch = matchText.includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (activeTab === 'All') return true;
      return article.category === activeTab;
    });
  }, [news, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">{t("News Center")}</h1>
        <button 
          onClick={() => loadNews(true)} 
          disabled={newsLoading}
          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${newsLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        
        {/* News Grid */}
        {newsLoading ? (
          <div className="flex items-center gap-2 bg-green-50 rounded-2xl px-4 py-3 mb-4 text-green-600 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            {t("Fetching latest agricultural news with AI...")}
          </div>
        ) : null}

        {!newsLoading && filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNews.map((article, i) => {
              const catColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.default;
              const isExpanded = expanded === `${i}`;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.06 }}
                  className="bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="p-4 cursor-pointer flex-grow flex flex-col" onClick={() => setExpanded(isExpanded ? null : `${i}`)}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${catColor}`}>
                        {t(article.category || 'News')}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 bg-white/50 px-2 py-0.5 rounded-full backdrop-blur-sm shrink-0 whitespace-nowrap">
                        {article.source || t('AgriNews')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug mb-2 flex-grow">
                      {article.headline || article.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {article.summary || article.description}
                    </p>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: "auto" }} 
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-gray-100 shrink-0"
                      >
                        <div className="p-4 bg-gray-50/50">
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                            {article.summary || article.description}
                          </p>
                          <div className="flex gap-2 mt-3 flex-col sm:flex-row">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleListen(article); }} 
                              className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 active:scale-[0.98] transition-all"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> {t("Listen")}
                            </button>
                            {article.articleUrl && (
                              <a
                                href={article.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold hover:bg-stone-200 active:scale-[0.98] transition-all"
                              >
                                {t("Read full article ↗")}
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl">
            <Globe className="mx-auto text-gray-300 mb-4 w-12 h-12" />
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">{t("No News Found")}</h3>
            <p className="text-[13px] text-gray-500">{t("Try adjusting your filters or search query.")}</p>
          </div>
        )}

      </div>
    </div>
  );
}
