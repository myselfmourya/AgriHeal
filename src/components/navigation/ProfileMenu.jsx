import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { User, LogOut, Settings, HelpCircle, Download, Activity, ChevronRight, Moon, Sun, Monitor, Globe, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu({ isActive, setActive }) {
  const navigate = useNavigate();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' }
  ];

  const handleNav = (path) => {
    navigate(path);
    setActive(false);
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <div 
        onClick={() => setActive(!isActive)}
        className={`flex items-center gap-2 pl-2 md:pl-3 ml-1 md:ml-2 cursor-pointer rounded-full transition-all duration-300 ${isActive ? 'ring-2 ring-green-500 ring-offset-2' : 'hover:opacity-80'}`}
      >
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi" alt="Profile" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-orange-100 border border-gray-200 object-cover" />
      </div>

      {/* Panel */}
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
          
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi" alt="Profile" className="w-12 h-12 rounded-full bg-orange-100 border-2 border-white shadow-sm" />
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">Ravi Kumar</h3>
                <p className="text-[10px] text-gray-500 font-medium">Farmer ID: #AH-4920</p>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-700">Profile Completion</span>
                <span className="text-green-600">80%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <button className="text-[10px] text-blue-600 font-semibold hover:underline">Complete Profile to unlock AI features &rarr;</button>
            </div>
          </div>

          <div className="p-2 space-y-0.5">
            <button onClick={() => handleNav('/profile')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg group transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                <span className="font-medium">My Profile & Farm</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button onClick={() => handleNav('/home')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg group transition-colors">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                <span className="font-medium">Dashboard</span>
              </div>
            </button>

            <button onClick={() => handleNav('/settings/downloads')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg group transition-colors">
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                <span className="font-medium">Offline Downloads</span>
              </div>
            </button>


            <div className="h-px bg-gray-100 my-1 mx-2"></div>

            <button onClick={() => handleNav('/settings')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg group transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                <span className="font-medium">Settings</span>
              </div>
            </button>
            
            <button onClick={() => handleNav('/help')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg group transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                <span className="font-medium">Help & Support</span>
              </div>
            </button>

            {/* Quick Toggles */}
            <div className="px-3 py-2 mt-1 bg-gray-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Light Mode">
                  <Sun className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors" title="Dark Mode">
                  <Moon className="w-4 h-4" />
                </button>
                <button className="p-1.5 bg-white shadow-sm text-green-600 rounded-lg transition-colors" title="System Auto">
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLanguageModal(true);
                }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 hover:text-gray-900 bg-white px-2 py-1 rounded-md shadow-sm"
              >
                <Globe className="w-3 h-3" /> {selectedLang.toUpperCase()}
              </button>
            </div>

            <button className="w-full mt-1 text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Select Language
              </h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLanguageModal(false);
                }} 
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLang(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${selectedLang === lang.code ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50 border border-transparent'}`}
                >
                  <span className={`font-medium ${selectedLang === lang.code ? 'text-green-700' : 'text-gray-700'}`}>
                    {lang.name}
                  </span>
                  {selectedLang === lang.code && (
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
