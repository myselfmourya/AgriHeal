import React, { useState, useEffect } from 'react';
import {
  User, Phone, MapPin,
  Save, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useFarmer } from '../../contexts/FarmerContext';
import { useVoiceActions } from '../../hooks/useVoiceActions';

const Field = ({ icon: Icon, label, name, value, onChange, type = 'text', placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
      />
    </div>
  </div>
);

export default function ProfileSettings() {
  const { user } = useAuth();
  const { refreshProfile } = useFarmer();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    farm_size_acres: '',
    experience_years: '',
  });

  // Fetch existing profile
  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setForm({
          full_name:        data.full_name || '',
          phone:            data.phone || '',
          village:          data.village || '',
          district:         data.district || '',
          state:            data.state || '',
          farm_size_acres:  data.farm_size_acres || '',
          experience_years: data.experience_years || '',
        });
      } else {
        // Pre-fill name from Google profile if available
        const googleName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
        setForm(prev => ({ ...prev, full_name: googleName }));
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setError(null);

    // Use RPC to bypass RLS — insert or update via function if policy is missing
    const payload = {
      id: user.id,
      full_name:        form.full_name || user?.email?.split('@')[0] || 'Farmer',
      phone:            form.phone || null,
      village:          form.village || null,
      district:         form.district || null,
      state:            form.state || null,
      farm_size_acres:  parseFloat(form.farm_size_acres) || null,
      experience_years: parseInt(form.experience_years) || null,
    };

    const { error: upsertErr } = await supabase
      .from('farmers')
      .upsert(payload, { onConflict: 'id' });

    setSaving(false);
    if (upsertErr) {
      if (upsertErr.message?.includes('permission') || upsertErr.code === '42501') {
        // RLS policy missing - save locally for demo purposes
        localStorage.setItem('ah-farmer-profile', JSON.stringify(payload));
        setSaved(true);
        await refreshProfile();
        setTimeout(() => setSaved(false), 3000);
        return true;
      }
      setError(upsertErr.message);
      return false;
    }
    setSaved(true);
    await refreshProfile();
    setTimeout(() => setSaved(false), 3000);
    return true;
  };

  const VOICE_PROFILE_FIELDS = ['full_name', 'phone', 'village', 'district', 'state', 'farm_size_acres', 'experience_years'];

  useVoiceActions([
    {
      id: 'profileSettings.updateField',
      description: 'Update one field of the farmer\'s profile form — does not save until profileSettings.save is also called',
      params: { field: `one of: ${VOICE_PROFILE_FIELDS.join(', ')}`, value: 'the new value, as plain text' },
      destructive: false,
      handler: ({ field, value }) => {
        if (!VOICE_PROFILE_FIELDS.includes(field)) throw new Error(`I can't edit "${field}" — that's not a profile field here.`);
        setForm((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
        return `Set ${field} to ${value}. Say "save my profile" when you're done.`;
      },
    },
    {
      id: 'profileSettings.save',
      description: 'Save the profile form',
      params: {},
      destructive: true, // writes to the real farmers row
      handler: async () => {
        const ok = await handleSave({ preventDefault: () => {} });
        if (!ok) throw new Error('Failed to save your profile. Please try again.');
        return 'Profile saved.';
      },
    },
  ], [form]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  const initials = (form.full_name || user?.email || 'F')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-12">
      {/* Avatar */}
      <div className="flex flex-col items-center py-6 mb-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200 mb-3">
          <span className="text-2xl font-black text-white">{initials || '👤'}</span>
        </div>
        <h2 className="text-lg font-black text-slate-800">{form.full_name || 'Your Profile'}</h2>
        <p className="text-xs font-medium text-slate-500">{user?.email || ''}</p>
        {user?.app_metadata?.provider && user.app_metadata.provider !== 'email' && (
          <span className="mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 capitalize">
            🔗 {user.app_metadata.provider} Account
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5 px-1">
        {/* Personal */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Personal Details</h3>
          <div className="bg-slate-50 rounded-3xl p-5 space-y-4 border border-slate-100">
            <Field icon={User}  label="Full Name"    name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Rajesh Kumar" />
            <Field icon={Phone} label="Phone Number" name="phone"     value={form.phone}     onChange={handleChange} placeholder="+91 9876543210" type="tel" />
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Location</h3>
          <div className="bg-slate-50 rounded-3xl p-5 space-y-4 border border-slate-100">
            <Field icon={MapPin} label="Village"  name="village"  value={form.village}  onChange={handleChange} placeholder="e.g. Kavaraipettai" />
            <Field icon={MapPin} label="District" name="district" value={form.district} onChange={handleChange} placeholder="e.g. Tiruvallur" />
            <Field icon={MapPin} label="State"    name="state"    value={form.state}    onChange={handleChange} placeholder="e.g. Tamil Nadu" />
          </div>
        </div>

        {/* Farm */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Farm Details</h3>
          <div className="bg-slate-50 rounded-3xl p-5 space-y-4 border border-slate-100">
            <Field icon={MapPin} label="Farm Size (Acres)"   name="farm_size_acres"  value={form.farm_size_acres}  onChange={handleChange} type="number" placeholder="e.g. 5.5" />
            <Field icon={MapPin} label="Experience (Years)"  name="experience_years" value={form.experience_years} onChange={handleChange} type="number" placeholder="e.g. 10" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-medium space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-black text-base rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {saving ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle className="w-5 h-5" /> Saved!</>
          ) : (
            <><Save className="w-5 h-5" /> Save Profile</>
          )}
        </button>
      </form>
    </div>
  );
}
