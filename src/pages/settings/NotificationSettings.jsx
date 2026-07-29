import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { CloudRain, TrendingUp, Bug, Bell, Gift } from 'lucide-react';

export default function NotificationSettings() {
  const { settings, updateSetting } = useSettings();
  const { notifications } = settings;

  const Toggle = ({ icon: Icon, label, checked, onChange, subtitle, disabled = false }) => (
    <div className={`flex justify-between items-center py-3 w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-zinc-900 font-bold">{label}</span>
          {subtitle && <span className="text-zinc-500 text-xs">{subtitle}</span>}
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-green-700' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  mb-6">
        <Toggle 
          label="All Notifications" 
          checked={notifications.allNotifications} 
          onChange={(val) => updateSetting('notifications', 'allNotifications', val)} 
        />
      </div>

      <div className={`bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  space-y-2 mb-6 ${!notifications.allNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Notification Channels</h3>
        
        <div className="border-b border-gray-100 ">
          <Toggle 
            label="Push Notifications" 
            checked={notifications.pushNotifications} 
            onChange={(val) => updateSetting('notifications', 'pushNotifications', val)} 
          />
        </div>
        <div className="border-b border-gray-100 ">
          <Toggle 
            label="Email Notifications" 
            checked={notifications.emailNotifications} 
            onChange={(val) => updateSetting('notifications', 'emailNotifications', val)} 
          />
        </div>
        <div>
          <Toggle 
            label="SMS Notifications" 
            checked={notifications.smsNotifications} 
            onChange={(val) => updateSetting('notifications', 'smsNotifications', val)} 
          />
        </div>
      </div>

      <div className={`bg-white  rounded-2xl p-4 shadow-sm border border-gray-100  space-y-2 ${!notifications.allNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Alert Categories</h3>
        
        <div className="border-b border-gray-100">
          <Toggle 
            icon={CloudRain}
            label="Weather Alerts" 
            checked={notifications.alertCategories.weather} 
            onChange={(val) => updateSetting('notifications', 'alertCategories', { ...notifications.alertCategories, weather: val })} 
          />
        </div>
        <div className="border-b border-gray-100">
          <Toggle 
            icon={TrendingUp}
            label="Market Alerts" 
            checked={notifications.alertCategories.market} 
            onChange={(val) => updateSetting('notifications', 'alertCategories', { ...notifications.alertCategories, market: val })} 
          />
        </div>
        <div className="border-b border-gray-100">
          <Toggle 
            icon={Bug}
            label="Pest & Disease Alerts" 
            checked={notifications.alertCategories.pestDisease} 
            onChange={(val) => updateSetting('notifications', 'alertCategories', { ...notifications.alertCategories, pestDisease: val })} 
          />
        </div>
        <div className="border-b border-gray-100">
          <Toggle 
            icon={Bell}
            label="Reminders" 
            checked={notifications.alertCategories.reminders} 
            onChange={(val) => updateSetting('notifications', 'alertCategories', { ...notifications.alertCategories, reminders: val })} 
          />
        </div>
        <div>
          <Toggle 
            icon={Gift}
            label="Offers & Updates" 
            checked={notifications.alertCategories.offersUpdates} 
            onChange={(val) => updateSetting('notifications', 'alertCategories', { ...notifications.alertCategories, offersUpdates: val })} 
          />
        </div>
      </div>
    </div>
  );
}
