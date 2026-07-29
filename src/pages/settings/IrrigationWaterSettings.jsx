import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight } from 'lucide-react';

export default function IrrigationWaterSettings() {
  const { settings, updateSetting } = useSettings();
  const { irrigationWater } = settings;

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
            label="Irrigation Reminders" 
            checked={irrigationWater.irrigationReminders} 
            onChange={(val) => updateSetting('irrigationWater', 'irrigationReminders', val)} 
          />
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Irrigation Method</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {irrigationWater.irrigationMethod} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Water Source</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {irrigationWater.waterSource} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Watering Interval</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {irrigationWater.wateringInterval} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Best Time to Irrigate</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {irrigationWater.bestTimeToIrrigate} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Water Usage History</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            View Records <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div>
          <Toggle 
            label="Water Saving Tips" 
            checked={irrigationWater.waterSavingTips} 
            onChange={(val) => updateSetting('irrigationWater', 'waterSavingTips', val)} 
          />
        </div>

      </div>
    </div>
  );
}
