import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, ThermometerSun, AlertTriangle, Info, Sprout, Loader2 } from 'lucide-react';
import { fetchFarmWeather } from '../services/openMeteoService';
import { computeHeatIndexC, getHeatIndexCategory } from '../services/farmRiskRules';

export default function ThermaPlan({ onSpeak }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const w = await fetchFarmWeather(position.coords.latitude, position.coords.longitude);
          setWeather(w);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access is needed to compute a real heat index for your farm.');
        setLoading(false);
      }
    );
  }, []);

  const heatIndex = weather ? computeHeatIndexC(weather.temp, weather.humidity) : null;
  const category = heatIndex != null ? getHeatIndexCategory(heatIndex) : null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    if (category && (category.level === 'Danger' || category.level === 'Extreme Danger') && onSpeak) {
      onSpeak(`Warning: ${category.level.toLowerCase()} heat index detected. Please ensure farm workers take immediate shelter and crops are sufficiently irrigated.`);
    }
  }, [category, onSpeak]);

  const handleActionClick = (msg) => {
    if (onSpeak) onSpeak(msg);
  };

  const dangerColors = {
    'Safe': { bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
    'Caution': { bg: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)' },
    'Extreme Caution': { bg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' },
    'Danger': { bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' },
    'Extreme Danger': { bg: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)' },
  };
  const cardBg = category ? dangerColors[category.level].bg : 'linear-gradient(135deg, #64748b 0%, #475569 100%)';

  return (
    <div className="page-body" style={{ padding: '20px', backgroundColor: 'var(--bg, #f8f9fc)', minHeight: '100vh', paddingBottom: '80px' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--brand-emerald, #059669)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={28} /> ThermaPlan
          </h1>
          <p style={{ color: 'var(--text-500, #475569)', fontSize: '14px', marginTop: '4px' }}>
            Agri-Thermal Monitoring & Worker Safety
          </p>
        </motion.div>

        {loading ? (
          <motion.div variants={itemVariants} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-500)' }}>
            <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 8px' }} />
            Fetching live weather for your location...
          </motion.div>
        ) : error ? (
          <motion.div variants={itemVariants} style={{ padding: '20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', color: '#991b1b', fontSize: '14px', marginBottom: '24px' }}>
            <AlertTriangle size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Couldn't load a real heat index: {error}
          </motion.div>
        ) : (
          <>
            {/* Heat Index Alert Card */}
            <motion.div
              variants={itemVariants}
              style={{
                background: cardBg,
                borderRadius: 'var(--radius-xl, 18px)',
                padding: '24px',
                color: 'white',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-lg)'
              }}
              className="promo-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '14px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Heat Index</p>
                  <h2 style={{ fontSize: '48px', fontWeight: '800', margin: '8px 0', lineHeight: 1 }}>
                    {heatIndex}°<span style={{ fontSize: '24px' }}>C</span>
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', width: 'fit-content' }}>
                    <AlertTriangle size={16} /> {category.level}
                  </div>
                </div>
                <ThermometerSun size={64} style={{ opacity: 0.8 }} />
              </div>
              <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '12px', lineHeight: 1.4 }}>{category.advice}</p>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
              variants={itemVariants}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}
            >
              <div style={{
                backgroundColor: 'var(--surface, #f1f5f9)',
                borderRadius: 'var(--radius-lg, 14px)',
                padding: '16px',
                border: '1px solid var(--border, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: 'var(--radius-md)', color: '#b45309' }}>
                  <Sun size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-500)' }}>Temperature</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-900)' }}>{weather.temp}°C</p>
                </div>
              </div>
              <div style={{
                backgroundColor: 'var(--surface, #f1f5f9)',
                borderRadius: 'var(--radius-lg, 14px)',
                padding: '16px',
                border: '1px solid var(--border, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: 'var(--radius-md)', color: '#0369a1' }}>
                  <CloudRain size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-500)' }}>Humidity</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-900)' }}>{weather.humidity}%</p>
                </div>
              </div>
            </motion.div>

            {/* Advisory Actions */}
            <motion.div variants={itemVariants}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-900)', marginBottom: '16px' }}>Recommended Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleActionClick(
                    category.level === 'Danger' || category.level === 'Extreme Danger'
                      ? "Schedule mandatory 15-minute hydration breaks for all workers in shaded areas."
                      : "Conditions are manageable, but keep drinking water accessible for anyone working outdoors."
                  )}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                    padding: '16px', backgroundColor: 'var(--white, #fff)',
                    borderRadius: 'var(--radius-lg, 14px)',
                    border: '1px solid var(--border, #e2e8f0)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'left', cursor: 'pointer', width: '100%'
                  }}
                >
                  <div style={{ color: 'var(--brand-emerald, #059669)', marginTop: '2px' }}><Info size={20} /></div>
                  <div>
                    <p style={{ fontWeight: '600', color: 'var(--text-900)', fontSize: '15px' }}>Worker Safety: Hydration breaks</p>
                    <p style={{ color: 'var(--text-500)', fontSize: '13px', marginTop: '4px', lineHeight: 1.4 }}>
                      {category.level === 'Danger' || category.level === 'Extreme Danger'
                        ? 'Mandatory 15-minute breaks every hour. Ensure cool water is accessible.'
                        : 'Keep water accessible and watch for signs of fatigue during long outdoor work.'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleActionClick(
                    weather.soilMoisturePercent != null && weather.soilMoisturePercent < 40
                      ? "Soil moisture is low in this heat — consider irrigating soon to prevent crop heat stress."
                      : "Soil moisture looks adequate for now — monitor and irrigate if it drops further."
                  )}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                    padding: '16px', backgroundColor: 'var(--white, #fff)',
                    borderRadius: 'var(--radius-lg, 14px)',
                    border: '1px solid var(--border, #e2e8f0)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'left', cursor: 'pointer', width: '100%'
                  }}
                >
                  <div style={{ color: '#b45309', marginTop: '2px' }}><Sprout size={20} /></div>
                  <div>
                    <p style={{ fontWeight: '600', color: 'var(--text-900)', fontSize: '15px' }}>Crop Care: Irrigation check</p>
                    <p style={{ color: 'var(--text-500)', fontSize: '13px', marginTop: '4px', lineHeight: 1.4 }}>
                      {weather.soilMoisturePercent != null
                        ? `Current soil moisture is ${weather.soilMoisturePercent}%. ${weather.soilMoisturePercent < 40 ? 'Consider irrigating to offset heat stress.' : 'Should be enough for now — recheck as the day heats up.'}`
                        : 'Soil moisture data is unavailable for this location.'}
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
