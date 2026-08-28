import React, { useState, useRef } from 'react';
import { Bug, Camera, ShieldAlert, CheckCircle, AlertTriangle, ChevronRight, X, Loader2, Leaf, Sparkles } from 'lucide-react';
import { analyzeImage } from '../../services/aiProvider';

const RISK_CONFIG = {
  High:   { bg: 'bg-red-50',     border: 'border-red-200',   badge: 'bg-red-500 text-white',   text: 'text-red-700',   bar: 'bg-red-500' },
  Medium: { bg: 'bg-amber-50',   border: 'border-amber-200', badge: 'bg-amber-500 text-white', text: 'text-amber-700', bar: 'bg-amber-500' },
  Low:    { bg: 'bg-green-50',   border: 'border-green-200', badge: 'bg-green-500 text-white', text: 'text-green-700', bar: 'bg-green-500' },
};

function TreatmentModal({ threat, onClose }) {
  if (!threat) return null;
  const cfg = RISK_CONFIG[threat.risk] || RISK_CONFIG.Low;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div
        className="bg-white w-full md:w-[520px] rounded-t-3xl md:rounded-3xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-5 ${cfg.bg} rounded-t-3xl md:rounded-t-3xl flex items-start justify-between`}>
          <div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${cfg.badge} mb-2 inline-block`}>{threat.risk} Risk</span>
            <h2 className="text-xl font-black text-slate-800">{threat.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{threat.type}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/70 rounded-full hover:bg-white transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Symptoms</h3>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-2xl p-4">{threat.symptoms}</p>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Recommended Treatment</h3>
            <ul className="space-y-2">
              {threat.treatment.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Preventive Measures</h3>
            <ul className="space-y-2">
              {threat.prevention.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanModal({ crop, onClose }) {
  const fileRef = useRef();
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      setPreview(base64);
      setScanning(true);
      setResult(null);
      setError('');
      try {
        const prompt = `You are an expert agricultural plant pathologist. Analyze this image of a ${crop?.name || 'crop'} plant.
Identify:
1. Any visible pest or disease
2. Severity level (None/Low/Medium/High)
3. Exact disease/pest name
4. Key symptoms visible
5. Immediate treatment recommendation (2-3 specific steps)
6. Preventive measures (2 steps)

Respond in this exact JSON format:
{
  "detected": true/false,
  "name": "Disease/Pest Name or None",
  "severity": "None|Low|Medium|High",
  "symptoms": "What you see in the image",
  "treatment": ["step 1", "step 2", "step 3"],
  "prevention": ["step 1", "step 2"],
  "confidence": "High|Medium|Low"
}`;
        const text = await analyzeImage(base64, prompt);
        const clean = text.replace(/```json|```/g, '').trim();
        const json = JSON.parse(clean);
        setResult(json);
      } catch (err) {
        setError('Analysis failed. Please try with a clearer image.');
      }
      setScanning(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div
        className="bg-white w-full md:w-[540px] rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" /> AI Disease Scanner
          </h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Upload Area */}
          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-colors ${
              preview ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
            }`}
          >
            {preview ? (
              <img src={preview} alt="Scan preview" className="w-full max-h-52 object-contain rounded-2xl mx-auto" />
            ) : (
              <>
                <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <p className="font-bold text-slate-700">Take or Upload Photo</p>
                <p className="text-xs text-slate-500 mt-1">Tap to select image of affected leaf/plant</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={e => handleFile(e.target.files?.[0])} />

          {scanning && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
                <Leaf className="w-6 h-6 text-green-600 absolute inset-0 m-auto" />
              </div>
              <p className="text-sm font-bold text-slate-600">AI is analyzing your crop image...</p>
              <p className="text-xs text-slate-400">Checking for diseases, pests & infections</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          {result && !scanning && (
            <div className="space-y-4">
              <div className={`rounded-2xl p-4 ${result.detected ? (RISK_CONFIG[result.severity] || RISK_CONFIG.Low).bg : 'bg-green-50'} border ${result.detected ? (RISK_CONFIG[result.severity] || RISK_CONFIG.Low).border : 'border-green-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-800">{result.detected ? result.name : '✅ No Disease Detected'}</h4>
                  {result.detected && (
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${(RISK_CONFIG[result.severity] || RISK_CONFIG.Low).badge}`}>
                      {result.severity} Risk
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700">{result.symptoms}</p>
                <p className="text-[10px] text-slate-400 mt-1">Confidence: {result.confidence}</p>
              </div>

              {result.detected && result.treatment?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Treatment Plan</h4>
                  <ul className="space-y-2">
                    {result.treatment.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.prevention?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Prevention</h4>
                  <ul className="space-y-1.5">
                    {result.prevention.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => { setPreview(null); setResult(null); }}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors text-sm"
              >
                Scan Another Photo
              </button>
            </div>
          )}

          {!preview && !scanning && !result && (
            <p className="text-center text-xs text-slate-400 pb-2">
              Powered by Mistral Vision AI · Identifies 200+ crop diseases
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const CropPestDisease = ({ crop }) => {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [schedule, setSchedule] = useState([
    { id: 1, done: true,  label: 'Neem Oil Spray',          note: 'Completed 10 days ago',          daysLabel: null },
    { id: 2, done: false, label: 'Fungicide Application',   note: 'Preventive — before monsoon',     daysLabel: 'In 5 Days' },
    { id: 3, done: false, label: 'Pheromone Trap Setup',    note: 'For stem borer monitoring',       daysLabel: 'In 12 Days' },
    { id: 4, done: false, label: 'Border Crop Inspection',  note: 'Weekly perimeter check',          daysLabel: 'In 18 Days' },
  ]);

  // Build threats from crop data or defaults
  const observations = crop?.pest?.observations || [];
  const threats = observations.length > 0
    ? observations.map(o => ({
        name: o.name,
        type: o.name.includes('Blast') || o.name.includes('Blight') || o.name.includes('Rot') ? 'Fungal Disease' : 'Insect Pest',
        risk: o.risk || 'Low',
        symptoms: `${o.name} symptoms visible on ${crop?.name || 'crop'}. Monitor closely for spread.`,
        treatment: [
          `Apply appropriate ${o.risk === 'High' ? 'chemical' : 'bio-based'} treatment immediately`,
          'Remove and destroy severely infected plant parts',
          'Increase monitoring frequency to daily checks'
        ],
        prevention: [
          'Maintain proper plant spacing for air circulation',
          'Avoid over-irrigation to reduce humidity'
        ]
      }))
    : [
        {
          name: 'Fall Armyworm',
          type: 'Insect Pest',
          risk: 'High',
          symptoms: 'Ragged holes in leaves, frass (black droppings) in whorls, wilted central shoot, window-pane damage on young leaves.',
          treatment: [
            'Apply Emamectin Benzoate 5% SG @ 220 g/acre in early morning or evening',
            'Remove and destroy affected plants immediately to prevent spread',
            'Set up pheromone traps (8 per acre) for population monitoring'
          ],
          prevention: [
            'Use certified pest-free seeds and early-season sowing',
            'Encourage natural enemies — release Trichogramma parasitoids'
          ]
        },
        {
          name: 'Brown Plant Hopper',
          type: 'Insect Pest',
          risk: 'Medium',
          symptoms: 'Yellowing of lower leaves (hopper burn), wilting in patches, honeydew deposits, sooty mould on stems.',
          treatment: [
            'Drain field water for 3-4 days to expose BPH to heat and predators',
            'Apply Buprofezin 25% SC @ 400 ml/acre or Imidacloprid 200 SL @ 100 ml/acre',
            'Spray directed at base of plants where BPH congregates'
          ],
          prevention: [
            'Avoid excessive nitrogen fertilization which promotes soft tissue',
            'Maintain 25-30 cm spacing and remove weeds from bunds'
          ]
        },
        {
          name: 'Leaf Blast',
          type: 'Fungal Disease',
          risk: 'Low',
          symptoms: 'Diamond-shaped gray-white lesions with brown margins on leaves, white or gray center visible under magnification.',
          treatment: [
            'Apply Tricyclazole 75% WP @ 200 g/acre at first symptom appearance',
            'Avoid overhead irrigation; switch to drip or furrow irrigation',
            'Remove and burn severely infected plant material'
          ],
          prevention: [
            'Use blast-resistant varieties (IR-64, MTU-7029)',
            'Avoid late evening irrigation that increases leaf wetness duration'
          ]
        }
      ];

  const highRisk  = threats.filter(t => t.risk === 'High');
  const otherRisk = threats.filter(t => t.risk !== 'High');

  return (
    <div className="space-y-6 pb-6">
      {/* AI Scanner Card */}
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl p-6 shadow-xl relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
        onClick={() => setShowScanner(true)}
      >
        <div className="absolute -right-8 -bottom-8 opacity-[0.07]">
          <Bug className="w-40 h-40 text-white" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-black text-white">AI Disease Scanner</h2>
              <span className="text-[9px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <p className="text-slate-300 text-sm">Photo → instant AI diagnosis of pests & diseases</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
        <button
          className="mt-4 w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-2xl text-sm relative z-10 transition-colors"
          onClick={e => { e.stopPropagation(); setShowScanner(true); }}
        >
          📸 Open Camera Scanner
        </button>
      </div>

      {/* Overall Risk Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'High Risk', count: threats.filter(t=>t.risk==='High').length, color: 'text-red-600 bg-red-50 border-red-100' },
          { label: 'Medium Risk', count: threats.filter(t=>t.risk==='Medium').length, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Low Risk', count: threats.filter(t=>t.risk==='Low').length, color: 'text-green-600 bg-green-50 border-green-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-3 border text-center ${s.color}`}>
            <div className="text-2xl font-black">{s.count}</div>
            <div className="text-[10px] font-bold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Threats */}
      <div>
        <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" /> Active Threats
        </h3>
        <div className="space-y-3">
          {threats.map((threat, i) => {
            const cfg = RISK_CONFIG[threat.risk] || RISK_CONFIG.Low;
            return (
              <div key={i} className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 relative overflow-hidden`}>
                <div className={`absolute left-0 top-0 h-full w-1 ${cfg.bar}`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-black text-sm ${cfg.text}`}>{threat.name}</h4>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${cfg.badge}`}>{threat.risk}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{threat.type}</p>
                    <p className={`text-xs ${cfg.text} line-clamp-2`}>{threat.symptoms}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedThreat(threat)}
                  className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg ${cfg.bg} border ${cfg.border} ${cfg.text} hover:opacity-80 transition-opacity flex items-center gap-1`}
                >
                  View Treatment <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prevention Schedule */}
      <div>
        <h3 className="text-sm font-black text-slate-800 mb-3">Prevention Schedule</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {schedule.map((item, i) => (
            <div
              key={item.id}
              className={`p-4 flex items-center gap-4 ${i < schedule.length - 1 ? 'border-b border-slate-50' : ''} ${
                item.done ? 'opacity-50' : item.daysLabel && parseInt(item.daysLabel) <= 5 ? 'border-l-4 border-blue-500 bg-blue-50/30' : ''
              }`}
            >
              <button
                onClick={() => setSchedule(prev => prev.map(s => s.id === item.id ? { ...s, done: !s.done } : s))}
                className="shrink-0"
              >
                {item.done
                  ? <CheckCircle className="w-6 h-6 text-green-500" />
                  : <div className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-green-400 transition-colors" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-slate-800 text-sm ${item.done ? 'line-through' : ''}`}>{item.label}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
              </div>
              {item.daysLabel && !item.done && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg shrink-0">
                  {item.daysLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedThreat && <TreatmentModal threat={selectedThreat} onClose={() => setSelectedThreat(null)} />}
      {showScanner && <ScanModal crop={crop} onClose={() => setShowScanner(false)} />}
    </div>
  );
};

export default CropPestDisease;
