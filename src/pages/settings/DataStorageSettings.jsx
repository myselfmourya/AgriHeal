import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight } from 'lucide-react';

export default function DataStorageSettings() {
  const { settings, updateSetting } = useSettings();
  const { dataStorage } = settings;

  const Toggle = ({ label, checked, onChange, subtitle }) => (
    <div className="flex justify-between items-center py-3">
      <div className="flex flex-col">
        <span className="text-gray-900  font-bold">{label}</span>
        {subtitle && <span className="text-gray-400  text-xs">{subtitle}</span>}
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
            label="Auto Cloud Backup" 
            checked={dataStorage.autoBackup} 
            onChange={(val) => updateSetting('dataStorage', 'autoBackup', val)} 
          />
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Backup Frequency</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {dataStorage.backupFrequency} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <span className="font-bold text-gray-900 ">Backup Quality (Images)</span>
          <div className="flex items-center text-sm font-bold text-gray-500">
            {dataStorage.backupQuality} <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 ">Storage Used</span>
            <span className="text-xs text-gray-500">Local Cache: 156MB</span>
          </div>
          <div className="text-right">
            <button className="text-sm font-bold text-slate-600 bg-slate-50  px-3 py-1 rounded-lg">Clear Cache</button>
          </div>
        </div>

        <div className="p-3">
          <Toggle 
            label="Cellular Data Sync" 
            subtitle="Use mobile data for backups"
            checked={dataStorage.cellularDataSync} 
            onChange={(val) => updateSetting('dataStorage', 'cellularDataSync', val)} 
          />
        </div>

      </div>
    </div>
  );
}
