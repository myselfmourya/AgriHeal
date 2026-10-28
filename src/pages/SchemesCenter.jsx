import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVani } from '../contexts/VaniContext';
import { useFarmer } from '../contexts/FarmerContext';
import { Search, Volume2, Bookmark, CheckCircle2, XCircle, HelpCircle, ChevronRight, FileText, Bell, Sparkles } from 'lucide-react';

import SchemeDetailModal from '../components/SchemeDetailModal';
import { SCHEMES_DATA } from '../data/schemes';
import { useVoiceActions } from '../hooks/useVoiceActions';

const CATEGORIES = ['All', 'Central Govt', 'State Govt', 'Insurance', 'Loans', 'Subsidies'];

export default function SchemesCenter() {
  const { speak } = useVani();
  const { profile, myCrops } = useFarmer();
  
  const [currentLocation, setCurrentLocation] = useState('Detecting...');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityState, setEligibilityState] = useState('idle'); // idle, checking, done
  const [savedSchemes, setSavedSchemes] = useState(new Set());
  const [applyingScheme, setApplyingScheme] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const farmSizeVal = parseFloat(profile.farmSize) || 0;
  let farmerCategory = 'Large Farm';
  if (farmSizeVal <= 2.5) farmerCategory = 'Marginal Farm';
  else if (farmSizeVal <= 5) farmerCategory = 'Small Farm';
  else if (farmSizeVal <= 10) farmerCategory = 'Medium Farm';

  const userCropsStr = myCrops.map(c => c.name).join(', ');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await res.json();
            if (data.principalSubdivision) {
              setCurrentLocation(data.principalSubdivision);
            } else {
              setCurrentLocation(profile.state);
            }
          } catch (error) {
            console.error("Error fetching location", error);
            setCurrentLocation(profile.state);
          }
        },
        (error) => {
          console.error("Error getting geolocation", error);
          setCurrentLocation(profile.state);
        }
      );
    } else {
      setCurrentLocation(profile.state);
    }
  }, []);

  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATA.filter(scheme => {
      const matchesCategory = activeTab === 'All' || scheme.category === activeTab;
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            scheme.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleEligibilityCheck = () => {
    setEligibilityState('checking');
    speak(`Analyzing your farm profile. ${profile.farmSize}, growing ${userCropsStr} in ${currentLocation}.`);
    setTimeout(() => {
      setEligibilityState('done');
      speak("Eligibility check complete. I have highlighted the schemes you are eligible for.");
    }, 2500);
  };

  const handleToggleSave = (id) => {
    setSavedSchemes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        speak("Scheme saved to your profile.");
      }
      return next;
    });
  };

  useVoiceActions([
    {
      id: 'schemes.search',
      description: 'Search government schemes by name or keyword',
      params: { query: 'string, required' },
      destructive: false,
      handler: ({ query }) => {
        setSearchQuery(query || '');
        return query ? `Searching for "${query}".` : 'Cleared the search.';
      },
    },
    {
      id: 'schemes.switchCategory',
      description: `Filter the schemes list by category: ${CATEGORIES.join(', ')}`,
      params: { category: `one of: ${CATEGORIES.join(', ')}` },
      destructive: false,
      handler: ({ category }) => {
        const match = CATEGORIES.find((c) => c.toLowerCase() === String(category || '').toLowerCase());
        if (!match) throw new Error(`"${category}" isn't a scheme category here.`);
        setActiveTab(match);
        return `Showing ${match} schemes.`;
      },
    },
    {
      id: 'schemes.saveScheme',
      description: 'Save or unsave a government scheme by name, for later reference',
      params: { schemeName: 'string, required' },
      destructive: false,
      handler: ({ schemeName }) => {
        const match = SCHEMES_DATA.find((s) => s.name.toLowerCase().includes(String(schemeName || '').toLowerCase()));
        if (!match) throw new Error(`I couldn't find a scheme matching "${schemeName}".`);
        const wasSaved = savedSchemes.has(match.id);
        handleToggleSave(match.id);
        return wasSaved ? `Unsaved ${match.name}.` : `Saved ${match.name}.`;
      },
    },
    {
      id: 'schemes.checkEligibility',
      description: "Run an eligibility check against the farmer's profile to highlight which schemes they qualify for",
      params: {},
      destructive: false,
      handler: () => {
        handleEligibilityCheck();
        return 'Checking your eligibility now.';
      },
    },
  ], [savedSchemes, profile, currentLocation]);

  const handleApply = (scheme) => {
    setApplyingScheme(scheme);
    speak(`Let's apply for ${scheme.name}. I will guide you through the process.`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 pt-6 space-y-6 px-4 md:px-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Schemes and Insurances</h1>
          <p className="text-zinc-500 font-medium mt-1">Discover and apply for agricultural subsidies and benefits.</p>
        </div>
      </div>

      {/* AI Eligibility Check Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] shadow-xl p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={120} /></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
              <Sparkles size={24} /> Let AI Check Your Eligibility
            </h2>
            <p className="text-indigo-100 mb-6">We'll use your farm profile to automatically find schemes you qualify for, saving you hours of research.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider block mb-1">Land</span>
                <span className="font-black text-lg">{profile.farmSize}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider block mb-1">Crops</span>
                <span className="font-black text-lg truncate block" title={userCropsStr}>{userCropsStr || 'None'}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider block mb-1">State</span>
                <span className="font-black text-lg truncate block" title={currentLocation}>{currentLocation}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider block mb-1">Category</span>
                <span className="font-black text-lg">{farmerCategory}</span>
              </div>
            </div>
            
            <button 
              onClick={handleEligibilityCheck}
              disabled={eligibilityState === 'checking'}
              className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
            >
              {eligibilityState === 'idle' && 'Check My Eligibility Now'}
              {eligibilityState === 'checking' && <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"/> Analyzing Profile...</span>}
              {eligibilityState === 'done' && '✓ Eligibility Checked'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search for schemes, subsidies, loans..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/80 backdrop-blur-xl border border-white/50 text-zinc-900 rounded-full pl-12 pr-6 py-4 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium outline-none"
        />
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 py-2">
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeTab === cat 
                ? 'bg-zinc-900 text-white shadow-md' 
                : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme, i) => {
          const isEligible = eligibilityState === 'done' 
            ? (scheme.states.includes('All') || scheme.states.includes(currentLocation)) 
            : null;
          
          return (
            <motion.div 
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-lg border border-white/50 overflow-hidden flex flex-col group hover:shadow-xl transition-all"
            >
              <div className={`h-3 w-full bg-gradient-to-r ${scheme.color}`} />
              
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
                      {scheme.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 leading-snug">{scheme.name}</h3>
                    <p className="text-sm font-semibold text-zinc-500 mt-1">{scheme.source}</p>
                  </div>
                  <button onClick={() => handleToggleSave(scheme.id)} className={`p-3 rounded-full transition-colors ${savedSchemes.has(scheme.id) ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}`}>
                    <Bookmark size={20} className={savedSchemes.has(scheme.id) ? 'fill-indigo-600' : ''} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 flex items-center gap-1.5">
                    <FileText size={14}/> {scheme.benefit}
                  </span>
                  
                  {eligibilityState === 'done' ? (
                    isEligible ? (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle2 size={14}/> Eligible
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-1.5">
                        <XCircle size={14}/> Not Eligible
                      </span>
                    )
                  ) : (
                    <span className="px-3 py-1.5 bg-zinc-50 text-zinc-500 rounded-xl text-sm font-bold border border-zinc-200 flex items-center gap-1.5">
                      <HelpCircle size={14}/> Eligibility Unknown
                    </span>
                  )}
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 mb-6 flex-1 border border-zinc-100">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Quick Overview</h4>
                  <p className="text-zinc-700 text-[15px] leading-relaxed line-clamp-3">{scheme.desc}</p>
                </div>

                {scheme.deadline !== 'Ongoing' && (
                  <div className="flex items-center gap-2 mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm font-bold">
                    <Bell size={16} /> Deadline: {scheme.deadline}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => speak(`The ${scheme.name} scheme provides ${scheme.benefit}. ${scheme.desc}`)}
                    className="py-3 bg-zinc-100 text-zinc-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                  >
                    <Volume2 size={18} /> Explain
                  </button>
                  <button 
                    onClick={() => setSelectedScheme(scheme)}
                    className="py-3 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                  >
                    View Details <ChevronRight size={18} />
                  </button>
                </div>
                
                {(!eligibilityState || isEligible !== false) && (
                  <div className="text-center mt-4">
                    <span onClick={() => handleApply(scheme)} className="text-sm font-bold text-indigo-500 cursor-pointer hover:text-indigo-600 flex items-center justify-center gap-1">
                      <Sparkles size={14}/> Let Vani Guide You
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <SchemeDetailModal 
        scheme={selectedScheme}
        isOpen={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
      />

      {/* Application Guide Modal */}
      <AnimatePresence>
        {applyingScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => setApplyingScheme(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white/90 backdrop-blur-2xl w-full max-w-lg rounded-[32px] p-8 shadow-2xl border border-white"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${applyingScheme.color} flex items-center justify-center mb-6`}>
                <FileText className="text-white" size={32} />
              </div>
              
              <h3 className="text-2xl font-extrabold text-zinc-900 mb-2">Apply for {applyingScheme.name}</h3>
              <p className="text-zinc-600 mb-8">Follow these steps to complete your application. Vani can assist you via voice for each step.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Prepare Documents</h4>
                    <p className="text-sm text-zinc-500 mt-1">Aadhar Card, Land Records (Pattadar Passbook), and Bank Passbook.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Verify Identity</h4>
                    <p className="text-sm text-zinc-500 mt-1">Link your bank account to your Aadhar number and verify mobile OTP.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Submit Application</h4>
                    <p className="text-sm text-zinc-500 mt-1">Fill the online form or visit your nearest CSC center.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    speak(`Starting the application process for ${applyingScheme.name}. First, please ensure your Aadhar card is ready.`);
                    setApplyingScheme(null);
                  }}
                >
                  Start with Vani AI
                </button>
                <button 
                  className="flex-1 py-4 bg-zinc-100 text-zinc-700 font-bold rounded-2xl hover:bg-zinc-200 transition-all"
                  onClick={() => setApplyingScheme(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
