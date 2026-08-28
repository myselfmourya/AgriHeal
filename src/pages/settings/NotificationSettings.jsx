import React, { useEffect, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { CloudRain, TrendingUp, Bug, Bell, Gift } from 'lucide-react';

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

export default function NotificationSettings() {
  const { settings, updateSetting } = useSettings();
  const { notifications } = settings;

  // Track actual browser permission state
  const [permState, setPermState] = useState('default'); // 'default' | 'granted' | 'denied'

  useEffect(() => {
    if ('Notification' in window) {
      setPermState(Notification.permission);
    }
  }, []);

  const handlePushToggle = async (val) => {
    if (val && 'Notification' in window) {
      if (Notification.permission === 'denied') {
        alert(
          'Push notifications are blocked by your browser.\n\n' +
          'To enable them:\n1. Click the 🔒 icon in your address bar\n2. Set Notifications to "Allow"\n3. Refresh the page'
        );
        return;
      }
      if (Notification.permission !== 'granted') {
        const result = await Notification.requestPermission();
        setPermState(result);
        if (result !== 'granted') return;
      }
    }
    updateSetting('notifications', 'pushNotifications', val);
  };

  const ToggleRow = ({ icon: Icon, label, checked, onChange, subtitle, disabled = false }) => (
    <div className={`w-full flex items-center justify-between p-4 bg-slate-50 ${!disabled && 'hover:bg-gray-100'} transition-colors ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        )}
        <div className="text-left">
          <h4 className="font-bold text-gray-900 text-sm">{label}</h4>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">

      {/* Browser permission warning */}
      {permState === 'denied' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-3xl text-sm text-yellow-800 font-medium">
          ⚠️ Push notifications are <strong>blocked</strong> in your browser settings.
          Open your browser's site settings and set Notifications to "Allow" to use this feature.
        </div>
      )}

      {/* Main Switch */}
      <div className="mb-8">
        <div className="bg-slate-50 rounded-3xl overflow-hidden">
          <ToggleRow
            label="All Notifications"
            subtitle="Enable or disable all alerts"
            checked={notifications.allNotifications}
            onChange={(val) => updateSetting('notifications', 'allNotifications', val)}
          />
        </div>
      </div>

      {/* Channels */}
      <div className={`mb-8 ${!notifications.allNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Notification Channels</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">
          <ToggleRow
            label="Push Notifications"
            subtitle={permState === 'denied' ? '⚠️ Blocked in browser' : 'Alerts when app is closed'}
            checked={notifications.pushNotifications && permState === 'granted'}
            onChange={handlePushToggle}
          />
          <ToggleRow
            label="Email Notifications"
            checked={notifications.emailNotifications}
            onChange={(val) => updateSetting('notifications', 'emailNotifications', val)}
          />
          <ToggleRow
            label="SMS Notifications"
            checked={notifications.smsNotifications}
            onChange={(val) => updateSetting('notifications', 'smsNotifications', val)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className={`mb-8 ${!notifications.allNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Alert Categories</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">
          {[
            { icon: CloudRain, key: 'weather',     label: 'Weather Alerts' },
            { icon: TrendingUp, key: 'market',     label: 'Market Alerts' },
            { icon: Bug,       key: 'pestDisease', label: 'Pest & Disease Alerts' },
            { icon: Bell,      key: 'reminders',   label: 'Reminders' },
            { icon: Gift,      key: 'offersUpdates', label: 'Offers & Updates' },
          ].map(({ icon, key, label }) => (
            <ToggleRow
              key={key}
              icon={icon}
              label={label}
              checked={notifications.alertCategories[key]}
              onChange={(val) => updateSetting('notifications', 'alertCategories', {
                ...notifications.alertCategories, [key]: val
              })}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
