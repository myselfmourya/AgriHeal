import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mic, Stethoscope } from 'lucide-react';
import { MdOutlineCurrencyRupee } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useVani } from '../../contexts/VaniContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isVoiceModeEnabled, toggleVoiceMode } = useVani();
  const { loginWithGoogle, loginWithFacebook } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFCF7] overflow-hidden">
      
      {/* Top Graphic Section (Left on Desktop) */}
      <div className="relative w-full lg:w-1/2 flex flex-col pt-8 lg:pt-12 items-center justify-center lg:bg-green-50 lg:rounded-r-[60px] lg:shadow-xl shrink-0 min-h-[45vh] lg:min-h-screen">
        
        {/* Logo at Top */}
        <div className="absolute top-8 left-0 right-0 flex flex-col items-center justify-center z-20 px-6">
          <div className="flex items-center gap-2 mb-1 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-green-50">
            <Leaf className="w-7 h-7 text-green-600 fill-current" />
            <span className="text-2xl font-bold text-green-800">AgriHeal</span>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="relative w-full h-full max-w-lg mx-auto mt-16 px-4 flex items-end justify-center lg:items-center">
          <img 
            src="/assets/welcome-hero.jpg"
            alt="Welcome Farmer" 
            className="w-full max-h-[40vh] lg:max-h-[70vh] object-contain object-bottom lg:object-center drop-shadow-sm rounded-3xl"
          />
        </div>
      </div>

      {/* Main Content (Right on Desktop) */}
      <div className="flex flex-col justify-start lg:justify-center px-6 py-8 lg:w-1/2 z-10 bg-[#FDFCF7] flex-1">
        <div className="w-full max-w-sm mx-auto flex flex-col h-full lg:h-auto justify-between lg:justify-center gap-8">
          
          <div className="text-center mt-4 lg:mt-0">
            <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">{t('welcome')}</h1>
            <p className="text-slate-500 font-medium">{t('subtitle')}</p>
          </div>

          <div className="flex items-center justify-between bg-green-50/50 border border-green-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Mic className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{t('vani_title')}</h3>
                <p className="text-xs text-slate-500">{t('vani_desc')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isVoiceModeEnabled}
                onChange={(e) => toggleVoiceMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="space-y-3 w-full">
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 active:scale-[0.98] transition-all"
            >
              {t('login')}
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-4 rounded-2xl bg-white text-green-700 border-2 border-green-600 font-bold text-lg hover:bg-green-50 active:scale-[0.98] transition-all"
            >
              {t('register')}
            </button>
            
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">{t('or_continue')}</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={async () => { try { await loginWithGoogle(); } catch (e) { console.error(e); } }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-100 bg-white hover:bg-gray-50 transition-colors font-semibold text-slate-700">
                <FcGoogle className="w-5 h-5" /> Google
              </button>
              <button onClick={async () => { try { await loginWithFacebook(); } catch (e) { console.error(e); } }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-100 bg-white hover:bg-gray-50 transition-colors font-semibold text-slate-700">
                <FaFacebook className="w-5 h-5 text-blue-600" /> Facebook
              </button>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="mt-auto lg:mt-10 mb-4 lg:mb-0">
            <div className="flex justify-between items-start">
              
              <div className="flex flex-col items-center gap-2 w-16">
                <div className="w-12 h-12 rounded-full border border-green-100 flex items-center justify-center text-green-600 bg-green-50/50">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{t('ai_assistant')}</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-16">
                <div className="w-12 h-12 rounded-full border border-green-100 flex items-center justify-center text-green-600 bg-green-50/50">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{t('crop_care')}</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-16">
                <div className="w-12 h-12 rounded-full border border-green-100 flex items-center justify-center text-green-600 bg-green-50/50">
                  <MdOutlineCurrencyRupee className="w-[22px] h-[22px]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{t('market_prices')}</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-16">
                <div className="w-12 h-12 rounded-full border border-green-100 flex items-center justify-center text-green-600 bg-green-50/50">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{t('expert_advice')}</span>
              </div>

            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
