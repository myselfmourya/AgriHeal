import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' }
];

export default function LanguageSelect() {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang, i18n]);

  const handleContinue = () => {
    localStorage.setItem('ah-lang', selectedLang);
    navigate('/welcome');
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFCF7] relative overflow-hidden">
      {/* Decorative Top Right Leaves */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-40 mix-blend-multiply w-48 h-48 sm:w-64 sm:h-64 translate-x-4 -translate-y-4">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-green-200 fill-current">
          <path d="M190.5,23.5 C170.2,10.1 140.4,18.8 125.1,38.2 C115.6,50.1 112.5,65.3 113.8,80.1 C114.6,90.2 120.4,98.7 128.5,104.2 C148.8,117.6 178.6,108.9 193.9,89.5 C203.4,77.6 206.5,62.4 205.2,47.6 C204.4,37.5 198.6,29.0 190.5,23.5 Z" />
          <path d="M110.2,5.1 C95.4,-7.5 73.1,-5.2 60.1,9.8 C51.8,19.3 49.2,32.4 51.5,44.8 C53.0,52.8 58.6,59.3 65.8,63.2 C80.6,75.8 102.9,73.5 115.9,58.5 C124.2,49.0 126.8,35.9 124.5,23.5 C123.0,15.5 117.4,9.0 110.2,5.1 Z" />
        </svg>
      </div>

      {/* Header */}
      <div className="pt-16 px-6 pb-6 lg:max-w-md mx-auto w-full relative z-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{t('select_language')}</h1>
        <p className="text-slate-500 font-medium">{t('select_language')}</p>
      </div>

      {/* Language List */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 lg:max-w-md mx-auto w-full">
        <div className="space-y-3">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <div 
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
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
                    <p className="text-sm font-medium text-slate-500">({lang.name})</p>
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
      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFCF7] via-[#FDFCF7] to-transparent pt-12 flex justify-center z-20">
        <div className="w-full lg:max-w-md">
          <button 
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-600/30 hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            {t('continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
