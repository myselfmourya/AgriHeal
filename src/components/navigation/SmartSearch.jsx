import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, X, Clock, TrendingUp, ChevronRight, Leaf, Activity, Video, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ['all', 'crops', 'diseases', 'videos', 'marketplace', 'experts', 'reports', 'schemes'];

const MOCK_RESULTS = {
  'Tomato': [
    { type: 'Crop', title: 'Tomato (Solanum lycopersicum)', desc: 'View crop management guide', icon: Leaf },
    { type: 'Disease', title: 'Tomato Late Blight', desc: 'Fungal disease affecting leaves and stems', icon: Activity },
    { type: 'Video', title: 'Best practices for Tomato farming', desc: '10 min video by Expert Dr. Sharma', icon: Video },
    { type: 'Article', title: 'Tomato Market Trends 2026', desc: 'Read latest market insights', icon: Newspaper },
  ]
};

const RECENT_SEARCHES = ['Cotton pests', 'Urea price', 'Weather tomorrow', 'Yellow leaves on chili'];
const TRENDING_SEARCHES = ['PM Kisan Scheme 2026', 'Mango flowering care', 'Drip irrigation subsidies'];

export default function SmartSearch({ isActive, setActive }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Focus input when active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setActive(true);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert("Voice search is not supported in your browser.");
    }
  };

  const clearSearch = () => {
    setQuery('');
    setActive(false);
    if (inputRef.current) inputRef.current.blur();
  };

  // Basic mock search logic
  const getResults = () => {
    if (!query) return null;
    // Simple mock fuzzy matching
    if (query.toLowerCase().includes('tomato')) {
      return MOCK_RESULTS['Tomato'];
    }
    return []; // empty for others in this mock
  };

  const results = getResults();

  return (
    <div className="relative w-full">
      {/* Search Bar */}
      <div 
        className={`relative flex items-center w-full transition-all duration-300 ${isActive ? 'ring-2 ring-green-500 rounded-2xl shadow-lg bg-white' : 'bg-gray-50 hover:bg-gray-100 rounded-full'}`}
      >
        <Search className={`absolute left-4 w-5 h-5 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
        <input 
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isActive) setActive(true);
          }}
          onFocus={() => setActive(true)}
          placeholder={t('search.placeholder')}
          className="w-full pl-10 md:pl-12 pr-16 md:pr-24 py-2.5 md:py-3 bg-transparent border-none text-sm text-gray-900 focus:outline-none placeholder-gray-400 font-medium"
        />
        
        <div className="absolute right-1.5 md:right-2 flex items-center gap-0.5 md:gap-1">
          {query && (
            <button onClick={clearSearch} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleVoiceSearch}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-gray-400 hover:bg-gray-100 hover:text-green-600'}`}
          >
            <Mic className="w-5 h-5" />
            {isListening && (
              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Panel */}
      {isActive && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
          
          {/* Categories */}
          <div className="flex overflow-x-auto scrollbar-hide p-2 border-b border-gray-100 gap-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {t(`search.categories.${cat}`)}
              </button>
            ))}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query ? (
              // Empty State: Recent & Trending
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    <Clock className="w-3 h-3" /> {t('search.recent')}
                  </h4>
                  <ul className="space-y-1">
                    {RECENT_SEARCHES.map(item => (
                      <li key={item}>
                        <button onClick={() => setQuery(item)} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between group">
                          {item}
                          <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    <TrendingUp className="w-3 h-3" /> {t('search.trending')}
                  </h4>
                  <ul className="space-y-1">
                    {TRENDING_SEARCHES.map(item => (
                      <li key={item}>
                        <button onClick={() => setQuery(item)} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 group">
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              // Results State
              <div className="p-2">
                {results && results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result, idx) => (
                      <button key={idx} className="w-full text-left flex items-start gap-3 p-3 hover:bg-green-50/50 rounded-xl transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-green-100 flex items-center justify-center shrink-0 transition-colors">
                          <result.icon className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-gray-900">{result.title}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">{result.type}</span>
                          </div>
                          <p className="text-xs text-gray-500">{result.desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{t('search.no_matches')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('search.try_searching')}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Context Info */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" /> {t('search.ai_context')}
            </span>
            <button className="text-xs font-semibold text-green-600 hover:text-green-700">{t('search.advanced')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
