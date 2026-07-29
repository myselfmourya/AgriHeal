import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, TestTube, Sprout, Activity, RefreshCw, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CropNutrition({ onSpeak }) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const crops = [
    { id: 'wheat', name: 'Wheat' },
    { id: 'rice', name: 'Rice' },
    { id: 'corn', name: 'Corn/Maize' },
    { id: 'soybean', name: 'Soybean' },
    { id: 'cotton', name: 'Cotton' }
  ];

  const soilData = {
    n: 45, // Nitrogen mg/kg
    p: 30, // Phosphorus mg/kg
    k: 120, // Potassium mg/kg
    ph: 6.2,
    organicMatter: 2.4
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    if (onSpeak) onSpeak(`Analyzing soil compatibility for ${crops.find(c => c.id === selectedCrop)?.name}...`);
    
    setTimeout(() => {
      setResults({
        recommendations: [
          { type: 'fertilizer', title: 'Nitrogen Boost Needed', desc: 'Apply 50kg/ha of Urea to meet crop demands.', icon: <TestTube className="text-blue-500" size={24}/> },
          { type: 'ph', title: 'Optimal pH Level', desc: 'Soil pH is well within the 6.0-7.0 ideal range.', icon: <CheckCircle2 className="text-green-500" size={24}/> },
          { type: 'rotation', title: 'Suggested Rotation', desc: 'Plant Legumes next season to naturally restore Nitrogen.', icon: <RefreshCw className="text-amber-500" size={24}/> }
        ],
        healthScore: 78
      });
      setAnalyzing(false);
      if (onSpeak) onSpeak("Analysis complete. Your soil needs a nitrogen boost for optimal yield.");
    }, 1500);
  };

  useEffect(() => {
    if (onSpeak) {
      onSpeak("Welcome to the Crop Nutrition module. Select a crop to analyze your soil's compatibility.");
    }
  }, []);

  return (
    <div className="page-body pb-24 px-4 bg-[#f8f9fc] min-h-screen font-sans">
      <div className="pt-6 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Leaf className="text-green-600 mr-2" size={32} />
          Crop Nutrition
        </h1>
        <p className="text-gray-500">Soil analysis and fertilizer recommendations</p>
      </div>

      {/* Current Soil Status */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="text-blue-500 mr-2" size={20} />
          Current Soil NPK Profile
        </h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-blue-500 font-bold text-2xl mb-1">{soilData.n}</div>
            <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Nitrogen (N)</div>
            <div className="text-[10px] text-gray-400 mt-1">mg/kg</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center">
            <div className="text-purple-500 font-bold text-2xl mb-1">{soilData.p}</div>
            <div className="text-xs text-purple-600 font-medium uppercase tracking-wider">Phosphorus (P)</div>
            <div className="text-[10px] text-gray-400 mt-1">mg/kg</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center">
            <div className="text-amber-500 font-bold text-2xl mb-1">{soilData.k}</div>
            <div className="text-xs text-amber-600 font-medium uppercase tracking-wider">Potassium (K)</div>
            <div className="text-[10px] text-gray-400 mt-1">mg/kg</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Droplets className="text-cyan-500 mr-3" size={20} />
            <div>
              <div className="text-xs text-gray-500">Soil pH</div>
              <div className="font-semibold text-gray-800">{soilData.ph}</div>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Sprout className="text-emerald-500 mr-3" size={20} />
            <div>
              <div className="text-xs text-gray-500">Organic Matter</div>
              <div className="font-semibold text-gray-800">{soilData.organicMatter}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-[24px] p-6 text-white shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Target Crop Analysis</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-green-100 mb-2">Select Crop to Plant</label>
          <div className="relative">
            <select 
              className="w-full bg-white/20 border border-white/30 text-white rounded-xl py-3 px-4 appearance-none outline-none focus:ring-2 focus:ring-white/50"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {crops.map(crop => (
                <option key={crop.id} value={crop.id} className="text-gray-900">{crop.name}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 rotate-90" size={18} />
          </div>
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="w-full bg-white text-green-700 font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-green-50 transition-colors flex items-center justify-center"
        >
          {analyzing ? (
            <RefreshCw className="animate-spin mr-2" size={20} />
          ) : (
            <Activity className="mr-2" size={20} />
          )}
          {analyzing ? 'Analyzing Soil...' : 'Generate Recommendations'}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-bold text-gray-800 text-lg px-1">Action Plan</h3>
          
          {results.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-start">
              <div className="p-3 bg-gray-50 rounded-2xl mr-4">
                {rec.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 border border-blue-100 rounded-[20px] p-5 mt-6 flex items-start">
            <AlertCircle className="text-blue-500 mr-3 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Apply fertilizers when soil moisture is adequate (ideally after light rain) to maximize nutrient uptake and minimize runoff.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
