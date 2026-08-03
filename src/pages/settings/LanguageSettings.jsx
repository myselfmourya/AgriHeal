import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function LanguageSettings() {
  const { settings, updateSetting } = useSettings();
  const { i18n } = useTranslation();
  const { language } = settings;

  const handleSelect = (langId) => {
    // Persist to SettingsContext (localStorage)
    updateSetting('language', 'appLanguage', langId);
    // Apply immediately to i18next (strips -IN suffix: 'hi-IN' → 'hi')
    i18n.changeLanguage(langId.split('-')[0]);
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
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full">
      <div className="bg-white  rounded-2xl p-2 shadow-sm border border-gray-100 ">
        <div className="p-4 border-b border-gray-100 ">
          <h3 className="font-bold text-gray-900  mb-1">Choose App Language</h3>
          <p className="text-sm text-gray-500">App will restart to apply changes</p>
        </div>

        <div className="p-2">
          {LANGUAGES.map((lang) => (
            <label key={lang.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100  rounded-full flex items-center justify-center text-lg">
                  {lang.nativeName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 ">{lang.name}</h3>
                  <p className="text-xs text-gray-500">{lang.nativeName}</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${language.appLanguage === lang.id ? 'border-green-600 bg-green-600' : 'border-gray-300 '}`}>
                {language.appLanguage === lang.id && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
              </div>
              <input 
                type="radio" 
                name="appLanguage" 
                value={lang.id} 
                checked={language.appLanguage === lang.id}
                onChange={() => handleSelect(lang.id)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
