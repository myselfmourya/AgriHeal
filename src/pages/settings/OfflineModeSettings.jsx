import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default function OfflineModeSettings() {
  const { settings, updateSetting } = useSettings();
  const { offlineMode } = settings;

  const Toggle = ({ label, checked, onChange, subtitle }) => (
    <div className="flex justify-between items-center py-3">
      <div className="flex flex-col">
        <span className="text-zinc-900  font-bold">{label}</span>
        {subtitle && <span className="text-zinc-500  text-xs">{subtitle}</span>}
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
      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  space-y-2">
        
        <div className="border-b border-gray-100 ">
          <Toggle 
            label="Offline Mode" 
            subtitle="Access essential features without internet"
            checked={offlineMode.enabled} 
            onChange={(val) => updateSetting('offlineMode', 'enabled', val)} 
          />
        </div>

        <div className={`transition-opacity ${offlineMode.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="border-b border-gray-100 ">
            <Toggle 
              label="Download Disease Database" 
              subtitle="Use image analysis offline"
              checked={offlineMode.autoDownloadDatabase} 
              onChange={(val) => updateSetting('offlineMode', 'autoDownloadDatabase', val)} 
            />
          </div>

          <div className="border-b border-gray-100 ">
            <Toggle 
              label="Cache Market Prices" 
              subtitle="View last synced prices offline"
              checked={offlineMode.cacheMarketPrices} 
              onChange={(val) => updateSetting('offlineMode', 'cacheMarketPrices', val)} 
            />
          </div>

          <div>
            <Toggle 
              label="Cache Weather Forecast" 
              subtitle="View 3-day offline forecast"
              checked={offlineMode.cacheWeather} 
              onChange={(val) => updateSetting('offlineMode', 'cacheWeather', val)} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
