import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight, Droplets, TrendingUp, Bug, Sprout, CloudRain, Settings as SettingsIcon, Mic, User, Ruler, RefreshCw } from 'lucide-react';

export default function GeneralSettings() {
  const { settings, updateSetting, updateSection } = useSettings();
  const { general, language, voiceAssistant, displayTheme, weatherAlerts } = settings;

  const quickSettings = [
    { id: 'irrigation', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 ', label: 'Irrigation Reminders', desc: 'Get reminders for irrigation', checked: settings.irrigationWater.irrigationReminders, toggle: () => updateSetting('irrigationWater', 'irrigationReminders', !settings.irrigationWater.irrigationReminders) },
    { id: 'market', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50 ', label: 'Market Price Alerts', desc: 'Get alerts on price changes', checked: settings.marketPrices.marketPriceAlerts, toggle: () => updateSetting('marketPrices', 'marketPriceAlerts', !settings.marketPrices.marketPriceAlerts) },
    { id: 'pest', icon: Bug, color: 'text-red-500', bg: 'bg-red-50 ', label: 'Pest & Disease Alerts', desc: 'Instant pest & disease alerts', checked: settings.pestDisease.pestAlerts, toggle: () => updateSetting('pestDisease', 'pestAlerts', !settings.pestDisease.pestAlerts) },
    { id: 'fertilizer', icon: Sprout, color: 'text-green-500', bg: 'bg-green-50 ', label: 'Fertilizer Reminders', desc: 'Timely fertilizer reminders', checked: true, toggle: () => {} }, // Mock
    { id: 'rain', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50 ', label: 'Rain Alerts', desc: 'Alerts before heavy rain', checked: settings.weatherAlerts.alertTypes.rain, toggle: () => updateSetting('weatherAlerts', 'alertTypes', {...settings.weatherAlerts.alertTypes, rain: !settings.weatherAlerts.alertTypes.rain}) },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      
      {/* Profile & Farm Row */}
      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  mb-4 cursor-pointer hover:shadow-md transition-all flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50  rounded-full flex items-center justify-center text-green-700"><User className="w-6 h-6"/></div>
          <div>
            <h3 className="font-bold text-gray-900 ">Profile & Farm</h3>
            <p className="text-sm text-gray-500 ">Manage your profile and farm details</p>
          </div>
        </div>
        <div className="flex items-center text-sm font-bold text-gray-500">
          View Profile <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Units & Measurements */}
        <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  flex items-center justify-between cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50  rounded-full flex items-center justify-center text-green-700"><Ruler className="w-5 h-5"/></div>
            <div>
              <h3 className="font-bold text-gray-900 ">Units & Measurements</h3>
              <p className="text-xs text-gray-500">Set your preferred units</p>
            </div>
          </div>
          <div className="flex items-center text-sm font-bold text-gray-500">
            Metric (°C, km) <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Data Sync & Backup */}
        <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  flex items-center justify-between cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50  rounded-full flex items-center justify-center text-green-700"><RefreshCw className="w-5 h-5"/></div>
            <div>
              <h3 className="font-bold text-gray-900 ">Data Sync & Backup</h3>
              <p className="text-xs text-gray-500">Backup and sync your data</p>
            </div>
          </div>
          <div className="flex items-center text-sm font-bold text-gray-500">
            Last backup: Today <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Quick Settings */}
        <div className="mt-8">
          <h2 className="text-sm font-bold text-green-700 mb-4 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" /> Quick Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickSettings.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900  text-sm">{item.label}</h3>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={item.toggle}
                    className={`w-10 h-5 rounded-full relative transition-colors ${item.checked ? 'bg-green-600' : 'bg-gray-200 '}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${item.checked ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Need Help? */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50   rounded-2xl p-4 border border-green-100  flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-4">
            <img src="/avatars/vani.png" alt="Vani" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover bg-green-100" />
            <div>
              <h3 className="font-bold text-green-900 ">Need help?</h3>
              <p className="text-xs text-green-700 ">Ask Vani if you need help with any setting.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-6 py-2.5 bg-green-700 text-white rounded-full font-bold text-sm shadow-sm hover:bg-green-800 transition-colors flex items-center justify-center gap-2">
            <Mic className="w-4 h-4" /> Talk to Vani
          </button>
        </div>

      </div>
    </div>
  );
}
