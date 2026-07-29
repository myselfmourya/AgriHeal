import React, { useState, useRef } from 'react';
import { 
     Leaf, CloudSun, TrendingUp, Activity, 
    Droplet, Sprout,
     Calendar as 
      Mic, ShoppingBag, MoreHorizontal, Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVani } from '../contexts/VaniContext';
import { useFarmer } from '../contexts/FarmerContext';
import { generateCropDetails } from '../pages/CropManagement';
import CropQuickViewModal from './CropQuickViewModal';
import DashboardQuickAccessModal from './DashboardQuickAccessModal';
import { useTranslation } from 'react-i18next';

export default function FarmerDashboard({ onSpeak }) {
  const { t } = useTranslation();
  const { startWakeWord } = useVani();
  const { notifications, myCrops } = useFarmer();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const displayCrops = myCrops.map(generateCropDetails).slice(0, 3);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quickAccessType, setQuickAccessType] = useState(null);

  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; 
    const startOfWeek = new Date(d.setDate(diff));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startOfWeek);
      nextDate.setDate(startOfWeek.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  const weekDates = getWeekDates(calendarDate);
  const displayedMonth = weekDates[0].toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevWeek = () => {
    setCalendarDate(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
  };
  const handleNextWeek = () => {
    setCalendarDate(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  // Only show reminders for the selected date
  const reminderTasks = notifications.filter(n => {
    if (n.type !== 'Reminder') return false;
    const taskDate = new Date(n.scheduledTime);
    return taskDate.toDateString() === selectedDate.toDateString();
  });
  
  // Pending Tasks count is still based on ALL unread reminders or just today? Let's keep it based on all unread reminders for the stat card.
  const allReminders = notifications.filter(n => n.type === 'Reminder');
  const pendingTasksCount = allReminders.filter(n => n.unread).length;

  return (
    <div className="min-h-full bg-[#f4f7f5] text-slate-800 p-4 md:p-6 lg:p-8 flex flex-col gap-6 w-full">
      
      {/* Hero Banner Section */}
      <div className="relative w-full h-[200px] md:h-[240px] rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-center px-6 md:px-10 z-0">
        {/* Farm Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')" }}
        />
        {/* Soft gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10" />
        
        <div className="relative z-20 max-w-xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {t('dashboard.welcome_back', 'Welcome back, Farmer!')}
          </h1>
          <p className="text-slate-700 mt-2 text-sm md:text-base font-medium">
            {t('dashboard.whats_happening', "Here's what's happening in your farm today.")}
          </p>
          <button 
            onClick={startWakeWord}
            className="mt-6 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-md w-max"
          >
            <Mic className="w-5 h-5" />
            <span>{t('dashboard.talk_to_vani', 'Talk to Vani')}</span>
            <div className="flex gap-0.5 ml-1">
              <span className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></span>
              <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Access Grid - Full Width at Top */}
      <section className="mb-8 lg:mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{t('dashboard.quick_access')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: t('dashboard.qa_crops', 'Crops'), icon: Leaf, color: 'text-green-600', ogLabel: 'Crops' },
            { label: t('dashboard.qa_growth', 'Growth'), icon: Activity, color: 'text-orange-700', ogLabel: 'Growth' },
            { label: t('dashboard.qa_irrigation', 'Irrigation'), icon: Droplet, color: 'text-blue-500', ogLabel: 'Irrigation' },
            { label: t('dashboard.qa_fertilizer', 'Fertilizer'), icon: Leaf, color: 'text-green-500', ogLabel: 'Fertilizer' },
            { label: t('dashboard.qa_pest', 'Pest & Disease'), icon: Bot, color: 'text-red-500', ogLabel: 'Pest & Disease' },
            { label: t('dashboard.qa_market', 'Market Prices'), icon: TrendingUp, color: 'text-orange-500', ogLabel: 'Market Prices' },
            { label: t('dashboard.qa_weather', 'Weather'), icon: CloudSun, color: 'text-blue-400', ogLabel: 'Weather' },
            { label: t('dashboard.qa_more', 'More'), icon: MoreHorizontal, color: 'text-gray-400', ogLabel: 'More' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => {
                if (item.ogLabel === 'More') {
                  navigate('/help');
                } else {
                  setQuickAccessType(item.ogLabel);
                }
              }}
              className="bg-white flex flex-col items-center justify-center py-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <item.icon className={`w-10 h-10 ${item.color} mb-3`} />
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </button>
          ))}
        </div>
      </section>


      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {/* Weather */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <CloudSun className="w-8 h-8 text-orange-400" />
            <div className="text-right">
              <h3 className="text-2xl font-bold text-slate-800">28°C</h3>
              <p className="text-xs text-slate-500 font-medium">{t('dashboard.partly_cloudy', 'Partly Cloudy')}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-600 border-t border-gray-50 pt-3">
            <div className="flex flex-col gap-1"><span className="text-slate-400">{t('dashboard.humidity', 'Humidity')}</span><span className="font-semibold text-slate-800">60%</span></div>
            <div className="flex flex-col gap-1"><span className="text-slate-400">{t('dashboard.wind', 'Wind')}</span><span className="font-semibold text-slate-800">18 km/h</span></div>
            <div className="flex flex-col gap-1"><span className="text-slate-400">{t('dashboard.rain_chance', 'Rain Chance')}</span><span className="font-semibold text-slate-800">20%</span></div>
          </div>
        </div>

        {/* Market Price */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-50 text-green-600 rounded-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-600">{t('dashboard.market_price', 'Market Price')}</h3>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <h2 className="text-3xl font-bold text-slate-800">₹2,350</h2>
            <span className="text-sm font-medium text-slate-500">/Quintal</span>
          </div>
          <p className="text-sm font-bold text-green-500 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            6.8%
          </p>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center justify-center w-full">
            <Droplet className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-sm font-bold text-slate-600 mb-1">{t('dashboard.soil_moisture', 'Soil Moisture')}</span>
            <span className="text-2xl font-black text-slate-800">72%</span>
            <span className="text-xs font-bold text-green-500">Good</span>
            <div className="w-full mt-3">
              <svg viewBox="0 0 200 40" className="w-full h-4 text-green-400 fill-transparent stroke-current stroke-[3]">
                <path d="M0,20 C50,40 150,0 200,20" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">{t('dashboard.ai_recommendations', 'AI Recommendations')}</h2>
          <button onClick={() => navigate('/farm-care')} className="text-sm font-bold text-green-600 hover:text-green-700">{t('dashboard.view_all', 'View all')}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-800">{t('dashboard.apply_urea', 'Apply Urea (46% N)')}</h3>
                <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-[10px] font-bold uppercase tracking-wide">In 2 Days</span>
              </div>
              <p className="text-sm text-slate-600">{t('dashboard.urea_desc', 'Best time to apply fertilizer.')}</p>
            </div>
            <button 
              onClick={() => navigate('/fertilisers')}
              className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
            >
              {t('dashboard.view_details', 'View Details')}
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-800">{t('dashboard.bph_risk', 'Brown Plant Hopper Risk')}</h3>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase tracking-wide">High Risk</span>
              </div>
              <p className="text-sm text-slate-600">{t('dashboard.bph_desc', 'High risk detected in your area.')}</p>
            </div>
            <button 
              onClick={() => navigate('/farm-care/pest-disease')}
              className="w-full md:w-auto px-4 py-2 bg-white text-orange-700 border border-orange-200 rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors shadow-sm whitespace-nowrap"
            >
              {t('dashboard.view_details', 'View Details')}
            </button>
          </div>
        </div>
      </section>

      {/* Daily Expert Tip (Full Width Bottom) */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-[24px] p-6 lg:p-8 border border-green-500/20 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
            <Leaf className="w-48 h-48 text-green-900" />
          </div>
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-green-100 text-green-600">
            <Sprout className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t('dashboard.tip_title', 'Daily Expert Tip: Enhance Soil Nutrient Retention')}</h2>
            <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto md:mx-0">
              {t('dashboard.tip_desc', 'Applying organic mulch before the rainy season helps retain soil moisture and slowly releases nutrients, reducing the need for synthetic fertilizers by up to 20%.')}
            </p>
          </div>
          <button 
            onClick={() => navigate('/ai-learning')} 
            className="shrink-0 px-6 py-3 bg-white text-green-700 font-bold rounded-xl border border-green-200 hover:bg-green-50 transition-colors shadow-sm whitespace-nowrap"
          >
            {t('dashboard.read_more_tips', 'Read More Tips')}
          </button>
        </div>
      </section>

      
      {/* Modals & Audio */}
      <CropQuickViewModal 
        isOpen={!!selectedCrop} 
        onClose={() => setSelectedCrop(null)} 
        crop={selectedCrop} 
      />
      <DashboardQuickAccessModal
        type={quickAccessType}
        onClose={() => setQuickAccessType(null)}
      />
      <audio ref={audioRef} />

    </div>
  );
}
