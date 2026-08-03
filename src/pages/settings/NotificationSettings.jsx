import React, { useEffect, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { CloudRain, TrendingUp, Bug, Bell, Gift } from 'lucide-react';

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
        // Permission already permanently denied — tell user and do NOT flip toggle
        alert(
          'Push notifications are blocked by your browser.\n\n' +
          'To enable them:\n1. Click the 🔒 icon in your address bar\n2. Set Notifications to "Allow"\n3. Refresh the page'
        );
        return;
      }
      if (Notification.permission !== 'granted') {
        const result = await Notification.requestPermission();
        setPermState(result);
        if (result !== 'granted') return; // user denied — don't flip toggle
      }
    }
    updateSetting('notifications', 'pushNotifications', val);
  };

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

      {/* Browser permission warning */}
      {permState === 'denied' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
          ⚠️ Push notifications are <strong>blocked</strong> in your browser settings.
          Open your browser's site settings and set Notifications to "Allow" to use this feature.
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <Toggle
          label="All Notifications"
          checked={notifications.allNotifications}
          onChange={(val) => updateSetting('notifications', 'allNotifications', val)}
        />
      </div>

      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2 mb-6 ${!notifications.allNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Notification Channels</h3>

        <div className="border-b border-gray-100">
          <Toggle
            label="Push Notifications"
            subtitle={permState === 'denied' ? '⚠️ Blocked in browser — change site settings' : 'Get alerts even when app is closed'}
            checked={notifications.pushNotifications && permState === 'granted'}
            onChange={handlePushToggle}
          />
        </div>
        <div className="border-b border-gray-100">
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

      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2 ${!notifications.allNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Alert Categories</h3>

        {[
          { icon: CloudRain, key: 'weather',     label: 'Weather Alerts' },
          { icon: TrendingUp, key: 'market',     label: 'Market Alerts' },
          { icon: Bug,       key: 'pestDisease', label: 'Pest & Disease Alerts' },
          { icon: Bell,      key: 'reminders',   label: 'Reminders' },
          { icon: Gift,      key: 'offersUpdates', label: 'Offers & Updates' },
        ].map(({ icon, key, label }, i, arr) => (
          <div key={key} className={i < arr.length - 1 ? 'border-b border-gray-100' : ''}>
            <Toggle
              icon={icon}
              label={label}
              checked={notifications.alertCategories[key]}
              onChange={(val) => updateSetting('notifications', 'alertCategories', {
                ...notifications.alertCategories, [key]: val
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
