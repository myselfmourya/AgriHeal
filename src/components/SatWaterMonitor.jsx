import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Map, 
  AlertTriangle, 
  Activity, 
  CloudRain, 
  CheckCircle, 
  Volume2, 
  RefreshCw,
  Waves
} from 'lucide-react';

export default function SatWaterMonitor({ onSpeak }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Simulate fetching satellite data
    const timer = setTimeout(() => {
      setData({
        farmArea: "North-West Plot 4",
        soilMoisture: 42,
        waterQuality: "Optimal",
        irrigationNeeds: "Low",
        contaminantRisk: "None Detected",
        lastScan: "2 hours ago",
        status: "safe",
        alerts: []
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeakStatus = () => {
    if (!data || !onSpeak) return;
    const text = `Farm water status for ${data.farmArea}. Soil moisture is at ${data.soilMoisture}%. Water quality is ${data.waterQuality}. Contaminant risk: ${data.contaminantRisk}. Overall status is ${data.status}.`;
    onSpeak(text);
  };

  if (loading) {
    return (
      <div className="page-body flex flex-col items-center justify-center h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <RefreshCw className="w-12 h-12 text-emerald-600 mb-4" />
        </motion.div>
        <p className="text-emerald-800 font-medium">Scanning Satellite Data...</p>
      </div>
    );
  }

  return (
    <div className="page-body p-4 max-w-2xl mx-auto pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <Waves className="w-6 h-6 text-blue-500" />
            Water Monitor
          </h1>
          <p className="text-emerald-700/70 text-sm">Satellite-backed Farm Water Safety</p>
        </div>
        <button
          onClick={handleSpeakStatus}
          className="p-3 bg-emerald-100 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors shadow-sm"
          aria-label="Read Status Aloud"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2 text-amber-800 text-sm"
      >
        <span>⚠️</span>
        <span><strong>Satellite water monitoring is simulated for demo purposes.</strong> No real satellite feed is connected yet — do not rely on this data for irrigation or contamination decisions.</span>
      </motion.div>

      {/* Main Status Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-900/5 mb-6 border border-emerald-50"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">{data.farmArea}</span>
            </div>
            <div className="text-3xl font-bold text-emerald-950">
              {data.soilMoisture}% <span className="text-lg text-emerald-600 font-medium">Moisture</span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
            <div className="text-emerald-600 text-xs font-bold uppercase mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Quality
            </div>
            <div className="text-emerald-900 font-semibold">{data.waterQuality}</div>
          </div>
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
            <div className="text-emerald-600 text-xs font-bold uppercase mb-1 flex items-center gap-1">
              <CloudRain className="w-3 h-3" /> Irrigation
            </div>
            <div className="text-emerald-900 font-semibold">{data.irrigationNeeds}</div>
          </div>
        </div>
      </motion.div>

      {/* Contaminant Risk Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-md shadow-emerald-900/5 border border-emerald-50"
      >
        <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Risk Analysis
        </h3>
        
        {data.status === 'safe' ? (
          <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl text-emerald-800">
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <p className="text-sm font-medium">Water sources indicate optimal safety levels. No contaminants detected in recent satellite multispectral analysis.</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl text-amber-800">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <p className="text-sm font-medium">Elevated risk detected. Please check local sensors or delay irrigation if possible.</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-between items-center text-xs text-emerald-600/70 font-medium">
          <span>Last Satellite Scan: {data.lastScan}</span>
          <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Live Sync</span>
        </div>
      </motion.div>
    </div>
  );
}
