import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Plus } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Leaf, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  const { t } = useTranslation();

  return (
    <div aria-live="polite" className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm my-4">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-green-600" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        {title || t('empty_default_title', 'Nothing here yet')}
      </h3>
      <p className="text-slate-500 font-medium mb-6 max-w-sm">
        {description || t('empty_default_desc', 'You haven\'t added any items to this section yet.')}
      </p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md shadow-green-600/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
