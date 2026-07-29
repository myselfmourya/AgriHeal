import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, ThermometerSun, AlertTriangle, Info, Sprout } from 'lucide-react';

export default function ThermaPlan({ onSpeak }) {
  const [currentTemp] = useState(38); // Celsius
  const [humidity] = useState(65); // %
  const [heatIndex] = useState(42);

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
    if (heatIndex > 40 && onSpeak) {
       onSpeak("Warning: Extreme heat index detected. Please ensure farm workers take immediate shelter and crops are sufficiently irrigated.");
    }
  }, [heatIndex, onSpeak]);

  const handleActionClick = (msg) => {
    if (onSpeak) onSpeak(msg);
  };

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

        {/* Heat Index Alert Card */}
        <motion.div 
          variants={itemVariants}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
                <AlertTriangle size={16} /> Extreme Danger
              </div>
            </div>
            <ThermometerSun size={64} style={{ opacity: 0.8 }} />
          </div>
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
              <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-900)' }}>{currentTemp}°C</p>
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
              <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-900)' }}>{humidity}%</p>
            </div>
          </div>
        </motion.div>

        {/* Advisory Actions */}
        <motion.div variants={itemVariants}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-900)', marginBottom: '16px' }}>Recommended Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => handleActionClick("Schedule mandatory 15-minute hydration breaks for all workers in shaded areas.")}
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
                <p style={{ color: 'var(--text-500)', fontSize: '13px', marginTop: '4px', lineHeight: 1.4 }}>Mandatory 15-minute breaks every hour. Ensure cool water is accessible.</p>
              </div>
            </button>

            <button 
              onClick={() => handleActionClick("Initiate drip irrigation immediately to prevent crop heat stress.")}
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
                <p style={{ fontWeight: '600', color: 'var(--text-900)', fontSize: '15px' }}>Crop Care: Drip Irrigation</p>
                <p style={{ color: 'var(--text-500)', fontSize: '13px', marginTop: '4px', lineHeight: 1.4 }}>Increase watering cycles by 20% to prevent soil moisture depletion.</p>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
