import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight } from 'lucide-react';

export default function WeatherAlertsSettings() {
  const { settings, updateSetting } = useSettings();
  const { weatherAlerts } = settings;

  const Toggle = ({ label, checked, onChange, subtitle, icon }) => (
    <div className="flex justify-between items-center py-3">
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <div className="flex flex-col">
          <span className="text-zinc-900  font-bold">{label}</span>
          {subtitle && <span className="text-zinc-500  text-xs">{subtitle}</span>}
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-green-700' : 'bg-gray-300 '}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      
      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  mb-6">
        <Toggle 
          label="Weather Alerts" 
          checked={weatherAlerts.weatherAlertsEnabled} 
          onChange={(val) => updateSetting('weatherAlerts', 'weatherAlertsEnabled', val)} 
        />
      </div>

      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  space-y-2 mb-6">
        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Alert Types</h3>
        
        <div className="border-b border-gray-100 ">
          <Toggle 
            icon="🌧️"
            label="Rain Alert" 
            checked={weatherAlerts.alertTypes.rain} 
            onChange={(val) => updateSetting('weatherAlerts', 'alertTypes', { ...weatherAlerts.alertTypes, rain: val })} 
          />
        </div>
        <div className="border-b border-gray-100 ">
          <Toggle 
            icon="☀️"
            label="Heat Wave" 
            checked={weatherAlerts.alertTypes.heatWave} 
            onChange={(val) => updateSetting('weatherAlerts', 'alertTypes', { ...weatherAlerts.alertTypes, heatWave: val })} 
          />
        </div>
        <div className="border-b border-gray-100 ">
          <Toggle 
            icon="❄️"
            label="Cold Wave" 
            checked={weatherAlerts.alertTypes.coldWave} 
            onChange={(val) => updateSetting('weatherAlerts', 'alertTypes', { ...weatherAlerts.alertTypes, coldWave: val })} 
          />
        </div>
        <div className="border-b border-gray-100 ">
          <Toggle 
            icon="💨"
            label="Strong Wind" 
            checked={weatherAlerts.alertTypes.strongWind} 
            onChange={(val) => updateSetting('weatherAlerts', 'alertTypes', { ...weatherAlerts.alertTypes, strongWind: val })} 
          />
        </div>
        <div>
          <Toggle 
            icon="🥶"
            label="Frost Alert" 
            checked={weatherAlerts.alertTypes.frost} 
            onChange={(val) => updateSetting('weatherAlerts', 'alertTypes', { ...weatherAlerts.alertTypes, frost: val })} 
          />
        </div>
      </div>

      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  space-y-2">
        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Alert Timing</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {weatherAlerts.alertTiming} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-3 border-b border-gray-100 ">
          <Toggle 
            label="Daily Weather Summary" 
            checked={weatherAlerts.dailyWeatherSummary} 
            onChange={(val) => updateSetting('weatherAlerts', 'dailyWeatherSummary', val)} 
          />
        </div>

        <div className="p-3">
          <Toggle 
            label="Severe Weather Push" 
            checked={weatherAlerts.severeWeatherPush} 
            onChange={(val) => updateSetting('weatherAlerts', 'severeWeatherPush', val)} 
          />
        </div>
      </div>

    </div>
  );
}
