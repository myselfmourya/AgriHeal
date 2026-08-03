import React from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-50 border-b border-amber-200 px-4 py-3 shadow-md animate-slide-down">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full shrink-0 mt-0.5 sm:mt-0">
          <WifiOff className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-amber-800">{t('offline_mode_title', 'You are currently offline')}</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            {t('offline_mode_desc', 'AgriHeal is running in offline mode. Changes will sync when connection returns.')}
          </p>
        </div>
      </div>
    </div>
  );
}
