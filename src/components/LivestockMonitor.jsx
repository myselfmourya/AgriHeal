import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Droplets, HeartPulse, AlertTriangle, CheckCircle2, Volume2, Sprout } from 'lucide-react';

export default function LivestockMonitor({ onSpeak }) {
  const [activeTab, setActiveTab] = useState('cattle');

  const livestockData = {
    cattle: {
      total: 142,
      healthy: 138,
      attention: 4,
      avgTemp: '38.6°C',
      avgHeartRate: '65 bpm',
      hydration: '88%',
      alerts: [
        { id: 1, type: 'warning', text: 'Cow #42 in Sector 3 is showing mild heat stress. Hydration levels dropping.', action: 'Deploy misting system' },
        { id: 2, type: 'info', text: 'Herd movement optimal. Grazing patterns normal in North Pasture.', action: 'Log report' }
      ]
    },
    poultry: {
      total: 2500,
      healthy: 2485,
      attention: 15,
      avgTemp: '40.5°C',
      avgHeartRate: '250 bpm',
      hydration: '92%',
      alerts: [
        { id: 3, type: 'warning', text: 'Coop Alpha humidity is 5% above optimal range. Slight respiratory risk.', action: 'Increase ventilation' }
      ]
    }
  };

  const currentData = livestockData[activeTab];

  const handleSpeak = (text) => {
    if (onSpeak) {
      onSpeak(text);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, opacity: 1, 
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="page-body" style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '1.5rem', paddingBottom: '6rem', fontFamily: 'system-ui, sans-serif' }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* Header Section */}
        <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#064e3b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout size={28} color="#059669" />
              AgriHeal Monitor
            </h1>
            <p style={{ color: '#854d0e', fontSize: '0.95rem', fontWeight: '500' }}>Livestock health & environmental tracking</p>
          </div>
        </motion.div>

        {/* Tab Selection */}
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <button 
            onClick={() => setActiveTab('cattle')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              border: '1px solid',
              borderColor: activeTab === 'cattle' ? '#059669' : '#e5e7eb',
              backgroundColor: activeTab === 'cattle' ? '#059669' : '#ffffff',
              color: activeTab === 'cattle' ? '#ffffff' : '#4b5563',
              boxShadow: activeTab === 'cattle' ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            Cattle Herd
          </button>
          <button 
            onClick={() => setActiveTab('poultry')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              border: '1px solid',
              borderColor: activeTab === 'poultry' ? '#059669' : '#e5e7eb',
              backgroundColor: activeTab === 'poultry' ? '#059669' : '#ffffff',
              color: activeTab === 'poultry' ? '#ffffff' : '#4b5563',
              boxShadow: activeTab === 'poultry' ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            Poultry Flock
          </button>
        </motion.div>

        {/* Overview Cards */}
        <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <motion.div variants={itemVariants} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f0fdf4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={20} color="#10b981" />
              <span style={{ fontSize: '0.95rem', color: '#064e3b', fontWeight: '600' }}>Healthy</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#064e3b' }}>{currentData.healthy}</div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>out of {currentData.total}</div>
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #fffbeb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={20} color="#d97706" />
              <span style={{ fontSize: '0.95rem', color: '#92400e', fontWeight: '600' }}>Needs Attention</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#92400e' }}>{currentData.attention}</div>
            <div style={{ fontSize: '0.8rem', color: '#d97706', marginTop: '0.25rem' }}>Requires review</div>
          </motion.div>
        </motion.div>

        {/* Vitals Section */}
        <motion.div variants={itemVariants} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#064e3b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#059669" />
            Average Herd Vitals
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#fef3c7', padding: '0.6rem', borderRadius: '12px' }}>
                  <Thermometer size={22} color="#d97706" />
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: '500' }}>Body Temp</div>
                  <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.1rem' }}>{currentData.avgTemp}</div>
                </div>
              </div>
            </div>
            
            <div style={{ height: '1px', backgroundColor: '#f3f4f6', width: '100%' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#fee2e2', padding: '0.6rem', borderRadius: '12px' }}>
                  <HeartPulse size={22} color="#ef4444" />
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: '500' }}>Resting Heart Rate</div>
                  <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.1rem' }}>{currentData.avgHeartRate}</div>
                </div>
              </div>
            </div>
            
            <div style={{ height: '1px', backgroundColor: '#f3f4f6', width: '100%' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#dcfce7', padding: '0.6rem', borderRadius: '12px' }}>
                  <Droplets size={22} color="#059669" />
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: '500' }}>Hydration Index</div>
                  <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.1rem' }}>{currentData.hydration}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Actionable Insights */}
        <motion.div variants={itemVariants}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#064e3b' }}>AI Agronomist Insights</h3>
            <span style={{ backgroundColor: '#059669', color: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentData.alerts.map((alert) => (
              <motion.div 
                key={alert.id} 
                whileHover={{ scale: 1.01 }}
                style={{ 
                  backgroundColor: alert.type === 'warning' ? '#fffbeb' : '#f0fdf4', 
                  border: '1px solid',
                  borderColor: alert.type === 'warning' ? '#fde68a' : '#bbf7d0',
                  borderLeft: `4px solid ${alert.type === 'warning' ? '#f59e0b' : '#10b981'}`, 
                  borderRadius: '16px', 
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {alert.type === 'warning' ? <AlertTriangle size={16} color="#d97706" /> : <CheckCircle2 size={16} color="#059669" />}
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: alert.type === 'warning' ? '#d97706' : '#059669', textTransform: 'uppercase' }}>
                      {alert.type === 'warning' ? 'Alert' : 'Status'}
                    </span>
                  </div>
                  <p style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.95rem', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                    {alert.text}
                  </p>
                  <button style={{ 
                    backgroundColor: alert.type === 'warning' ? '#fef3c7' : '#dcfce7', 
                    border: 'none', 
                    color: alert.type === 'warning' ? '#92400e' : '#166534', 
                    fontWeight: '700', 
                    fontSize: '0.85rem', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '8px',
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    cursor: 'pointer' 
                  }}>
                    <Activity size={14} /> {alert.action}
                  </button>
                </div>
                <button 
                  onClick={() => handleSpeak(alert.text)}
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    padding: '0.75rem', 
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    flexShrink: 0
                  }}
                  title="Read aloud"
                >
                  <Volume2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
