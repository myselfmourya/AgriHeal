import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useVani } from '../../contexts/VaniContext';
import { Mic } from 'lucide-react';

export default function VoiceAssistantSettings() {
  const { settings, updateSetting } = useSettings();
  const { isVoiceModeEnabled, toggleVoiceMode, speak } = useVani();
  const { voiceAssistant } = settings;
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const Toggle = ({ label, checked, onChange, subtitle, disabled = false }) => (
    <div className={`flex justify-between items-center py-3 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex flex-col">
        <span className="text-gray-900 font-bold">{label}</span>
        {subtitle && <span className="text-gray-400 text-xs">{subtitle}</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-green-700' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );

  const handleTestVoice = () => {
    if (!isVoiceModeEnabled) return;
    setIsTestingVoice(true);
    // Use VaniContext.speak() so test respects current speed & volume settings
    speak("Namaste! I am Vani, your AgriHeal assistant. How can I help your farm today?");
    // Reset button after estimated duration
    setTimeout(() => setIsTestingVoice(false), 4000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">

        {/* Master enable toggle — reads real state from VaniContext */}
        <div className="border-b border-gray-100">
          <Toggle
            label="Enable Vani Voice Assistant"
            subtitle="Allow Vani to speak and listen"
            checked={isVoiceModeEnabled}
            onChange={toggleVoiceMode}
          />
        </div>

        {/* All child controls dim when voice is off */}
        <div className={`transition-opacity ${isVoiceModeEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

          {/* Auto-Listen */}
          <div className="border-b border-gray-100">
            <Toggle
              label="Auto-Listen"
              subtitle="Vani listens when you open the dashboard"
              checked={voiceAssistant.autoListen}
              onChange={(val) => updateSetting('voiceAssistant', 'autoListen', val)}
            />
          </div>

          {/* Wake Word */}
          <div className="border-b border-gray-100">
            <Toggle
              label="Wake Word"
              subtitle={`Say "Hey Vani" to activate`}
              checked={voiceAssistant.wakeWord}
              onChange={(val) => updateSetting('voiceAssistant', 'wakeWord', val)}
            />
          </div>

          {/* Vani Language */}
          <div className="border-b border-gray-100 py-3">
            <div className="flex flex-col mb-2">
              <span className="font-bold text-gray-900">Vani Language</span>
              <span className="text-gray-400 text-xs">Choose the language Vani speaks and understands</span>
            </div>
            <select
              value={voiceAssistant.vaniLanguage || 'auto'}
              onChange={(e) => updateSetting('voiceAssistant', 'vaniLanguage', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 font-medium"
            >
              <option value="auto">Auto (Match App Language)</option>
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="ta">Tamil (தமிழ்)</option>
            </select>
          </div>

          {/* Volume */}
          <div className="border-b border-gray-100 py-3">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-900">Assistant Volume</span>
              <span className="text-gray-400 text-sm font-bold">{voiceAssistant.voiceVolume}%</span>
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

          {/* Voice Feedback */}
          <div className="border-b border-gray-100">
            <Toggle
              label="Voice Feedback"
              subtitle="Play a short chime before Vani speaks"
              checked={voiceAssistant.voiceFeedback}
              onChange={(val) => updateSetting('voiceAssistant', 'voiceFeedback', val)}
            />
          </div>



        </div>
      </div>
    </div>
  );
}
