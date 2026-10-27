import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Package, 
  MapPin, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  ExternalLink, 
  Phone, 
  RefreshCw, 
  Navigation, 
  AlertCircle, 
  X,
  Edit,
  Trash2,
  Clock,
  TrendingUp,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../contexts/FarmerContext';
import AddCropModal from '../components/AddCropModal';
import EditCropModal from '../components/EditCropModal';
import { fertilisers } from '../data/mockFertilisers';
import { insuranceSchemes } from '../data/mockInsurance';
import { getNearbyVendors } from '../data/mockVendors';
import { useVoiceActions } from '../hooks/useVoiceActions';

// Fallback logic for new crops
export const generateCropDetails = (crop) => {
  return {
    ...crop,
    image: crop.image || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800',
    stage: crop.stage || 'Seedling',
    health: crop.health || 'Good',
    daysSinceSowing: crop.daysSinceSowing || 5,
    daysLeftToHarvest: crop.daysLeftToHarvest || 110,
    expectedHarvest: crop.expectedHarvest || 'Pending',
    pestStatus: crop.pestStatus || 'No Problems',
    progress: crop.progress || 5,
    aiAdvice: crop.aiAdvice || 'Monitor soil moisture regularly in this early stage.'
  };
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ─── User Crops Tab ─────────────────────────────────────────────────────────
function UserCropsTab() {
  const { myCrops, addMyCrop, deleteMyCrop } = useFarmer();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  const displayCrops = myCrops.map(generateCropDetails);

  const handleDeleteCrop = (crop) => {
    if (window.confirm(`Remove ${crop.name} from your crops?`)) {
      deleteMyCrop(crop.id);
    }
  };

  useVoiceActions([
    {
      id: 'crops.addCrop',
      description: "Add a new crop to the farmer's crop list, given a crop name",
      params: { cropName: 'string, required — the name of the crop, e.g. "Tomato"' },
      destructive: true, // creates a real record — ask for confirmation first
      handler: async ({ cropName }) => {
        if (!cropName) throw new Error('No crop name given.');
        const crop = await addMyCrop({ name: cropName, emoji: '🌱' });
        return `Added ${crop.name} to your crops.`;
      },
    },
    {
      id: 'crops.deleteCrop',
      description: 'Permanently remove a crop from the farmer\'s crop list, given its name',
      params: { cropName: 'string, required — the name of the crop to remove' },
      destructive: true,
      handler: async ({ cropName }) => {
        if (!cropName) throw new Error('No crop name given.');
        const match = myCrops.find((c) => c.name.toLowerCase() === String(cropName).toLowerCase());
        if (!match) throw new Error(`I couldn't find a crop named ${cropName}.`);
        await deleteMyCrop(match.id);
        return `Removed ${match.name} from your crops.`;
      },
    },
  ], [myCrops, addMyCrop, deleteMyCrop]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-900">My Fields ({displayCrops.length})</h3>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Crop
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
        {displayCrops.map((crop, i) => (
          <motion.div 
            key={crop.id}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 hover:shadow-md transition-all"
          >
            <div className="flex gap-4">
              <div className="relative">
                <img src={crop.image} alt={crop.name} className="w-20 h-24 rounded-2xl object-cover" />
                <span className={cn(
                  "absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white",
                  crop.health === 'Good' ? "bg-green-400" : crop.health === 'Average' ? "bg-yellow-400" : "bg-red-400"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">
                    {crop.name} {crop.emoji}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingCrop(crop)}
                      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"
                    >
                      <Edit className="h-3 w-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteCrop(crop)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-green-600 font-semibold">{crop.stage} Stage</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 mb-1">
                  <span className="flex items-center gap-1 truncate"><Clock className="w-3 h-3 shrink-0" />{crop.daysSinceSowing} Days</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 shrink-0" />{crop.progress}%</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <span className="font-semibold text-gray-800">{crop.expectedHarvest}</span>
                  <span className="text-gray-400 truncate">Exp. Yield</span>
                </div>
                <button
                  onClick={() => navigate(`/crops/${crop.id}`)}
                  className="w-full bg-green-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-green-700 transition-colors"
                >
                  <Sprout className="w-3.5 h-3.5" /> View Details
                </button>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2 bg-blue-50/50 p-2 rounded-xl border border-blue-100/50">
              <span className="font-semibold text-blue-700 mr-1">AI Advice:</span>
              {crop.aiAdvice}
            </p>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-lg border",
                crop.health === 'Good' ? "bg-green-50 text-green-700 border-green-100" :
                crop.health === 'Average' ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                "bg-red-50 text-red-700 border-red-100"
              )}>
                Health: {crop.health}
              </span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-lg border",
                crop.pestStatus === 'No Problems' ? "bg-green-50 text-green-700 border-green-100" :
                crop.pestStatus === 'Pest Detected' ? "bg-orange-50 text-orange-700 border-orange-100" :
                "bg-red-50 text-red-700 border-red-100"
              )}>
                {crop.pestStatus}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AddCropModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditCropModal 
        isOpen={!!editingCrop} 
        onClose={() => setEditingCrop(null)} 
        cropData={editingCrop} 
      />
    </div>
  );
}

// ─── Fertilisers Tab ────────────────────────────────────────────────────────
function FertilisersTab() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const displayFerts = fertilisers.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.genericName.toLowerCase().includes(search.toLowerCase())
  );

  const FORM_COLORS = {
    "Granules": "bg-blue-50 text-blue-600",
    "Powder / Granules": "bg-violet-50 text-violet-600",
    "Powder / Crystals": "bg-cyan-50 text-cyan-600",
    "Liquid": "bg-green-50 text-green-600",
    "Water Soluble Powder": "bg-orange-50 text-orange-600",
    "Powder": "bg-gray-50 text-gray-600",
    "Liquid / Powder": "bg-emerald-50 text-emerald-600",
    "Crystals": "bg-sky-50 text-sky-600"
  };

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-green-500 shadow-sm"
          placeholder="Search by name, generic name..."
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
        {displayFerts.map((fert) => {
          const formColor = FORM_COLORS[fert.form] || "bg-gray-50 text-gray-600";
          return (
            <div 
              key={fert.id} 
              className="glass rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setExpanded(fert.id)}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base pr-2 leading-tight">{fert.name}</h4>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap", formColor)}>
                      {fert.form.split(" / ")[0]}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-green-700 font-semibold mb-2 truncate">{fert.genericName}</p>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{fert.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4 font-bold text-sm">
                <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded-lg text-xs">{fert.price}</span>
                <span className="text-green-600 text-[11px] sm:text-xs flex items-center gap-1">View Details <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Overlay for Fertiliser Details */}
      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExpanded(null)}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {(() => {
              const fert = displayFerts.find(f => f.id === expanded);
              if (!fert) return null;
              const formColor = FORM_COLORS[fert.form] || "bg-gray-50 text-gray-600";

              return (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {fert.name}
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", formColor)}>
                          {fert.form.split(" / ")[0]}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-green-700 font-semibold">{fert.genericName}</p>
                    </div>
                    <button onClick={() => setExpanded(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">Price</p>
                        <p className="text-sm sm:text-base font-bold text-gray-900">{fert.price}</p>
                      </div>
                      <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Form</p>
                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{fert.form}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">Description</h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{fert.description}</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Usage", value: fert.usage, icon: "💡", color: "text-blue-900", bg: "bg-blue-50" },
                        { label: "Dosage", value: fert.dosage, icon: "⚖️", color: "text-amber-900", bg: "bg-amber-50" },
                        { label: "Side Effects & Precautions", value: fert.sideEffects, icon: "⚠️", color: "text-red-900", bg: "bg-red-50" },
                      ].map(({ label, value, icon, color, bg }) => (
                        <div key={label} className={cn("rounded-2xl p-3 sm:p-4", bg)}>
                          <p className={cn("text-xs font-bold mb-1 flex items-center gap-1.5", color)}>
                            {icon} {label}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>

                    {fert.brands && fert.brands.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Popular Brands</h3>
                        <div className="flex gap-1.5 flex-wrap">
                          {fert.brands.map((b) => (
                            <span key={b} className="bg-gray-100 border border-gray-200 text-gray-700 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm">{b}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Insurance Tab ──────────────────────────────────────────────────────────
function InsuranceTab() {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const displaySchemes = filter === "All" 
    ? insuranceSchemes 
    : insuranceSchemes.filter(s => s.type === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["All", "Government", "Private"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all",
              filter === f ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200")}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
        {displaySchemes.map((scheme) => {
          const isOpen = expanded === scheme.id;
          return (
            <div key={scheme.id} className="glass rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <div className="p-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : scheme.id)}>
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight flex-1 mr-2">{scheme.name}</h4>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                    scheme.type === "Government" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")}>
                    {scheme.type}
                  </span>
                </div>
                <p className="text-xs font-bold text-green-700 mb-1">{scheme.coverage}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{scheme.description}</p>
                {scheme.ruralExplanation && (
                  <div className="mt-2 bg-amber-50/50 rounded-xl px-3 py-2 border border-amber-100/50">
                    <p className="text-[11px] text-amber-800 leading-relaxed">💡 {scheme.ruralExplanation}</p>
                  </div>
                )}
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-gray-100">
                    <div className="p-4 space-y-3 bg-gray-50/30">
                      <div>
                        <p className="text-xs font-bold text-green-700 mb-1">✅ Benefits</p>
                        <ul className="space-y-1">
                          {scheme.benefits?.map((b, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0" />{b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-700 mb-1">📋 Eligibility</p>
                        <p className="text-xs text-gray-600">{scheme.eligibility}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-orange-600 mb-1">📄 Required Documents</p>
                        <div className="flex flex-wrap gap-1">
                          {scheme.requiredDocuments?.map((d) => (
                            <span key={d} className="bg-orange-50 text-orange-700 text-[10px] px-2 py-0.5 rounded-full border border-orange-100">{d}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-1">🪜 How to Apply</p>
                        <ol className="space-y-1">
                          {scheme.applicationSteps?.map((s, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="flex gap-2 pt-1 mt-3">
                        <a href={scheme.officialWebsite} target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" /> Official Website
                        </a>
                        <a href={`tel:${scheme.helpline}`}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-colors">
                          <Phone className="w-3.5 h-3.5" /> {scheme.helpline}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vendor Locator Tab ────────────────────────────────────────────────────
function VendorLocatorTab() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [located, setLocated] = useState(false);

  const findVendors = async () => {
    setLoading(true); setError("");
    if (!navigator.geolocation) { 
      setError("Geolocation not supported."); 
      setLoading(false); 
      return; 
    }
    
    // Fallback/Timeout for testing if location is slow
    const timeoutId = setTimeout(async () => {
       const mockData = await getNearbyVendors(28.6139, 77.2090); // default to Delhi for testing
       setVendors(mockData);
       setLocated(true);
       setLoading(false);
    }, 3000);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeoutId);
        try {
          const { latitude, longitude } = pos.coords;
          const data = await getNearbyVendors(latitude, longitude);
          setVendors(data);
          setLocated(true);
        } catch { 
          setError("Failed to fetch vendors. Please try again."); 
        }
        setLoading(false);
      },
      (err) => { 
        clearTimeout(timeoutId);
        // Fallback if denied
        getNearbyVendors(28.6139, 77.2090).then(data => {
          setVendors(data);
          setLocated(true);
          setLoading(false);
        });
      },
      { timeout: 5000 }
    );
  };

  return (
    <div>
      {!located && (
        <div className="text-center py-6 mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Find Nearby Mandis & Vendors</h3>
          <p className="text-sm text-gray-500 mb-4">We'll use your GPS location to find markets within 15km</p>
          <button onClick={findVendors} disabled={loading}
            className="px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 mx-auto hover:bg-green-700 transition-colors shadow-lg">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Locating...</> : <><Navigation className="w-4 h-4" /> Find Vendors</>}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {located && (
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold text-gray-900">Nearby Mandis/Vendors ({vendors.length})</p>
          <button onClick={findVendors} className="text-xs text-green-600 font-medium flex items-center gap-1 hover:text-green-700">
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} /> Refresh
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
        {vendors.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 mr-3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">{v.name}</h4>
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                    v.type === "Mandi" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    v.type === "Retailer" ? "bg-blue-50 text-blue-700 border-blue-100" :
                    "bg-gray-50 text-gray-700 border-gray-200"
                  )}>{v.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{v.address}</p>
              </div>
              <span className="bg-green-50 text-green-700 border border-green-100 text-xs font-bold px-2 py-1 rounded-xl shrink-0 shadow-sm">
                {v.distance} km
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lon}`}
                target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors">
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
              {v.phone && (
                <a href={`tel:${v.phone}`}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main CropManagement Page ───────────────────────────────────────────────
export default function CropManagement() {
  const TABS = [
    { id: "crops", label: "User Crops", icon: Sprout },
    { id: "fertilisers", label: "Fertilisers", icon: Package },
    { id: "insurance", label: "Insurance", icon: ShieldCheck },
    { id: "vendors", label: "Vendors", icon: MapPin },
  ];
  const [activeTab, setActiveTab] = useState("crops");

  useVoiceActions([
    {
      id: 'crops.switchTab',
      description: 'Switch which section of the Crop Management page is shown: User Crops, Fertilisers, Insurance, or Vendors',
      params: { tab: 'one of: "crops", "fertilisers", "insurance", "vendors"' },
      destructive: false,
      handler: ({ tab }) => {
        const match = TABS.find((t) => t.id === tab);
        if (!match) throw new Error(`I don't have a "${tab}" section here.`);
        setActiveTab(match.id);
        return `Showing ${match.label}.`;
      },
    },
  ], []);

  // Minimal and clean layout mirroring WellPath
  return (
    <div className="page-content px-4 md:px-8 pt-6 w-full min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-5 pt-2">
        {activeTab === "crops" ? (
            <>
                <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Crops</h2>
                <h1 className="text-2xl font-bold text-gray-900">Crops <span className="text-green-600">Management</span></h1>
            </>
        ) : (
            <>
                <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Information Hub</h2>
                <h1 className="text-2xl font-bold text-gray-900">Agriculture <span className="text-green-600">Information</span></h1>
            </>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          className="w-full pl-11 pr-12 py-4 rounded-2xl bg-white border border-gray-100 text-sm focus:outline-none shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
          placeholder={`Search ${activeTab}...`}
        />
      </div>

      {/* Horizontal Service Pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex-1 min-w-[100px] flex justify-center items-center gap-2 px-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm border",
              activeTab === id 
                ? "bg-green-600 text-white shadow-green-200 border-green-600 pointer-events-none" 
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
            )}
          >
            <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-green-600")} /> 
            {label}
          </button>
        ))}
      </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -8 }} 
            transition={{ duration: 0.15 }}
          >
            {activeTab === "crops" && <UserCropsTab />}
            {activeTab === "fertilisers" && <FertilisersTab />}
            {activeTab === "vendors" && <VendorLocatorTab />}
            {activeTab === "insurance" && <InsuranceTab />}
          </motion.div>
        </AnimatePresence>
    </div>
  );
}
