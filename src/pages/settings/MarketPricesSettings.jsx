import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight } from 'lucide-react';

export default function MarketPricesSettings() {
  const { settings, updateSetting } = useSettings();
  const { marketPrices } = settings;

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
            label="Market Price Alerts" 
            checked={marketPrices.marketPriceAlerts} 
            onChange={(val) => updateSetting('marketPrices', 'marketPriceAlerts', val)} 
          />
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Select Crops</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {marketPrices.selectedCrops.length} Crops Selected <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Market Location</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {marketPrices.marketLocation} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-3 border-b border-gray-100 ">
          <div className="flex flex-col mb-2">
            <span className="font-bold text-gray-900 ">Price Change Alert</span>
            <span className="text-xs text-gray-500">When price changes by</span>
          </div>
          <select 
            value={marketPrices.priceChangeAlertPercent}
            onChange={(e) => updateSetting('marketPrices', 'priceChangeAlertPercent', parseInt(e.target.value))}
            className="w-full mt-2 p-2 border border-gray-200  rounded-lg bg-gray-50 "
          >
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
          </select>
        </div>

        <div className="border-b border-gray-100 ">
          <Toggle 
            label="Daily Price Summary" 
            checked={marketPrices.dailyPriceSummary} 
            onChange={(val) => updateSetting('marketPrices', 'dailyPriceSummary', val)} 
          />
        </div>

        <div>
          <Toggle 
            label="Weekly Price Report" 
            checked={marketPrices.weeklyPriceReport} 
            onChange={(val) => updateSetting('marketPrices', 'weeklyPriceReport', val)} 
          />
        </div>

      </div>
    </div>
  );
}
