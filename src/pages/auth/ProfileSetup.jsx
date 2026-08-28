import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, ArrowRight, Sprout, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const COMMON_CROPS = [
  { id: 'c1', name: 'Paddy', emoji: '🌾' },
  { id: 'c2', name: 'Cotton', emoji: '☁️' },
  { id: 'c3', name: 'Sugarcane', emoji: '🎋' },
  { id: 'c4', name: 'Wheat', emoji: '🌾' },
  { id: 'c5', name: 'Maize', emoji: '🌽' },
  { id: 'c6', name: 'Groundnut', emoji: '🥜' },
  { id: 'c7', name: 'Tomato', emoji: '🍅' },
  { id: 'c8', name: 'Chilli', emoji: '🌶️' },
  { id: 'c9', name: 'Soybean', emoji: '🌱' },
];

const COMMON_LIVESTOCK = [
  { id: 'l1', species: 'Cow', emoji: '🐄' },
  { id: 'l2', species: 'Buffalo', emoji: '🐃' },
  { id: 'l3', species: 'Goat', emoji: '🐐' },
  { id: 'l4', species: 'Sheep', emoji: '🐑' },
  { id: 'l5', species: 'Chicken', emoji: '🐔' },
];

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    experience: '',
    village: '',
    district: '',
    state: '',
    farmSize: '',
    selectedCrops: [],
    selectedLivestock: {} // { 'l1': 5, 'l3': 10 }
  });

  const handleComplete = async () => {
    setLoading(true);
    try {
      // 1. Get current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not found or not authenticated");

      // 2. Insert/Update Farmer Profile linked to Auth User ID
      const { data: farmer, error: farmerError } = await supabase
        .from('farmers')
        .upsert({
          id: user.id, // Link profile directly to auth user
          full_name: formData.fullName || 'New Farmer',
          phone: formData.phone || null,
          village: formData.village || null,
          district: formData.district || null,
          state: formData.state || null,
          experience_years: parseInt(formData.experience) || 0,
          farm_size_acres: parseFloat(formData.farmSize) || 0
        })
        .select()
        .single();

      if (farmerError) throw farmerError;

      // 2. Insert Crops
      if (formData.selectedCrops.length > 0 && farmer) {
        const cropsToInsert = formData.selectedCrops.map(cropId => {
          const cropDef = COMMON_CROPS.find(c => c.id === cropId);
          return {
            farmer_id: farmer.id,
            name: cropDef.name,
            emoji: cropDef.emoji,
            area_acres: (parseFloat(formData.farmSize) / formData.selectedCrops.length) || 1,
            stage: 'Sowing',
            health_score: 100,
            days_since_sowing: 0
          };
        });
        const { error: cropError } = await supabase.from('crops').insert(cropsToInsert);
        if (cropError) throw cropError;
      }

      // 3. Insert Livestock
      const livestockEntries = Object.entries(formData.selectedLivestock);
      if (livestockEntries.length > 0 && farmer) {
        const livestockToInsert = livestockEntries.map(([lId, count]) => {
          const lDef = COMMON_LIVESTOCK.find(l => l.id === lId);
          return {
            farmer_id: farmer.id,
            species: lDef.species,
            head_count: count,
            health_status: 'Healthy',
            average_temp: 38.5 // Default normal temp
          };
        });
        const { error: liveError } = await supabase.from('livestock').insert(livestockToInsert);
        if (liveError) throw liveError;
      }

      // 4. Mark as done and redirect to home
      localStorage.setItem('ah-farmer-id', farmer?.id);
      completeOnboarding();
      navigate('/home');

    } catch (err) {
      console.error('Error in onboarding:', err);
      const msg = err?.message || JSON.stringify(err) || 'Unknown error';
      alert('Error creating profile: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(s => s + 1);
    else handleComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const toggleCrop = (id) => {
    setFormData(prev => ({
      ...prev,
      selectedCrops: prev.selectedCrops.includes(id) 
        ? prev.selectedCrops.filter(c => c !== id)
        : [...prev.selectedCrops, id]
    }));
  };

  const updateLivestockCount = (id, amount) => {
    setFormData(prev => {
      const current = prev.selectedLivestock[id] || 0;
      const next = Math.max(0, current + amount);
      const newLive = { ...prev.selectedLivestock };
      if (next === 0) delete newLive[id];
      else newLive[id] = next;
      return { ...prev, selectedLivestock: newLive };
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] lg:h-screen bg-[#FDFCF7]">
      {/* Header */}
      <div className="pt-12 px-6 pb-2 lg:max-w-xl mx-auto w-full">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 mb-4 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
        )}
        
        <div className="flex gap-2 mb-6 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors ${step >= i ? 'bg-green-600' : 'bg-green-100'}`} />
          ))}
        </div>

        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
          {step === 1 && 'Personal Info'}
          {step === 2 && 'Location Details'}
          {step === 3 && 'Farm & Crops'}
          {step === 4 && 'Livestock (Optional)'}
        </h1>
        <p className="text-slate-500 font-medium">
          {step === 1 && 'Help us personalize your AgriHeal experience.'}
          {step === 2 && 'For accurate weather, markets, and schemes.'}
          {step === 3 && 'To give you precise crop care advice.'}
          {step === 4 && 'Do you own any animals?'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 lg:max-w-xl mx-auto w-full">
        
        {/* STEP 1: PERSONAL INFO */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-green-500 font-medium text-slate-800"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-green-500 font-medium text-slate-800"
                placeholder="+91"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Farming Experience (Years)</label>
              <input 
                type="number" 
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-green-500 font-medium text-slate-800"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Village / Town</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={formData.village}
                  onChange={e => setFormData({...formData, village: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-green-500 font-medium text-slate-800"
                  placeholder="e.g. Palampur"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">District</label>
                <input 
                  type="text" 
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-green-500 font-medium text-slate-800"
                  placeholder="e.g. Kangra"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">State</label>
                <input 
                  type="text" 
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-green-500 font-medium text-slate-800"
                  placeholder="e.g. HP"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CROP SELECTION */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Total Land Size (Acres)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.farmSize}
                  onChange={e => setFormData({...formData, farmSize: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-4 pr-16 focus:outline-none focus:border-green-500 font-medium text-slate-800 text-lg"
                  placeholder="0.0"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">Acres</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Select your crops</label>
              <div className="grid grid-cols-3 gap-3">
                {COMMON_CROPS.map(crop => {
                  const isSelected = formData.selectedCrops.includes(crop.id);
                  return (
                    <div
                      key={crop.id}
                      onClick={() => toggleCrop(crop.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer h-28 ${
                        isSelected 
                          ? 'border-green-600 bg-green-50/50 shadow-sm' 
                          : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4 fill-white" />
                        </div>
                      )}
                      <span className="text-3xl mb-1 filter drop-shadow-sm">{crop.emoji}</span>
                      <span className={`font-bold text-xs text-center ${isSelected ? 'text-green-800' : 'text-slate-700'}`}>
                        {crop.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LIVESTOCK */}
        {step === 4 && (
          <div className="animate-fade-in space-y-4">
            {COMMON_LIVESTOCK.map(live => {
              const count = formData.selectedLivestock[live.id] || 0;
              return (
                <div key={live.id} className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{live.emoji}</span>
                    <span className="font-bold text-slate-800">{live.species}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateLivestockCount(live.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-lg hover:bg-slate-200"
                    >-</button>
                    <span className="w-4 text-center font-bold text-slate-800">{count}</span>
                    <button 
                      onClick={() => updateLivestockCount(live.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg hover:bg-green-200"
                    >+</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFCF7] via-[#FDFCF7] to-transparent pt-12 flex justify-center pointer-events-none">
        <div className="w-full lg:max-w-xl pointer-events-auto">
          <button 
            disabled={loading}
            onClick={nextStep}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-600/30 hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : (step < 4 ? 'Continue' : 'Finish Setup')}
            {!loading && step < 4 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
