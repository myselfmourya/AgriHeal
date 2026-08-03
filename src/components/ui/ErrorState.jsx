import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ 
  title, 
  message, 
  onRetry,
  fullScreen = false
}) {
  const { t } = useTranslation();

  const content = (
    <div aria-live="assertive" className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-3xl border border-red-100 max-w-md mx-auto my-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-red-900 mb-2">
        {title || t('error_default_title', 'Something went wrong')}
      </h3>
      <p className="text-red-700/80 font-medium mb-6">
        {message || t('error_default_desc', 'We encountered an error while trying to load this data. Please try again.')}
      </p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md shadow-red-600/20 active:scale-[0.98]"
        >
          <RefreshCw className="w-5 h-5" />
          {t('retry_action', 'Try Again')}
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FDFCF7] z-40 flex items-center justify-center px-4">
        {content}
      </div>
    );
  }

  return content;
}
