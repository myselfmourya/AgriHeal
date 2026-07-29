import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVani } from '../contexts/VaniContext';
import { useFarmer } from '../contexts/FarmerContext';
import { Search, Volume2, Bookmark, Globe, Clock, ShieldAlert, CloudRain, TrendingUp, Building2, Leaf } from 'lucide-react';

const NEWS_DATA = [
  {
    id: 1,
    headline: 'Rice Blast Outbreak in Warangal District',
    summary: 'Agricultural experts warn of a severe rice blast outbreak in Warangal due to unusual humidity. Farmers are advised to spray recommended fungicides immediately to prevent yield loss.',
    source: 'ICAR',
    category: 'Crop Diseases',
    date: '2 hours ago',
    readTime: '3 min read',
    featured: true,
    color: 'from-violet-500 to-fuchsia-600',
    icon: ShieldAlert
  },
  {
    id: 2,
    headline: 'PM-KISAN 16th Installment Released',
    summary: 'The central government has released the 16th installment of the PM-KISAN scheme, crediting ₹2000 directly to the bank accounts of over 8 crore eligible farmers.',
    source: 'PIB',
    category: 'Govt Policy',
    date: '4 hours ago',
    readTime: '2 min read',
    color: 'from-blue-500 to-indigo-600',
    icon: Building2
  },
  {
    id: 3,
    headline: 'Heavy Rainfall Alert for Telangana',
    summary: 'The IMD has issued a red alert for several districts in Telangana, predicting heavy to very heavy rainfall over the next 48 hours. Farmers should postpone harvesting operations.',
    source: 'IMD',
    category: 'Weather',
    date: '6 hours ago',
    readTime: '1 min read',
    color: 'from-cyan-500 to-blue-600',
    icon: CloudRain
  },
  {
    id: 4,
    headline: 'Cotton Prices Rise 15% at Yavatmal APMC',
    summary: 'Driven by strong export demand and lower domestic yields, raw cotton prices have surged by 15% in major agricultural markets across Maharashtra.',
    source: 'AgriMarket',
    category: 'Market',
    date: '10 hours ago',
    readTime: '4 min read',
    color: 'from-emerald-500 to-green-600',
    icon: TrendingUp
  },
  {
    id: 5,
    headline: 'New Organic Certification Simplified',
    summary: 'APEDA has announced a streamlined digital process for obtaining organic farming certification, significantly reducing paperwork and processing time for small-scale farmers.',
    source: 'APEDA',
    category: 'Organic',
    date: '12 hours ago',
    readTime: '3 min read',
    color: 'from-emerald-500 to-teal-600',
    icon: Leaf
  }
];

const CATEGORIES = ['All', 'Bookmarks', 'Crop Diseases', 'Weather', 'Market', 'Govt Policy', 'Organic'];

export default function NewsCenter() {
  const { speak } = useVani();
  const { profile } = useFarmer();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(new Set([2, 5]));

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleListen = (article) => {
    speak(`${article.headline}. ${article.summary}`);
  };

  const filteredNews = useMemo(() => {
    return NEWS_DATA.filter(article => {
      const matchesSearch = article.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (activeTab === 'All') return true;
      if (activeTab === 'Bookmarks') return bookmarks.has(article.id);
      return article.category === activeTab;
    });
  }, [activeTab, searchQuery, bookmarks]);

  const featuredArticle = activeTab === 'All' && !searchQuery ? NEWS_DATA.find(n => n.featured) : null;
  const regularNews = featuredArticle ? filteredNews.filter(n => n.id !== featuredArticle.id) : filteredNews;

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">AI News Center</h1>
          <p className="text-zinc-500 font-medium mt-1">Generative summaries customized for your farm.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search crop news, policies, weather..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/80 backdrop-blur-xl border border-white/50 text-zinc-900 rounded-full pl-12 pr-6 py-4 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 py-2">
        {CATEGORIES.map(category => (
          <button 
            key={category}
            onClick={() => setActiveTab(category)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeTab === category 
                ? 'bg-zinc-900 text-white shadow-md' 
                : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Article Span Full on Mobile, Left Col on Desktop */}
        <AnimatePresence>
          {featuredArticle && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="md:col-span-2 relative overflow-hidden rounded-[32px] shadow-xl group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${featuredArticle.color} opacity-90`} />
              <div className="absolute inset-0 bg-black/20" /> {/* Dim overlay */}
              
              <div className="relative p-8 md:p-10 text-white flex flex-col h-full justify-end">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                    {featuredArticle.category}
                  </span>
                  <span className="text-sm font-semibold opacity-90">{featuredArticle.source}</span>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight group-hover:underline decoration-white/30 underline-offset-4">
                  {featuredArticle.headline}
                </h2>
                
                <p className="text-white/80 md:text-lg mb-6 line-clamp-2 md:line-clamp-none max-w-3xl">
                  {featuredArticle.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                    <Clock size={16} />
                    {featuredArticle.date} • {featuredArticle.readTime}
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleListen(featuredArticle); }} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors">
                      <Volume2 size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(featuredArticle.id); }} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors">
                      <Bookmark size={18} className={bookmarks.has(featuredArticle.id) ? 'fill-white' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Regular News Grid (Masonry style on desktop) */}
        {regularNews.map((article, i) => {
          const Icon = article.icon;
          return (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-lg border border-white/50 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${article.color}`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${article.color}`}>
                    {article.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">
                  {article.source}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 mb-3 leading-snug">
                {article.headline}
              </h3>
              
              <p className="text-zinc-600 text-sm mb-6 flex-1 line-clamp-3">
                {article.summary}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                  <Clock size={12} /> {article.date}
                </span>
                
                <div className="flex gap-2">
                  <button onClick={() => handleListen(article)} className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors">
                    <Volume2 size={16} />
                  </button>
                  <button onClick={() => toggleBookmark(article.id)} className={`p-2 transition-colors ${bookmarks.has(article.id) ? 'text-indigo-600' : 'text-zinc-400 hover:text-indigo-600'}`}>
                    <Bookmark size={16} className={bookmarks.has(article.id) ? 'fill-indigo-600' : ''} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredNews.length === 0 && (
          <div className="md:col-span-2 py-12 text-center">
            <Globe className="mx-auto text-zinc-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No News Found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
