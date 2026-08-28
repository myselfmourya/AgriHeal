import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, CalendarPlus, Leaf, MessageCircle, MapPin, 
  Sparkles, Bot, Newspaper, ArrowUpRight, CloudSun,
  ShieldCheck, Droplets, Users, Activity, ShoppingCart, Wrench, TrendingUp
} from 'lucide-react';
import { useFarmer } from '../contexts/FarmerContext';
import { useTranslation } from 'react-i18next';
import { useVani } from '../contexts/VaniContext';
import { fetchNews } from '../services/aiNewsService';
import DashboardQuickAccessModal from './DashboardQuickAccessModal';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good Night";
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { profile } = useFarmer();
  const { t } = useTranslation();
  const { startVaniSession } = useVani();
  
  // Agri-specific state
  const [agriTip, setAgriTip] = useState("Check soil moisture levels before evening irrigation to conserve water.");
  const [reminder, setReminder] = useState(null);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [quickAccessModal, setQuickAccessModal] = useState(null);
  
  const QUICK_ACTIONS = [
    { icon: Bot, label: "Vani Settings", action: () => navigate('/settings/voice') },
    { icon: Leaf, label: "Crops", action: () => setQuickAccessModal('Crops') },
    { icon: CloudSun, label: "Weather", action: () => setQuickAccessModal('Weather') },
    { icon: TrendingUp, label: "Growth", action: () => setQuickAccessModal('Growth') },
    { icon: Droplets, label: "Irrigation", action: () => setQuickAccessModal('Irrigation') },
    { icon: ShieldCheck, label: "Pest & Disease", action: () => setQuickAccessModal('Pest & Disease') },
    { icon: Activity, label: "Livestock", href: "/livestock" },
    { icon: ShoppingCart, label: "Market", action: () => setQuickAccessModal('Market Prices') },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Wrench, label: "Tools", href: "/store" },
  ];

  useEffect(() => {
    // Mock fetching a reminder
    setReminder({
      title: "Fertilize Wheat Crop",
      type: "Task",
      date: new Date().toLocaleDateString()
    });

    // Fetch AI-generated agri news
    const loadNews = async () => {
      try {
        const fetchedNews = await fetchNews(profile?.location || "India", profile?.crops || ["Wheat", "Rice"], 'en');
        if (fetchedNews && fetchedNews.length > 0) {
          // Display the top 3 news articles on the dashboard
          setNews(fetchedNews.slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading news:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    
    loadNews();
  }, []);

  const displayName = profile?.name || '';
  const firstName = displayName.split(' ')[0] || 'Farmer';
  const initials = displayName ? displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '🌿';

  return (
    <>
      {/* ── Header ── */}
      <header className="flex justify-between items-center mb-7">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border-2 border-white shadow-sm overflow-hidden bg-green-600 flex items-center justify-center text-white font-bold text-sm">
            {profile?.avatar ? (
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = initials || "FM";
                }} 
              />
            ) : (
              initials || "FM"
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t(getGreeting())}</p>
            <h1 className="text-base font-bold text-gray-900">{firstName} 👋</h1>
          </div>
        </div>
        <button 
          onClick={() => navigate('/notifications')}
          className="h-10 w-10 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 relative hover:bg-gray-50 transition-colors"
        >
          <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
          {/* Unread dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-600 rounded-full" />
        </button>
      </header>

      {/* ── Hero Heading ── */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-sm text-gray-400 font-medium mb-1">{t("My Farm")}</p>
        <h2 className="text-[28px] font-bold text-gray-900 leading-[1.2]">
          {t("I Hope Your")} <span className="text-green-600">{t("Crops Are Thriving")}</span> {t("Today!")}
        </h2>
      </motion.div>

      {/* ── Premium Aesthetic Promo Card ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-[2rem] p-6 mb-8 relative overflow-hidden shadow-2xl shadow-green-900/20 bg-gradient-to-br from-green-600 via-emerald-700 to-slate-900 flex flex-col justify-between min-h-[180px] border border-white/10"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />

        {/* Abstract Floating Icons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none">
          <motion.div animate={{ y: [-4, 4, -4], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-0 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-lg transform rotate-12">
            <CloudSun className="w-6 h-6 text-green-200" />
          </motion.div>
          <motion.div animate={{ y: [4, -4, 4], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }} className="absolute bottom-2 left-0 w-14 h-14 bg-gradient-to-tr from-teal-400 to-green-500 rounded-full p-0.5 shadow-xl shadow-teal-500/30">
            <div className="w-full h-full bg-slate-900/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white fill-white/20" />
            </div>
          </motion.div>
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-teal-400 blur-sm" />
        </div>

        <div className="relative z-10 w-[70%]">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-teal-50 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 backdrop-blur-md border border-white/10 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-teal-300" /> {t("Smart Agriculture")}
          </span>
          <h3 className="text-2xl font-black text-white mb-4 leading-[1.15] tracking-tight">
            {t("Consult Top")}<br />{t("Experts")} <span className="text-teal-300">{t("Instantly")}</span>
          </h3>
          <Link to="/farm-care" className="inline-flex items-center w-fit gap-2 bg-white text-emerald-900 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-green-50 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10">
            {t("Get Advice")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* ── Explore Features ── */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-900">{t("Explore")}</h3>
        </div>
        <div className="grid grid-cols-5 gap-2.5 pb-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            const Wrapper = action.href ? Link : 'button';
            const props = action.href ? { to: action.href } : { onClick: action.action };

            return (
              <Wrapper {...props} key={action.label} className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 active:scale-95 text-gray-800 px-3 py-2.5 rounded-2xl text-[13px] font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer">
                <Icon className="w-4 h-4 shrink-0 text-green-600" />
                {t(action.label)}
              </Wrapper>
            );
          })}
        </div>
      </motion.div>

      {/* ── Daily Vani Tip ── */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
        className="mb-8"
      >
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t("Daily Vani Tip")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{t("Your AI farming companion says:")}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-200/40 rounded-full blur-2xl" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-orange-200/40 rounded-full blur-2xl" />
          
          <div className="flex gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 leading-relaxed">
                {t(agriTip)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── News ── */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-900">{t("News")}</h3>
          <Link to="/news" className="text-[13px] text-green-600 font-bold flex items-center gap-0.5">
            {t("View all")} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {newsLoading ? (
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-gray-100">
                <div className="h-2 bg-gray-100 rounded w-1/5 mb-2.5" />
                <div className="h-3 bg-gray-100 rounded w-4/5 mb-1.5" />
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-3">
            {news.map((item, idx) => (
              <a key={idx} href={item.url || '#'} target="_blank" rel="noopener noreferrer" className="bg-white rounded-[1.5rem] p-5 flex flex-col gap-2 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center justify-center bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">{item.source || t('AgriNews')}</span>
                    <h4 className="text-[14px] font-bold text-gray-900 leading-snug group-hover:text-green-600 transition-colors">{item.headline || item.title}</h4>
                  </div>
                </div>
                {(item.summary || item.description) && (
                  <p className="text-[12px] text-gray-600 line-clamp-2 mt-1 leading-relaxed">{item.summary || item.description}</p>
                )}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50/80">
                  <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><CalendarPlus className="w-3 h-3 text-gray-300" /> {item.date || new Date().toLocaleDateString()}</span>
                  <span className="text-[11px] text-green-600 font-bold flex items-center gap-1">{t("Read Article")} <ArrowUpRight className="w-3 h-3" /></span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[1.5rem] p-5 text-center border border-gray-100">
            <Newspaper className="w-7 h-7 text-gray-200 mx-auto mb-3" />
            <p className="text-[15px] font-bold text-gray-800">{t("Powered by Vani AI")}</p>
            <p className="text-[13px] text-gray-500 mt-1 font-medium">{t("AI is analyzing agriculture news")}</p>
          </div>
        )}
      </motion.div>

      {/* ── Reminders (Replaces Recent Appointments) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.11 }}
        className="mb-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-900">{t("Reminders")}</h3>
        </div>

        {reminder ? (
          <Link to="/crops" className="bg-white rounded-[1.5rem] p-4 flex gap-4 items-center shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-md transition-all block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-[4rem] -z-10" />
            
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-green-50 text-green-600 shadow-sm">
              <CalendarPlus className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-[15px]">{reminder.title}</h4>
              <p className="text-[13px] text-green-600 font-bold mt-0.5">{reminder.type}</p>
              <div className="flex items-center gap-1 mt-1.5 opacity-60">
                <CalendarPlus className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[11px] text-gray-500 font-bold">{reminder.date}</span>
              </div>
            </div>
            <div className="shrink-0 text-center z-10">
              <div className="w-10 h-10 bg-[#12121e] rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/crops" className="bg-white rounded-[1.5rem] p-6 border border-dashed border-gray-300 text-center block hover:bg-gray-50 transition-colors">
            <CalendarPlus className="w-8 h-8 text-teal-400 mx-auto mb-3" />
            <p className="text-[15px] font-bold text-gray-900">{t("Add a Task")}</p>
            <p className="text-[12px] text-gray-500 mt-1">{t("Schedule activities for your crops")}</p>
          </Link>
        )}
      </motion.div>

      <DashboardQuickAccessModal type={quickAccessModal} onClose={() => setQuickAccessModal(null)} />
    </>
  );
}
