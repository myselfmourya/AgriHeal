import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight } from 'lucide-react';

export default function VoiceAssistantSettings() {
  const { settings, updateSetting } = useSettings();
  const { voiceAssistant } = settings;

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
        
        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Voice Settings</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {voiceAssistant.voiceGender} Voice <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-3 border-b border-gray-100 ">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-900 ">Speech Speed</span>
            <span className="text-xs font-bold text-gray-500">{voiceAssistant.voiceSpeed === 1.0 ? 'Normal' : `${voiceAssistant.voiceSpeed}x`}</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={voiceAssistant.voiceSpeed} 
            onChange={(e) => updateSetting('voiceAssistant', 'voiceSpeed', parseFloat(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Voice Response Style</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {voiceAssistant.voiceResponseStyle} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 ">Wake Word</span>
            <span className="text-xs text-gray-500">Use "Hey Vani" to activate</span>
          </div>
          <div className="flex items-center text-sm font-bold text-gray-500">
            Hey Vani <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-3 border-b border-gray-100 ">
          <Toggle 
            label="Auto Listen" 
            subtitle="Continuously listen for wake word"
            checked={voiceAssistant.autoListen} 
            onChange={(val) => updateSetting('voiceAssistant', 'autoListen', val)} 
          />
        </div>

        <div className="p-3 border-b border-gray-100 ">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-900 ">Assistant Volume</span>
            <span className="text-xs font-bold text-gray-500">{voiceAssistant.voiceVolume}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5" 
            value={voiceAssistant.voiceVolume} 
            onChange={(e) => updateSetting('voiceAssistant', 'voiceVolume', parseInt(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Voice Feedback</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            Short Beep <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

      </div>
    </div>
  );
}
