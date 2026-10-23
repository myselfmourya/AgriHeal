import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useVani } from '../../contexts/VaniContext';
import { Mic, ChevronRight, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const languages = [
  { id: 'auto', name: 'Auto (Match App)', nativeName: 'Auto', flag: '🌐' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];

export default function VoiceAssistantSettings() {
  const { settings, updateSetting } = useSettings();
  const { isVoiceModeEnabled, toggleVoiceMode, speak } = useVani();
  const { voiceAssistant } = settings;
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

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

          {/* Vani Language Selector */}
          <div className="border-b border-gray-100 py-3">
            <div className="flex flex-col mb-2">
              <span className="font-bold text-gray-900">Vani Language</span>
              <span className="text-gray-400 text-xs">Choose the language Vani speaks and understands</span>
            </div>
            
            <div 
              onClick={() => setShowLangModal(true)}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{languages.find(l => l.id === (voiceAssistant.vaniLanguage || 'auto'))?.flag || '🌐'}</span>
                <span className="font-bold text-gray-800">
                  {languages.find(l => l.id === (voiceAssistant.vaniLanguage || 'auto'))?.nativeName || 'Auto (Match App Language)'}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
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

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLangModal && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLangModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
              
              <div className="flex justify-between items-center px-6 py-2">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Vani Language</h3>
                  <p className="text-sm text-gray-500 font-medium">Select voice assistant language</p>
                </div>
                <button 
                  onClick={() => setShowLangModal(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-3 pb-safe">
                {languages.map((lang) => {
                  const isSelected = (voiceAssistant.vaniLanguage || 'auto') === lang.id;
                  return (
                    <div 
                      key={lang.id}
                      onClick={() => {
                        updateSetting('voiceAssistant', 'vaniLanguage', lang.id);
                        setTimeout(() => setShowLangModal(false), 200);
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-green-600 bg-green-50/50 shadow-sm' 
                          : 'border-gray-100 bg-white hover:border-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <h3 className="font-bold text-slate-800">{lang.nativeName}</h3>
                          <p className="text-sm font-medium text-slate-500">{lang.name}</p>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isSelected 
                          ? 'border-green-600 bg-green-600 text-white' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
