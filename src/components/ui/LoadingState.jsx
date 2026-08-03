import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message, fullScreen = false }) {
  const { t } = useTranslation();
  
  const content = (
    <div aria-live="polite" className="flex flex-col items-center justify-center p-8 space-y-4 text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-white p-3 rounded-full shadow-md border border-green-50">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          {message || t('loading_title', 'Loading...')}
        </h3>
        <p className="text-sm text-slate-500 font-medium mt-1">
          {t('loading_desc', 'Please wait while we fetch your data')}
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FDFCF7]/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-transparent">
      {content}
    </div>
  );
}
