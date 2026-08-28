import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useVani } from '../../contexts/VaniContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Droplets, TrendingUp, Bug, Sprout, CloudRain, Settings as SettingsIcon, Mic, User, Ruler, RefreshCw } from 'lucide-react';

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

export default function GeneralSettings() {
  const { settings, updateSetting } = useSettings();
  const { startVaniSession } = useVani();
  const navigate = useNavigate();

  const handleToggleUnits = () => {
    updateSetting('general', 'units', settings.general.units === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      
      {/* Profile & Farm */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Profile & Farm</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">
          <button onClick={() => navigate('/settings/account')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Profile Details</h4>
                <p className="text-xs text-gray-500">Manage your profile and farm</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-500">
              View <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Preferences</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">
          <button onClick={handleToggleUnits} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <Ruler className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Units & Measurements</h4>
                <p className="text-xs text-gray-500">Set your preferred units</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-500">
              {settings.general.units === 'metric' ? 'Metric (°C, km)' : 'Imperial (°F, mi)'} <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Data Sync & Backup</h4>
                <p className="text-xs text-gray-500">Backup and sync your data</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-500">
              Today <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>



      {/* Need Help? */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-5 border border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/avatars/vani.png" alt="Vani" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover bg-green-100" />
          <div>
            <h3 className="font-bold text-green-900 text-sm">Need help?</h3>
            <p className="text-xs text-green-700">Ask Vani if you need help with any setting.</p>
          </div>
        </div>
        <button
          onClick={() => startVaniSession({ intent: 'settings_help' })}
          className="w-full sm:w-auto px-5 py-2.5 bg-green-700 text-white rounded-full font-bold text-sm shadow-sm hover:bg-green-800 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Mic className="w-4 h-4" /> Talk to Vani
        </button>
      </div>

    </div>
  );
}
