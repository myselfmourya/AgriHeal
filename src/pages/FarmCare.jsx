import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Sun, Wind, Droplets, 
  MapPin, Activity, Beaker, ShieldAlert,
  Droplet, Calendar, Zap, Clock, Wheat,
  Bug, Flame, Snowflake, ActivitySquare, CheckCircle,
     Sunrise, Sunset, Gauge, Calendar as CalendarIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../contexts/FarmerContext';

export default function FarmCare() {
  const navigate = useNavigate();
  const { notifications } = useFarmer();
  const reminderTasks = notifications.filter(n => n.type === 'Reminder');
  const [locationName, setLocationName] = useState('Fetching location...');
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
            const data = await res.json();
            const city = data.address.state_district || data.address.city || data.address.town || 'Your Farm';
            const state = data.address.state || '';
            setLocationName(`${city}${state ? `, ${state}` : ''} • Active Monitoring`);
          } catch (error) {
            setLocationName('Field 1 (Paddy) • Active Monitoring');
          }
        },
        () => setLocationName('Field 1 (Paddy) • Active Monitoring')
      );
    } else {
      setLocationName('Field 1 (Paddy) • Active Monitoring');
    }
  }, []);

  
  // Simulated Data (Realistic for Demo)
  const weather = {
    temp: 28, humidity: 65, rainProb: 70, wind: 18, uv: 6, pressure: 1012,
    sunrise: '05:45 AM', sunset: '06:30 PM',
    condition: 'Partly Cloudy',
    aiSummary: "Rainfall is highly probable later today. High humidity might increase pest risks. Advise holding off on any chemical spraying."
  };

  const forecast = [
    { day: 'Today', icon: CloudRain, high: 28, low: 22, rain: '70%' },
    { day: 'Thu', icon: CloudRain, high: 27, low: 21, rain: '80%' },
    { day: 'Fri', icon: Sun, high: 32, low: 23, rain: '10%' },
    { day: 'Sat', icon: Sun, high: 33, low: 24, rain: '5%' },
    { day: 'Sun', icon: CloudRain, high: 29, low: 22, rain: '40%' },
    { day: 'Mon', icon: CloudRain, high: 28, low: 22, rain: '50%' },
    { day: 'Tue', icon: Sun, high: 31, low: 23, rain: '20%' },
  ];

  const soil = {
    score: 85,
    ph: { value: 6.8, status: 'Optimal', msg: 'Slightly Acidic - Perfect for most crops.' },
    moisture: { value: '42%', status: 'Low', msg: 'Approaching wilting point. Irrigation recommended soon.' },
    organicCarbon: { value: '0.75%', status: 'Medium', msg: 'Adequate, but adding compost post-harvest is advised.' },
    nitrogen: { value: '290 kg/ha', status: 'Adequate', msg: 'Sufficient for current vegetative stage.' },
    phosphorus: { value: '22 kg/ha', status: 'Adequate', msg: 'Good root development support.' },
    potassium: { value: '180 kg/ha', status: 'Low', msg: 'Apply Potash to improve disease resistance.' },
    ec: { value: '1.2 dS/m', status: 'Optimal', msg: 'Salinity levels are safe.' },
    temp: { value: '24°C', status: 'Optimal', msg: 'Good for nutrient uptake.' }
  };

  const water = {
    soilMoisture: 42,
    status: 'Irrigation Needed',
    nextSchedule: 'Today, Evening',
    method: 'Drip Irrigation',
    source: 'Borewell',
    usageWeek: '12,450 L',
    aiReasoning: "Soil moisture has dropped below optimal levels. Since rain is expected later, a light supplementary drip irrigation is recommended this evening rather than a full flooding."
  };

  const impact = [
    { risk: 'Disease Risk', level: 'High', icon: Bug, color: 'text-red-500', bg: 'bg-red-50', msg: 'High humidity favors fungal growth like Leaf Blast.' },
    { risk: 'Pest Activity', level: 'Medium', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50', msg: 'Stem borers observed in neighboring regions.' },
    { risk: 'Heat Stress', level: 'Low', icon: Flame, color: 'text-green-600', bg: 'bg-green-50', msg: 'Temperatures are well within safe limits.' },
    { risk: 'Frost Damage', level: 'Low', icon: Snowflake, color: 'text-green-600', bg: 'bg-green-50', msg: 'No frost risk detected.' },
  ];

  const recommendations = [
    { title: 'Irrigation', action: 'Light Drip Irrigation', time: 'Today 5:00 PM', reason: 'Maintain baseline moisture before expected night rains.' },
    { title: 'Fertilizer', action: 'Delay Application', time: 'Postpone 48h', reason: 'Upcoming rain will wash away applied fertilizers. Wait until soil dries.' },
    { title: 'Pesticide', action: 'Do Not Spray', time: 'Hold', reason: 'High wind speed (18km/h) will cause spray drift, and rain will wash it off.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Farm Care Center</h1>
          <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-green-600" /> {locationName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weather Intelligence */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <CloudRain className="w-48 h-48" />
            </div>
            
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-500" /> Weather Intelligence
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <CloudRain className="w-16 h-16 text-blue-500" />
                <div>
                  <h3 className="text-5xl font-black text-slate-800">{weather.temp}°<span className="text-2xl text-slate-400">C</span></h3>
                  <p className="text-sm font-bold text-slate-500">{weather.condition}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><Droplets className="w-3 h-3 text-blue-500 shrink-0"/> Humidity</p>
                  <p className="text-2xl font-black text-slate-800">{weather.humidity}%</p>
                </div>
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1 whitespace-nowrap"><CloudRain className="w-3 h-3 text-blue-500 shrink-0"/> Rain Prob</p>
                  <p className="text-2xl font-black text-slate-800">{weather.rainProb}%</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><Wind className="w-3 h-3 text-slate-400 shrink-0"/> Wind</p>
                  <p className="text-2xl font-black text-slate-800">{weather.wind} <span className="text-[10px] font-bold text-slate-400">km/h</span></p>
                </div>
                <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1 whitespace-nowrap"><Sun className="w-3 h-3 text-orange-500 shrink-0"/> UV Index</p>
                  <p className="text-2xl font-black text-slate-800">{weather.uv}</p>
                </div>
              </div>
            </div>

            {/* Extra atmospheric stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-gray-100">
              <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><Sunrise className="w-3 h-3 text-orange-400 shrink-0"/> Sunrise</p>
                <p className="text-sm font-black text-slate-800">{weather.sunrise}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><Sunset className="w-3 h-3 text-indigo-400 shrink-0"/> Sunset</p>
                <p className="text-sm font-black text-slate-800">{weather.sunset}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><Gauge className="w-3 h-3 text-blue-400 shrink-0"/> Pressure</p>
                <p className="text-sm font-black text-slate-800">{weather.pressure} <span className="text-[10px] text-slate-400">hPa</span></p>
              </div>
            </div>

            {/* Vani Weather Summary */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-start gap-3 relative z-10">
              <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                <img src="/icons/vani-avatar.png" alt="Vani" className="w-6 h-6 object-cover rounded-full" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-800 mb-1">Vani's Weather Impact Analysis:</p>
                <p className="text-sm font-medium text-green-900 leading-relaxed">{weather.aiSummary}</p>
              </div>
            </div>
            
            {/* 7-Day Forecast Row */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">7-Day Outlook</h3>
              <div className="flex overflow-x-auto pb-2 gap-2 snap-x scrollbar-hide">
                {forecast.map((day, idx) => (
                  <div key={idx} className="shrink-0 w-[4.5rem] flex flex-col items-center bg-gray-50 rounded-xl p-3 border border-gray-100 snap-center">
                    <p className="text-[11px] font-bold text-slate-600 mb-2">{day.day}</p>
                    <day.icon className={`w-6 h-6 mb-2 ${day.icon === Sun ? 'text-orange-500' : 'text-blue-500'}`} />
                    <p className="text-sm font-black text-slate-800">{day.high}°</p>
                    <p className="text-[10px] font-bold text-slate-400">{day.low}°</p>
                    <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                      <Droplets className="w-2.5 h-2.5" /> {day.rain}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Crop Impact Analysis */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <ActivitySquare className="w-5 h-5 text-purple-600" /> AI Crop Impact Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {impact.map((item, idx) => (
                <div key={idx} className={`rounded-2xl p-4 border ${item.bg.replace('bg-', 'border-').replace('50', '200')} ${item.bg}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <p className="text-sm font-bold text-slate-800">{item.risk}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full bg-white shadow-sm ${item.color}`}>
                      {item.level} RISK
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed mt-2">{item.msg}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Smart Water Management */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" /> Smart Water Management
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Soil Moisture</p>
                    <p className="text-2xl font-black text-blue-600">{water.soilMoisture}%</p>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-orange-400" style={{width: '30%'}}></div>
                    <div className="h-full bg-green-500" style={{width: '50%'}}></div>
                    <div className="h-full bg-blue-500" style={{width: '20%'}}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-400 uppercase">
                    <span>Dry</span>
                    <span>Optimal</span>
                    <span>Saturated</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 mb-1">Vani's Irrigation Advice:</p>
                  <p className="text-sm font-medium text-blue-900 leading-relaxed">{water.aiReasoning}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Next Schedule</p>
                  <p className="text-sm font-black text-slate-800 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500"/> {water.nextSchedule}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Method</p>
                  <p className="text-sm font-black text-slate-800 flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-blue-500"/> {water.method}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Water Source</p>
                  <p className="text-sm font-black text-slate-800 flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-blue-500"/> {water.source}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Usage (7 Days)</p>
                  <p className="text-sm font-black text-slate-800 flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-blue-500"/> {water.usageWeek}</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Removed User Scheduled Tasks as requested */}

          {/* Daily Farming Recommendations */}
          <section className="bg-green-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <CheckCircle className="w-32 h-32" />
            </div>
            <h2 className="text-lg font-black mb-6 relative z-10 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Today's Action Plan
            </h2>
            <div className="space-y-4 relative z-10">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                  <div className="flex flex-col items-start mb-3 gap-2">
                    <p className="text-xs font-bold text-green-100 uppercase">{rec.title}</p>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-white/20 whitespace-nowrap">
                      {rec.time}
                    </span>
                  </div>
                  <p className="text-base font-black mb-1">{rec.action}</p>
                  <p className="text-xs font-medium text-green-50 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Soil Health Monitor */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-amber-600" /> Soil Health
              </h2>
              <div className="text-right">
                <p className="text-2xl font-black text-green-600">{soil.score}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Health Score</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'pH Level', data: soil.ph },
                { label: 'Organic Carbon', data: soil.organicCarbon },
                { label: 'Nitrogen (N)', data: soil.nitrogen },
                { label: 'Phosphorus (P)', data: soil.phosphorus },
                { label: 'Potassium (K)', data: soil.potassium },
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.data.status === 'Optimal' || item.data.status === 'Adequate' ? 'bg-green-100 text-green-700' :
                      item.data.status === 'Low' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.data.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-sm font-black text-slate-800">{item.data.value}</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 mt-1.5 leading-snug">{item.data.msg}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Crop Lifecycle Tracker */}
          <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-sm border border-amber-100">
            <h2 className="text-xs font-black text-amber-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Wheat className="w-4 h-4 text-amber-600" /> Crop Lifecycle
            </h2>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-2xl font-black text-amber-950">Day 42</p>
                <p className="text-xs font-bold text-amber-700">Vegetative Stage</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-amber-900">~45 Days</p>
                <p className="text-[10px] font-bold text-amber-700 uppercase">To Harvest</p>
              </div>
            </div>
            <div className="h-2 w-full bg-amber-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{width: '48%'}}></div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
