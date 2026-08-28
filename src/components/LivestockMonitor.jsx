import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Droplets, HeartPulse, AlertTriangle, CheckCircle2, Volume2, Sprout, ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useFarmer } from '../contexts/FarmerContext';
import { useNavigate } from 'react-router-dom';
import AddLivestockModal from './AddLivestockModal';

export default function LivestockMonitor({ onSpeak }) {
  const [activeTab, setActiveTab] = useState('All');
  const [livestockList, setLivestockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useFarmer();
  const navigate = useNavigate();

  const fetchLivestock = async () => {
    setLoading(true);
    try {
      if (!profile?.id) {
        setLivestockList([]);
        return;
      }

      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .eq('farmer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLivestockList(data || []);
      
      // If there's data and current tab is All, maybe keep it All.
    } catch (err) {
      console.error("Error fetching livestock:", err);
      setLivestockList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivestock();
  }, [profile?.id]);

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

  // Derive tabs from data
  const speciesSet = new Set(livestockList.map(item => item.species));
  const tabs = ['All', ...Array.from(speciesSet)];

  // Filter data based on active tab
  const filteredList = activeTab === 'All' 
    ? livestockList 
    : livestockList.filter(item => item.species === activeTab);

  // Compute aggregates for the active view
  const totalHeadCount = filteredList.reduce((sum, item) => sum + (item.head_count || 0), 0);
  const healthyCount = filteredList.filter(item => item.health_status === 'Healthy').reduce((sum, item) => sum + (item.head_count || 0), 0);
  const attentionCount = totalHeadCount - healthyCount;
  
  const avgTempRaw = filteredList.reduce((sum, item) => sum + (item.average_temp || 0), 0) / (filteredList.length || 1);
  const avgTemp = filteredList.length ? `${avgTempRaw.toFixed(1)}°C` : '--°C';

  // Generate some AI alerts based on data
  const alerts = [];
  filteredList.forEach(item => {
    if (item.health_status === 'Sick') {
      alerts.push({ id: item.id + '-sick', type: 'warning', text: `Action needed for ${item.breed} (${item.species}). Marked as sick.`, action: 'Contact Vet' });
    } else if (item.health_status === 'Attention Required') {
      alerts.push({ id: item.id + '-attn', type: 'warning', text: `${item.breed} (${item.species}) requires attention. Monitor closely.`, action: 'Review' });
    } else if (item.average_temp > 39.5) {
      alerts.push({ id: item.id + '-temp', type: 'warning', text: `High temperature (${item.average_temp}°C) detected in ${item.breed} (${item.species}).`, action: 'Check' });
    }
  });

  if (alerts.length === 0 && filteredList.length > 0) {
    alerts.push({ id: 'all-good', type: 'info', text: 'All tracked livestock are within healthy parameters. No immediate action required.', action: 'Log Report' });
  }

  return (
    <div className="page-body" style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '1.5rem', paddingBottom: '6rem', fontFamily: 'system-ui, sans-serif' }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* Header Section */}
        <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-green-50 transition-colors border border-gray-100">
                <ArrowLeft className="w-5 h-5 text-green-700" />
              </button>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Sprout size={28} color="#059669" />
                AgriHeal Monitor
              </h1>
            </div>
            <p style={{ color: '#854d0e', fontSize: '0.95rem', fontWeight: '500', marginLeft: '3rem' }}>Livestock health & environmental tracking</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm text-sm"
          >
            <Plus size={18} /> Add
          </button>
        </motion.div>

        {/* Tab Selection */}
        {tabs.length > 1 && (
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: '1px solid',
                  borderColor: activeTab === tab ? '#059669' : '#e5e7eb',
                  backgroundColor: activeTab === tab ? '#059669' : '#ffffff',
                  color: activeTab === tab ? '#ffffff' : '#4b5563',
                  boxShadow: activeTab === tab ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab === 'All' ? 'All Livestock' : tab}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#059669', fontWeight: 'bold' }}>Loading...</div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
             <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Sprout className="w-8 h-8 text-green-600" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">No Livestock Records</h3>
             <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">Add your livestock to monitor their health, temperature, and receive AI-driven insights.</p>
             <button 
               onClick={() => setIsAddModalOpen(true)}
               className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm inline-flex items-center gap-2"
             >
               <Plus size={20} /> Add Livestock
             </button>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <motion.div variants={itemVariants} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f0fdf4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={20} color="#10b981" />
                  <span style={{ fontSize: '0.95rem', color: '#064e3b', fontWeight: '600' }}>Healthy</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#064e3b' }}>{healthyCount}</div>
                <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>out of {totalHeadCount}</div>
              </motion.div>
              
              <motion.div variants={itemVariants} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #fffbeb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={20} color="#d97706" />
                  <span style={{ fontSize: '0.95rem', color: '#92400e', fontWeight: '600' }}>Needs Attention</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#92400e' }}>{attentionCount}</div>
                <div style={{ fontSize: '0.8rem', color: '#d97706', marginTop: '0.25rem' }}>Requires review</div>
              </motion.div>
            </motion.div>

            {/* Vitals Section */}
            <motion.div variants={itemVariants} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#064e3b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} color="#059669" />
                Average Vitals
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#fef3c7', padding: '0.6rem', borderRadius: '12px' }}>
                      <Thermometer size={22} color="#d97706" />
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: '500' }}>Body Temp</div>
                      <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.1rem' }}>{avgTemp}</div>
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
                {alerts.map((alert) => (
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
          </>
        )}
      </motion.div>
      <AddLivestockModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => fetchLivestock()} 
      />
    </div>
  );
}
