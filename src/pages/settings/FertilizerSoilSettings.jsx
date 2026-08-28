import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight } from 'lucide-react';

export default function FertilizerSoilSettings() {
  const { settings, updateSetting } = useSettings();
  const { fertilizerSoil } = settings;

  const Toggle = ({ label, checked, onChange, subtitle }) => (
    <div className="flex justify-between items-center py-3">
      <div className="flex flex-col">
        <span className="text-gray-900  font-bold">{label}</span>
        {subtitle && <span className="text-gray-400  text-xs">{subtitle}</span>}
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
            label="Fertilizer Reminders" 
            checked={fertilizerSoil.fertilizerReminders} 
            onChange={(val) => updateSetting('fertilizerSoil', 'fertilizerReminders', val)} 
          />
        </div>
        <div className="border-b border-gray-100  flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Soil Test Reports</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            View <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Recommend Fertilizer</span>
          <ChevronRight className="w-4 h-4 ml-1 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
