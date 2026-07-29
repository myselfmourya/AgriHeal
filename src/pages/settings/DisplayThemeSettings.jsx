import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronRight, Sun, Moon, Monitor } from 'lucide-react';

export default function DisplayThemeSettings() {
  const { settings, updateSetting } = useSettings();
  const { theme: appTheme, toggle: toggleTheme } = useTheme();
  const { displayTheme } = settings;

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
      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  space-y-4">
        
        {/* Theme */}
        <div className="border-b border-gray-100  pb-4">
          <h3 className="font-bold text-gray-900  mb-4">Theme</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => { updateSetting('displayTheme', 'theme', 'light'); if (appTheme !== 'light') toggleTheme(); }}
              className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${displayTheme.theme === 'light' ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>
            <button 
              onClick={() => { updateSetting('displayTheme', 'theme', 'dark'); if (appTheme !== 'dark') toggleTheme(); }}
              className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${displayTheme.theme === 'dark' ? 'border-green-600 text-green-700 bg-green-50 ' : 'border-gray-200 text-gray-600 hover:bg-gray-50  '}`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
            <button 
              onClick={() => updateSetting('displayTheme', 'theme', 'system')}
              className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${displayTheme.theme === 'system' ? 'border-green-600 text-green-700 bg-green-50 ' : 'border-gray-200 text-gray-600 hover:bg-gray-50  '}`}
            >
              <Monitor className="w-4 h-4" /> System
            </button>
          </div>
        </div>

        {/* Primary Color */}
        <div className="border-b border-gray-100  pb-4">
          <h3 className="font-bold text-gray-900  mb-4">Primary Color</h3>
          <div className="flex gap-4">
            {['Green', 'LightGreen', 'YellowGreen', 'DarkGreen', 'Olive'].map((color, idx) => {
              const bgColors = ['bg-green-600', 'bg-green-400', 'bg-lime-500', 'bg-green-800', 'bg-emerald-600'];
              return (
                <button
                  key={color}
                  onClick={() => updateSetting('displayTheme', 'primaryColor', color)}
                  className={`w-10 h-10 rounded-full ${bgColors[idx]} flex items-center justify-center transition-transform ${displayTheme.primaryColor === color ? 'ring-4 ring-green-100  scale-110' : 'hover:scale-105'}`}
                >
                  {displayTheme.primaryColor === color && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Text Size */}
        <div className="border-b border-gray-100  pb-4">
          <h3 className="font-bold text-gray-900  mb-4">Text Size</h3>
          <div className="flex gap-2">
            {['Small', 'Medium', 'Large'].map((size) => (
              <button 
                key={size}
                onClick={() => updateSetting('displayTheme', 'textSize', size)}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center font-bold border transition-colors ${
                  displayTheme.textSize === size 
                    ? 'border-green-600 text-green-700 bg-green-50 ' 
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50  '
                } ${size === 'Small' ? 'text-sm' : size === 'Medium' ? 'text-base' : 'text-xl'}`}
              >
                A
              </button>
            ))}
          </div>
        </div>

        {/* Corner Style */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Corner Style</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {displayTheme.cornerStyle} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-3 border-b border-gray-100 ">
          <Toggle 
            label="Animations" 
            checked={displayTheme.animations} 
            onChange={(val) => updateSetting('displayTheme', 'animations', val)} 
          />
        </div>

        <div className="p-3">
          <Toggle 
            label="Reduce Motion" 
            checked={displayTheme.reduceMotion} 
            onChange={(val) => updateSetting('displayTheme', 'reduceMotion', val)} 
          />
        </div>

      </div>
    </div>
  );
}
