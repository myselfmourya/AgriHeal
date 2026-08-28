import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

export default function LanguageSettings() {
  const { settings, updateSetting } = useSettings();
  const { i18n } = useTranslation();
  const { language } = settings;

  const handleSelect = (langId) => {
    // Persist to SettingsContext (localStorage)
    updateSetting('language', 'appLanguage', langId);
    
    // Set Google Translate cookie
    const targetLang = langId.split('-')[0]; // 'hi-IN' -> 'hi'
    document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    
    // Also apply to i18next just in case we still use it for something
    i18n.changeLanguage(targetLang);
    
    // Reload to apply Google Translate
    window.location.reload();
  };

  const LANGUAGES = [
    { id: 'en-IN', name: 'English', nativeName: 'English' },
    { id: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
    { id: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
    { id: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
    { id: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { id: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
    { id: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { id: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">App Language</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">
          {LANGUAGES.map((lang) => {
            const isSelected = language.appLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isSelected ? 'bg-gray-200/60' : 'bg-slate-50 hover:bg-gray-100'
                }`}
              >
                <div className="text-left flex flex-col">
                  <span className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {lang.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">{lang.nativeName}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
