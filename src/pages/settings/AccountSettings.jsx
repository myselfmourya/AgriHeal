import React, { useState } from 'react';
import { Key, Smartphone, Mail, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFarmer } from '../../contexts/FarmerContext';
import { supabase } from '../../lib/supabase';
import { dataManagementService } from '../../services/dataManagementService';
import { useVoiceActions } from '../../hooks/useVoiceActions';

export default function AccountSettings() {
  const { user, logout, sendPasswordReset } = useAuth();
  const { profile } = useFarmer();
  const [busy, setBusy] = useState(null); // 'google' | 'facebook' | 'password' | 'delete' | null
  const [message, setMessage] = useState(null);

  const identities = user?.identities || [];
  const isLinked = (provider) => identities.some(i => i.provider === provider);

  const linkProvider = async (provider) => {
    setBusy(provider);
    setMessage(null);
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider,
        options: { redirectTo: window.location.origin + '/settings/account' },
      });
      if (error) throw error;
      // linkIdentity redirects the browser on success; nothing else to do here.
    } catch (err) {
      setMessage({ type: 'error', text: err.message || `Could not connect ${provider}.` });
      setBusy(null);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setMessage({ type: 'error', text: 'No email on file to send a reset link to.' });
      return;
    }
    setBusy('password');
    setMessage(null);
    try {
      await sendPasswordReset(user.email);
      setMessage({ type: 'success', text: `Password reset link sent to ${user.email}.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to send reset link.' });
    } finally {
      setBusy(null);
    }
  };

  const runDeleteAccount = async () => {
    setBusy('delete');
    setMessage(null);
    const ok = await dataManagementService.deleteAccount();
    if (ok) {
      await logout();
      window.location.href = '/login';
      return true;
    }
    setMessage({ type: 'error', text: 'Failed to delete account. Please try again or contact support.' });
    setBusy(null);
    return false;
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This permanently deletes your account and all farm data. This cannot be undone. Continue?'
    );
    if (!confirmed) return;
    await runDeleteAccount();
  };

  useVoiceActions([
    {
      id: 'account.deleteAccount',
      description: 'Permanently delete the farmer\'s AgriHeal account and all their farm data',
      params: {},
      destructive: true, // Vani's own "say yes to confirm" flow replaces the browser popup here
      handler: async () => {
        const ok = await runDeleteAccount();
        if (!ok) throw new Error('Could not delete your account. Please try again or contact support.');
        return 'Your account has been deleted.';
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

      {/* Linked Accounts */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Linked Accounts</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">

          <div className="p-4 flex items-center justify-between bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-sm">Google</h3>
                <p className="text-xs text-gray-500">{isLinked('google') ? 'Connected' : 'Not connected'}</p>
              </div>
            </div>
            {isLinked('google') ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <button
                onClick={() => linkProvider('google')}
                disabled={busy === 'google'}
                className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {busy === 'google' ? 'Connecting…' : 'Connect'}
              </button>
            )}
          </div>

          <div className="p-4 flex items-center justify-between bg-slate-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-sm">Facebook</h3>
                <p className="text-xs text-gray-500">{isLinked('facebook') ? 'Connected' : 'Not connected'}</p>
              </div>
            </div>
            {isLinked('facebook') ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <button
                onClick={() => linkProvider('facebook')}
                disabled={busy === 'facebook'}
                className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {busy === 'facebook' ? 'Connecting…' : 'Connect'}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Account Details */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Account Details</h3>
        <div className="bg-slate-50 rounded-3xl overflow-hidden flex flex-col gap-0.5">

          <div className="w-full flex items-center justify-between p-4 bg-slate-50">
            <div className="flex items-center gap-4">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Phone Number</h4>
                <p className="text-xs text-gray-500">{profile?.phone || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between p-4 bg-slate-50">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Email Address</h4>
                <p className="text-xs text-gray-500">{user?.email || 'Not set'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={busy === 'password'}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <Key className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <h4 className="font-bold text-gray-900 text-sm">Change Password</h4>
                <p className="text-xs text-gray-500">{busy === 'password' ? 'Sending reset link…' : 'Send a reset link to your email'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider px-4 mb-3">Danger Zone</h3>
        <div className="bg-red-50/50 rounded-3xl overflow-hidden flex flex-col gap-0.5 border border-red-100">

          <button
            onClick={handleDeleteAccount}
            disabled={busy === 'delete'}
            className="w-full flex items-center justify-between p-4 bg-white/50 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <h4 className="font-bold text-red-700 text-sm">Delete Account</h4>
                <p className="text-xs text-red-500/80">{busy === 'delete' ? 'Deleting…' : 'Permanently remove all data'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-300" />
          </button>

        </div>
      </div>

    </div>
  );
}
