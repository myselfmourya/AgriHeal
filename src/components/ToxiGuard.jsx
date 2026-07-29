import React, { useState } from 'react';
import { Shield, AlertTriangle, ScanLine, Leaf, Droplets, Wind, PhoneCall, Info, Camera, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToxiGuard({ onSpeak }) {
  const [activeTab, setActiveTab] = useState('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = () => {
    setIsScanning(true);
    if (onSpeak) onSpeak("Scanning pesticide label. Please hold the camera steady.");
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: "Chlorpyrifos 50% EC",
        toxicity: "High (Class II)",
        activeIngredient: "Chlorpyrifos",
        recommendations: [
          "Wear full PPE: gloves, mask, and goggles.",
          "Do not spray on windy days.",
          "Keep away from water sources."
        ]
      });
      if (onSpeak) onSpeak("Scan complete. High toxicity pesticide detected. Please review safety guidelines immediately.");
    }, 3000);
  };

  const handleEmergency = () => {
    if (onSpeak) onSpeak("Calling agricultural emergency helpline.");
  };

  return (
    <div className="page-body" style={{ backgroundColor: '#f0fdf4', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ padding: '20px', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', borderRadius: '0 0 24px 24px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={28} /> ToxiGuard
            </h1>
            <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>Pesticide Safety & Analysis</p>
          </div>
          <button 
            onClick={handleEmergency}
            style={{ background: '#dc2626', border: 'none', padding: '10px 16px', borderRadius: '999px', color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)' }}
          >
            <PhoneCall size={18} /> SOS
          </button>
        </div>
      </motion.div>

      <div style={{ padding: '20px' }}>
        {/* Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', background: 'white', borderRadius: '16px', padding: '4px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          {['scan', 'safety', 'guidelines'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: activeTab === tab ? '#dcfce7' : 'transparent',
                color: activeTab === tab ? '#166534' : '#64748b',
                borderRadius: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ background: 'white', borderRadius: '24px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                {!scanResult ? (
                  <>
                    <div 
                      style={{ width: '100%', maxWidth: '240px', height: '240px', margin: '0 auto 24px', borderRadius: '24px', background: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}
                    >
                      {isScanning ? (
                        <motion.div 
                          animate={{ y: [-120, 120] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          style={{ position: 'absolute', width: '100%', height: '4px', background: '#059669', boxShadow: '0 0 16px #059669' }}
                        />
                      ) : null}
                      <Camera size={48} color="#94a3b8" />
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Position label in frame</span>
                    </div>
                    <button
                      onClick={handleScan}
                      disabled={isScanning}
                      style={{ background: '#059669', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '16px', fontWeight: '600', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isScanning ? 'not-allowed' : 'pointer', opacity: isScanning ? 0.7 : 1, boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}
                    >
                      <ScanLine size={20} />
                      {isScanning ? 'Analyzing Label...' : 'Scan Pesticide Label'}
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '12px' }}>
                        <AlertTriangle size={24} color="#dc2626" />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>{scanResult.name}</h3>
                        <p style={{ margin: '4px 0 0', color: '#dc2626', fontWeight: '600', fontSize: '14px' }}>{scanResult.toxicity}</p>
                      </div>
                    </div>
                    
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                      <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px' }}>Active Ingredient</p>
                      <p style={{ margin: 0, color: '#0f172a', fontWeight: '600' }}>{scanResult.activeIngredient}</p>
                    </div>

                    <h4 style={{ margin: '0 0 12px', color: '#0f172a', fontSize: '16px' }}>Safety Recommendations</h4>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {scanResult.recommendations.map((rec, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <CheckCircle size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>{rec}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setScanResult(null)}
                      style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '14px', borderRadius: '12px', width: '100%', marginTop: '24px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      Scan Another Product
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'safety' && (
            <motion.div
              key="safety"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { icon: Shield, title: 'PPE Gear', color: '#059669', bg: '#dcfce7', desc: 'Masks & Gloves' },
                  { icon: Wind, title: 'Weather', color: '#d97706', bg: '#fef3c7', desc: 'Wind conditions' },
                  { icon: Droplets, title: 'Storage', color: '#0284c7', bg: '#e0f2fe', desc: 'Cool, dry places' },
                  { icon: Leaf, title: 'Disposal', color: '#16a34a', bg: '#dcfce7', desc: 'Safe containers' },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <div style={{ background: item.bg, width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <item.icon size={24} color={item.color} />
                    </div>
                    <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '16px', fontWeight: '600' }}>{item.title}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px', lineHeight: '1.4' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'guidelines' && (
            <motion.div
              key="guidelines"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {[
                { title: 'Emergency First Aid Protocols', icon: Info, urgency: 'High', color: '#dc2626', bg: '#fee2e2' },
                { title: 'Safe Mixing & Dilution Guide', icon: Droplets, urgency: 'Medium', color: '#d97706', bg: '#fef3c7' },
                { title: 'Equipment Cleaning & Care', icon: Shield, urgency: 'Low', color: '#059669', bg: '#dcfce7' }
              ].map((guide, idx) => (
                <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                      <guide.icon size={24} color="#475569" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '15px', fontWeight: '600' }}>{guide.title}</h4>
                      <span style={{ fontSize: '12px', color: guide.color, background: guide.bg, padding: '4px 10px', borderRadius: '999px', fontWeight: '600' }}>
                        {guide.urgency} Priority
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} color="#cbd5e1" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
