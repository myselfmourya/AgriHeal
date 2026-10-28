import React, { useState, useMemo } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { dataManagementService } from '../../services/dataManagementService';
import { useVoiceActions } from '../../hooks/useVoiceActions';

// Keys that must survive a "clear cache" (auth/session + user prefs), everything
// else in localStorage is app-generated cache (chat history, weather cache, etc.)
const PROTECTED_KEYS_PREFIXES = ['sb-', 'ah-lang', 'ah-onboarding', 'agriheal-settings'];

const computeLocalCacheSize = () => {
  let bytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key) || '';
    bytes += (key.length + value.length) * 2; // UTF-16 code units
  }
  return bytes;
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DataStorageSettings() {
  const [cacheSize, setCacheSize] = useState(() => computeLocalCacheSize());
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState(null);

  const cacheLabel = useMemo(() => formatBytes(cacheSize), [cacheSize]);

  const handleClearCache = () => {
    setClearing(true);
    setMessage(null);
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!PROTECTED_KEYS_PREFIXES.some(p => key.startsWith(p))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      setCacheSize(computeLocalCacheSize());
      setMessage({ type: 'success', text: `Cleared ${keysToRemove.length} cached item(s). Your settings and login stay intact.` });
    } finally {
      setClearing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    const ok = await dataManagementService.exportUserData();
    setMessage(ok
      ? { type: 'success', text: 'Your data export has started downloading.' }
      : { type: 'error', text: 'Failed to export your data. Please try again.' });
    setExporting(false);
  };

  useVoiceActions([
    {
      id: 'data.clearCache',
      description: 'Clear locally cached app data (not login or settings) to free up space',
      params: {},
      destructive: true, // irreversible for the cached data
      handler: () => {
        handleClearCache();
        return 'Cache cleared.';
      },
    },
    {
      id: 'data.exportMyData',
      description: "Export all of the farmer's data as a downloadable file",
      params: {},
      destructive: false,
      handler: async () => {
        const ok = await dataManagementService.exportUserData();
        if (!ok) throw new Error('Failed to export your data.');
        return 'Your data export has started downloading.';
      },
    },
  ], []);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-sm text-blue-800">
        Your crops, livestock, and records are saved directly to your account in real time — there's no separate backup to configure.
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">

        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Local Cache</span>
            <span className="text-xs text-gray-500">On-device cache: {cacheLabel}</span>
          </div>
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> {clearing ? 'Clearing…' : 'Clear Cache'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Export My Data</span>
            <span className="text-xs text-gray-500">Download a copy of your farm data as JSON</span>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> {exporting ? 'Exporting…' : 'Export'}
          </button>
        </div>

      </div>
    </div>
  );
}
