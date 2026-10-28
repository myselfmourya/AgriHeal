import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Map,
  AlertTriangle,
  CloudRain,
  CheckCircle,
  Volume2,
  RefreshCw,
  Waves
} from 'lucide-react';
import { fetchFarmWeather } from '../services/openMeteoService';
import { getIrrigationRecommendation } from '../services/farmRiskRules';
import { useVoiceActions } from '../hooks/useVoiceActions';

export default function SatWaterMonitor({ onSpeak }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Your Farm');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const geo = await res.json();
          const city = geo.address?.state_district || geo.address?.city || geo.address?.town || 'Your Farm';
          setLocationName(city);
        } catch { /* keep default location label */ }

        try {
          const weather = await fetchFarmWeather(latitude, longitude);
          const irrigation = getIrrigationRecommendation({
            soilMoisturePercent: weather.soilMoisturePercent,
            rainNext48hMm: weather.rainNext48hMm,
          });
          setData({ weather, irrigation });
        } catch (err) {
          setError(err.message);
        }
        setLoading(false);
      },
      () => {
        setError('Location access is needed to fetch real soil moisture data.');
        setLoading(false);
      }
    );
  }, []);

  useVoiceActions([
    {
      id: 'water.readStatus',
      description: "Read the farm's current water/soil moisture status aloud",
      params: {},
      destructive: false,
      handler: () => {
        if (!data) throw new Error('Water status data is still loading.');
        return `Farm water status for ${locationName}. Soil moisture is at ${data.weather.soilMoisturePercent}%. ${data.irrigation.reasoning} Water quality data is not available — no water testing sensor is connected.`;
      },
    },
  ], [data, locationName]);

  const handleSpeakStatus = () => {
    if (!data || !onSpeak) return;
    const text = `Farm water status for ${locationName}. Soil moisture is at ${data.weather.soilMoisturePercent}%. ${data.irrigation.reasoning} Water quality data is not available — no water testing sensor is connected.`;
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
        <p className="text-emerald-800 font-medium">Reading live soil data...</p>
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
          <p className="text-emerald-700/70 text-sm">Real Soil Moisture & Irrigation Status</p>
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
        <span><strong>Water quality and contaminant testing are not available</strong> — no water-testing sensor is connected, and there's no free real-time source for it. Soil moisture below is real.</span>
      </motion.div>

      {error && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-sm text-slate-500">{error}</div>
      )}

      {data && (
      <>
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
              <span className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">{locationName}</span>
            </div>
            <div className="text-3xl font-bold text-emerald-950">
              {data.weather.soilMoisturePercent != null ? `${data.weather.soilMoisturePercent}%` : 'N/A'} <span className="text-lg text-emerald-600 font-medium">Moisture</span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
            <div className="text-emerald-600 text-xs font-bold uppercase mb-1 flex items-center gap-1">
              <Droplets className="w-3 h-3" /> Soil Temp
            </div>
            <div className="text-emerald-900 font-semibold">{data.weather.soilTemp != null ? `${data.weather.soilTemp}°C` : 'N/A'}</div>
          </div>
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
            <div className="text-emerald-600 text-xs font-bold uppercase mb-1 flex items-center gap-1">
              <CloudRain className="w-3 h-3" /> Irrigation
            </div>
            <div className="text-emerald-900 font-semibold">{data.irrigation.status}</div>
          </div>
        </div>
      </motion.div>

      {/* Irrigation Advice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-md shadow-emerald-900/5 border border-emerald-50"
      >
        <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Irrigation Advice
        </h3>

        {data.irrigation.needed ? (
          <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl text-amber-800">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <p className="text-sm font-medium">{data.irrigation.reasoning}</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl text-emerald-800">
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <p className="text-sm font-medium">{data.irrigation.reasoning}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-between items-center text-xs text-emerald-600/70 font-medium">
          <span>Open-Meteo, just now</span>
          <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Live</span>
        </div>
      </motion.div>
      </>
      )}
    </div>
  );
}
