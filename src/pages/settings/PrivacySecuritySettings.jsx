import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight } from 'lucide-react';

export default function PrivacySecuritySettings() {
  const { settings, updateSetting } = useSettings();
  const { privacySecurity } = settings;

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
        
        <div className="border-b border-gray-100 ">
          <Toggle 
            label="App Lock" 
            subtitle="Use PIN or Biometrics"
            checked={privacySecurity.appLock} 
            onChange={(val) => updateSetting('privacySecurity', 'appLock', val)} 
          />
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Change PIN</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            *** <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="border-b border-gray-100 ">
          <Toggle 
            label="Biometric Login" 
            subtitle="Use fingerprint or face ID"
            checked={privacySecurity.biometricLogin} 
            onChange={(val) => updateSetting('privacySecurity', 'biometricLogin', val)} 
          />
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 ">Privacy Settings</span>
            <span className="text-xs text-gray-500">Manage data sharing</span>
          </div>
          <ChevronRight className="w-4 h-4 ml-1 text-gray-400" />
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 ">Clear Cache</span>
            <span className="text-xs text-gray-500">Free up storage</span>
          </div>
          <div className="flex items-center text-sm font-bold text-green-600">
            12.5 MB
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 ">Blocked Users</span>
            <span className="text-xs text-gray-500">Manage blocked users</span>
          </div>
          <ChevronRight className="w-4 h-4 ml-1 text-gray-400" />
        </div>

        <div className="flex items-center justify-between p-3 hover:bg-red-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-red-600">Delete Account</span>
            <span className="text-xs text-red-500/80">Permanently delete account</span>
          </div>
          <ChevronRight className="w-4 h-4 ml-1 text-red-400" />
        </div>

      </div>
    </div>
  );
}
