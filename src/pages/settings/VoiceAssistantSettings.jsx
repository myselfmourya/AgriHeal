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
        <span className="text-zinc-900 font-bold">{label}</span>
        {subtitle && <span className="text-zinc-500 text-xs">{subtitle}</span>}
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

          {/* Voice Speed */}
          <div className="border-b border-gray-100 py-3">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-zinc-900">Speech Speed</span>
              <span className="text-zinc-500 text-sm font-bold">
                {voiceAssistant.voiceSpeed === 1.0 ? 'Normal' : `${voiceAssistant.voiceSpeed}x`}
              </span>
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
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.5× Slow</span>
              <span>2× Fast</span>
            </div>
          </div>

          {/* Volume */}
          <div className="border-b border-gray-100 py-3">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-zinc-900">Assistant Volume</span>
              <span className="text-zinc-500 text-sm font-bold">{voiceAssistant.voiceVolume}%</span>
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

          {/* Test Voice — uses real speak() so speed/volume are live */}
          <button
            onClick={handleTestVoice}
            disabled={isTestingVoice}
            className="w-full mt-3 py-3 bg-green-700 text-white font-bold rounded-xl
                       hover:bg-green-800 active:scale-95 disabled:opacity-60 transition-all
                       flex items-center justify-center gap-2"
          >
            <Mic className={`w-4 h-4 ${isTestingVoice ? 'animate-pulse' : ''}`} />
            {isTestingVoice ? 'Speaking...' : '🔊 Test Vani Voice'}
          </button>

        </div>
      </div>
    </div>
  );
}
