import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, TestTube, Sprout, Activity, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react';
import { useVoiceActions } from '../hooks/useVoiceActions';

// No free, keyless soil-NPK sensor API exists (same reason FarmCare's soil
// chemistry card is labeled simulated) — this is a representative loam
// baseline, not a reading from this farm. The AI recommendation below is
// real; only this starting profile is simulated.
const SIMULATED_SOIL = {
  n: 45, // Nitrogen mg/kg
  p: 30, // Phosphorus mg/kg
  k: 120, // Potassium mg/kg
  ph: 6.2,
  organicMatter: 2.4
};

const ICONS = {
  fertilizer: <TestTube className="text-blue-500" size={24} />,
  ph: <CheckCircle2 className="text-green-500" size={24} />,
  rotation: <RefreshCw className="text-amber-500" size={24} />,
  deficiency: <AlertCircle className="text-red-500" size={24} />,
  general: <Sprout className="text-emerald-500" size={24} />,
};

export default function CropNutrition({ onSpeak }) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const crops = [
    { id: 'wheat', name: 'Wheat' },
    { id: 'rice', name: 'Rice' },
    { id: 'corn', name: 'Corn/Maize' },
    { id: 'soybean', name: 'Soybean' },
    { id: 'cotton', name: 'Cotton' }
  ];

  useVoiceActions([
    {
      id: 'nutrition.selectCrop',
      description: 'Select which crop to analyze soil nutrition for',
      params: { cropName: `one of: ${crops.map(c => c.name).join(', ')}` },
      destructive: false,
      handler: ({ cropName }) => {
        const match = crops.find((c) => c.name.toLowerCase() === String(cropName || '').toLowerCase());
        if (!match) throw new Error(`"${cropName}" isn't a crop I can analyze here.`);
        setSelectedCrop(match.id);
        return `Selected ${match.name}.`;
      },
    },
    {
      id: 'nutrition.analyze',
      description: 'Run the soil nutrition analysis for the currently selected crop',
      params: {},
      destructive: false,
      handler: async () => {
        await handleAnalyze();
        return `Analyzed soil compatibility for ${crops.find(c => c.id === selectedCrop)?.name}.`;
      },
    },
  ], [selectedCrop]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    const cropName = crops.find(c => c.id === selectedCrop)?.name;
    if (onSpeak) onSpeak(`Analyzing soil compatibility for ${cropName}...`);

    try {
      const { generateStructuredResponse } = await import('../services/aiProvider');
      const prompt = `Act as a soil fertility expert. Given this soil profile — Nitrogen ${SIMULATED_SOIL.n} mg/kg, Phosphorus ${SIMULATED_SOIL.p} mg/kg, Potassium ${SIMULATED_SOIL.k} mg/kg, pH ${SIMULATED_SOIL.ph}, Organic Matter ${SIMULATED_SOIL.organicMatter}% — assess its suitability for growing ${cropName} in India. Give specific, actionable fertilizer/amendment recommendations and an overall soil health score out of 100 for this crop.`;
      const schema = `{
        "healthScore": "number 0-100, how suitable this soil is for the selected crop",
        "recommendations": [
          { "type": "fertilizer | ph | rotation | deficiency | general", "title": "string, short", "desc": "string, one specific actionable sentence" }
        ]
      }`;
      const result = await generateStructuredResponse(prompt, schema);
      setResults(result);
      if (onSpeak) onSpeak(`Analysis complete. Soil health score for ${cropName} is ${result.healthScore} out of 100.`);
    } catch (err) {
      console.error('Soil analysis error:', err);
      setError('Could not reach VANI for soil analysis. Please try again.');
      if (onSpeak) onSpeak("I couldn't complete the soil analysis right now. Please try again.");
    } finally {
      setAnalyzing(false);
    }
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

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2 text-amber-800 text-sm mb-6">
        <ShieldAlert className="shrink-0 mt-0.5" size={18} />
        <span><strong>The soil NPK profile below is a simulated baseline</strong> — no soil-testing sensor is connected to your farm, and no free source exists for live soil chemistry. The recommendations you generate are a real AI assessment run against this baseline, not pre-written text.</span>
      </div>

      {/* Current Soil Status */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="text-blue-500 mr-2" size={20} />
          Soil NPK Profile <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Simulated</span>
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-blue-500 font-bold text-2xl mb-1">{SIMULATED_SOIL.n}</div>
            <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Nitrogen (N)</div>
            <div className="text-[10px] text-gray-400 mt-1">mg/kg</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center">
            <div className="text-purple-500 font-bold text-2xl mb-1">{SIMULATED_SOIL.p}</div>
            <div className="text-xs text-purple-600 font-medium uppercase tracking-wider">Phosphorus (P)</div>
            <div className="text-[10px] text-gray-400 mt-1">mg/kg</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center">
            <div className="text-amber-500 font-bold text-2xl mb-1">{SIMULATED_SOIL.k}</div>
            <div className="text-xs text-amber-600 font-medium uppercase tracking-wider">Potassium (K)</div>
            <div className="text-[10px] text-gray-400 mt-1">mg/kg</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Droplets className="text-cyan-500 mr-3" size={20} />
            <div>
              <div className="text-xs text-gray-500">Soil pH</div>
              <div className="font-semibold text-gray-800">{SIMULATED_SOIL.ph}</div>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Sprout className="text-emerald-500 mr-3" size={20} />
            <div>
              <div className="text-xs text-gray-500">Organic Matter</div>
              <div className="font-semibold text-gray-800">{SIMULATED_SOIL.organicMatter}%</div>
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
              onChange={(e) => { setSelectedCrop(e.target.value); setResults(null); }}
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-6">
          <AlertCircle className="w-4 h-4 inline mr-2" />{error}
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-800 text-lg">Action Plan</h3>
            <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">Health Score: {results.healthScore}/100</span>
          </div>

          {results.recommendations?.map((rec, idx) => (
            <div key={idx} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-start">
              <div className="p-3 bg-gray-50 rounded-2xl mr-4">
                {ICONS[rec.type] || ICONS.general}
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
