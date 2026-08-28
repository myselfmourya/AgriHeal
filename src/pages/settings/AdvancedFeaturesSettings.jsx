import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Smartphone, Database, Cpu, Wifi, ChevronRight, HardDrive, RefreshCw } from 'lucide-react';

function Switch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`${
        checked ? 'bg-green-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span
        aria-hidden="true"
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
}

export default function AdvancedFeaturesSettings() {
  const { settings, updateSetting } = useSettings();
  
  // Safe defaults if advanced settings don't exist yet
  const advanced = settings.advanced || {
    hardwareAcceleration: true,
    backgroundSync: true,
    offlineData: true,
    developerMode: false
  };

  const handleUpdate = (key, val) => {
    updateSetting('advanced', key, val);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      
      {/* System Features */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">System Features</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">
          
          <div className="p-4 flex items-center justify-between bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <Cpu className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Hardware Acceleration</h4>
                <p className="text-xs text-gray-500">Improves app performance</p>
              </div>
            </div>
            <Switch 
              checked={advanced.hardwareAcceleration} 
              onChange={(val) => handleUpdate('hardwareAcceleration', val)} 
            />
          </div>

          <div className="p-4 flex items-center justify-between bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Background Sync</h4>
                <p className="text-xs text-gray-500">Keep data fresh in background</p>
              </div>
            </div>
            <Switch 
              checked={advanced.backgroundSync} 
              onChange={(val) => handleUpdate('backgroundSync', val)} 
            />
          </div>

        </div>
      </div>

      {/* Data Management */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Data Management</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">
          
          <div className="p-4 flex items-center justify-between bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <HardDrive className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Offline Data Storage</h4>
                <p className="text-xs text-gray-500">Save data for offline use</p>
              </div>
            </div>
            <Switch 
              checked={advanced.offlineData} 
              onChange={(val) => handleUpdate('offlineData', val)} 
            />
          </div>

        </div>
      </div>

    </div>
  );
}
