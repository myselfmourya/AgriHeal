import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight, Phone } from 'lucide-react';

export default function EmergencySettings() {
  const { settings, updateSetting } = useSettings();
  const { emergency } = settings;

  const Toggle = ({ label, checked, onChange, subtitle }) => (
    <div className="flex justify-between items-center py-3 w-full">
      <div className="flex flex-col">
        <span className="text-zinc-900 font-bold">{label}</span>
        {subtitle && <span className="text-zinc-500 text-xs">{subtitle}</span>}
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-red-600' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      
      <div className="bg-red-50  rounded-2xl p-4 shadow-sm border border-red-100  mb-6 flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100  rounded-full flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 text-red-600 " />
        </div>
        <div>
          <h3 className="font-bold text-red-800 ">Emergency SOS</h3>
          <p className="text-xs text-red-600/80  mt-1">
            Activating SOS will immediately share your farm location with all your emergency contacts and local authorities (if enabled).
          </p>
        </div>
      </div>

      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  space-y-2">
        
        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 ">Primary Emergency Contacts</span>
            <span className="text-xs text-gray-500">Family members, neighbors, etc.</span>
          </div>
          <div className="flex items-center text-sm font-bold text-red-600">
            {emergency.primaryContacts.length} Added <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 ">Local Authorities</span>
            <span className="text-xs text-gray-500">Police, Ambulance, Fire</span>
          </div>
          <ChevronRight className="w-4 h-4 ml-1 text-gray-400" />
        </div>

        <div className="border-b border-gray-100 ">
          <Toggle 
            label="Share Live Location" 
            subtitle="Automatically share location during SOS"
            checked={emergency.shareLiveLocation} 
            onChange={(val) => updateSetting('emergency', 'shareLiveLocation', val)} 
          />
        </div>

        <div>
          <Toggle 
            label="Auto-Record Audio" 
            subtitle="Record audio when SOS is triggered"
            checked={emergency.autoRecordAudio} 
            onChange={(val) => updateSetting('emergency', 'autoRecordAudio', val)} 
          />
        </div>

      </div>
    </div>
  );
}
