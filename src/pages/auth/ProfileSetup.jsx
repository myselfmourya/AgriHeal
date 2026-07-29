import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, ArrowRight, Sprout, Droplets, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useFarmer } from '../../contexts/FarmerContext';

const SOIL_TYPES = ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Laterite Soil', 'Sandy Soil'];
const IRRIGATION_TYPES = ['Rainfed', 'Borewell', 'Canal', 'Drip', 'Sprinkler'];
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

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { updateProfile, addMyCrop } = useFarmer();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    location: '',
    district: '',
    landSize: '',
    soilType: '',
    irrigation: '',
    selectedCrops: []
  });

  const handleComplete = () => {
    // 1. Update Profile
    updateProfile({
      location: `${formData.location}, ${formData.district}`,
      landSize: formData.landSize,
      soilType: formData.soilType,
      irrigation: formData.irrigation
    });

    // 2. Add Selected Crops to Context
    formData.selectedCrops.forEach(cropId => {
      const cropDef = COMMON_CROPS.find(c => c.id === cropId);
      if (cropDef) {
        addMyCrop({
          name: cropDef.name,
          emoji: cropDef.emoji,
          area: Number(formData.landSize) || 1, // Distribute area or use default
          variety: 'Standard',
          stage: 'Sowing',
          health: 100,
          progress: 0,
          calendar: []
        });
      }
    });

    // 3. Mark as logged in and redirect to home
    login();
    navigate('/home');
  };

  const nextStep = () => {
    if (step < 3) setStep(s => s + 1);
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
        
        {/* Progress bar */}
        <div className="flex gap-2 mb-6 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors ${step >= i ? 'bg-green-600' : 'bg-green-100'}`} />
          ))}
        </div>

        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
          {step === 1 && t('where_is_your_farm', 'Where is your farm?')}
          {step === 2 && t('farm_details', 'Farm Details')}
          {step === 3 && t('what_do_you_grow', 'What do you grow?')}
        </h1>
        <p className="text-slate-500 font-medium">
          {step === 1 && t('farm_location_desc', 'This helps us provide accurate weather and market prices.')}
          {step === 2 && t('farm_details_desc', 'This helps AI give you precise fertilizer and care advice.')}
          {step === 3 && t('crop_selection_desc', 'Select all crops you are currently growing.')}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 lg:max-w-xl mx-auto w-full">
        
        {/* STEP 1: LOCATION */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <button className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 font-bold py-4 rounded-2xl border border-green-200 hover:bg-green-100 transition-colors">
              <Navigation className="w-5 h-5" />
              {t('use_current_location', 'Use Current Location')}
            </button>
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-bold text-slate-400">{t('or_enter_manually', 'OR ENTER MANUALLY')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('village_town', 'Village / Town')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 font-medium text-slate-800"
                  placeholder={t('eg_palampur', 'e.g. Palampur')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('district_state', 'District / State')}</label>
              <input 
                type="text" 
                value={formData.district}
                onChange={e => setFormData({...formData, district: e.target.value})}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 font-medium text-slate-800"
                placeholder={t('eg_kangra', 'e.g. Kangra, Himachal Pradesh')}
              />
            </div>
          </div>
        )}

        {/* STEP 2: FARM DETAILS */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('total_land_size', 'Total Land Size (Acres)')}</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.landSize}
                  onChange={e => setFormData({...formData, landSize: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-4 pr-16 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 font-medium text-slate-800 text-lg"
                  placeholder="0.0"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">{t('acres', 'Acres')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5"><Sprout className="w-4 h-4"/> {t('soil_type', 'Soil Type')}</label>
              <div className="flex flex-wrap gap-2">
                {SOIL_TYPES.map(soil => (
                  <button
                    key={soil}
                    onClick={() => setFormData({...formData, soilType: soil})}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      formData.soilType === soil 
                        ? 'border-green-600 bg-green-50 text-green-700' 
                        : 'border-gray-100 bg-white text-slate-600 hover:border-green-200'
                    }`}
                  >
                    {t(`soil_${soil.replace(' ', '_').toLowerCase()}`, soil)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5"><Droplets className="w-4 h-4"/> {t('irrigation_source', 'Irrigation Source')}</label>
              <div className="flex flex-wrap gap-2">
                {IRRIGATION_TYPES.map(irr => (
                  <button
                    key={irr}
                    onClick={() => setFormData({...formData, irrigation: irr})}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      formData.irrigation === irr 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-100 bg-white text-slate-600 hover:border-blue-200'
                    }`}
                  >
                    {t(`irrigation_${irr.toLowerCase()}`, irr)}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: CROP SELECTION */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {COMMON_CROPS.map(crop => {
                const isSelected = formData.selectedCrops.includes(crop.id);
                return (
                  <div
                    key={crop.id}
                    onClick={() => toggleCrop(crop.id)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer h-32 ${
                      isSelected 
                        ? 'border-green-600 bg-green-50/50 shadow-sm' 
                        : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5 fill-white" />
                      </div>
                    )}
                    <span className="text-4xl mb-2 filter drop-shadow-sm">{crop.emoji}</span>
                    <span className={`font-bold text-sm text-center ${isSelected ? 'text-green-800' : 'text-slate-700'}`}>
                      {t(`crop_${crop.name.toLowerCase()}`, crop.name)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFCF7] via-[#FDFCF7] to-transparent pt-12 flex justify-center pointer-events-none">
        <div className="w-full lg:max-w-xl pointer-events-auto">
          <button 
            onClick={nextStep}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-600/30 hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            {step < 3 ? t('continue', 'Continue') : t('finish_setup', 'Finish Setup')}
            {step < 3 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
