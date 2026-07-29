import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVani } from '../contexts/VaniContext'
import { useFarmer } from '../contexts/FarmerContext'

// Mock Data for Tabs
const MOCK_LIVESTOCK = [
  { id: 1, name: 'Ganga', species: 'Cow (Sahiwal)', age: '4 yrs', lastCheckup: '12 Oct 2025', vaxStatus: 'Up to Date', weight: [400, 410, 415, 420, 425, 430] },
  { id: 2, name: 'Raja', species: 'Bull (Murrah)', age: '3 yrs', lastCheckup: '05 Sep 2025', vaxStatus: 'Pending', weight: [500, 505, 505, 510, 520, 525] }
];

const MOCK_VITALS = [
  { id: 1, date: '2025-10-15', bp: '120/80', sugar: '105', hb: '13.5' },
  { id: 2, date: '2025-09-10', bp: '125/85', sugar: '110', hb: '13.2' },
  { id: 3, date: '2025-08-05', bp: '118/78', sugar: '98', hb: '13.0' }
];

const MOCK_FINANCIAL = [
  { id: 1, date: '2025-11-01', type: 'Income', amount: 45000, source: 'Wheat Sale', notes: 'Mandi sale' },
  { id: 2, date: '2025-10-20', type: 'Expense', amount: 5000, source: 'Fertilizer', notes: 'Urea bags' },
  { id: 3, date: '2025-10-15', type: 'Expense', amount: 1500, source: 'Health', notes: 'Doctor visit' },
  { id: 4, date: '2025-09-10', type: 'Income', amount: 12000, source: 'Milk Sale', notes: 'Dairy co-op' }
];

const MOCK_DOCS = [
  { id: 1, name: 'Aadhar Card', type: 'ID', date: '12 Jan 2020' },
  { id: 2, name: 'Land Record (Khasra)', type: 'Property', date: '05 Mar 2022' },
  { id: 3, name: 'Kisan Credit Card', type: 'Finance', date: '22 Aug 2021' },
  { id: 4, name: 'Soil Health Report', type: 'Agri', date: '10 Oct 2025' },
  { id: 5, name: 'Crop Insurance Policy', type: 'Insurance', date: '01 Jun 2025' }
];

const MOCK_REPORTS = [
  { id: 1, name: 'Rabi Season Summary 2025', date: '01 Nov 2025', size: '2.4 MB', type: 'Crop' },
  { id: 2, name: 'Annual Financial Statement', date: '31 Mar 2025', size: '1.1 MB', type: 'Finance' },
  { id: 3, name: 'Livestock Health Log', date: '15 Oct 2025', size: '800 KB', type: 'Livestock' },
  { id: 4, name: 'Personal Health Summary', date: '20 Oct 2025', size: '500 KB', type: 'Health' }
];

const MOCK_CROP_HISTORY = [
  { id: 1, date: '2025-08-15', crop: 'Cotton', disease: 'Bollworm', severity: 'High', treatment: 'Spinosad Spray', outcome: 'Recovered' },
  { id: 2, date: '2025-07-10', crop: 'Paddy', disease: 'Blast', severity: 'Medium', treatment: 'Tricyclazole', outcome: 'Improved' },
  { id: 3, date: '2024-11-20', crop: 'Wheat', disease: 'Rust', severity: 'Low', treatment: 'Propiconazole', outcome: 'Cured' }
];

export default function Records() {
  const { speak } = useVani();
  const farmerContext = useFarmer();
  const profile = farmerContext?.profile || {};
  const cropHistory = farmerContext?.cropHistory?.length > 0 ? farmerContext.cropHistory : MOCK_CROP_HISTORY;
  
  const [activeTab, setActiveTab] = useState('Crop');
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = ['Crop', 'Livestock', 'Health', 'Financial', 'Documents', 'Reports'];

  const handleExport = () => {
    speak('Exporting records to CSV format.');
    // Mock export
  };

  const handleBackup = () => {
    speak('Backing up records securely to the cloud.');
    // Mock backup
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Crop':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">🌾 Crop History</h3>
              <div>
                <button className="btn-secondary" style={{ marginRight: '0.5rem' }}>+ Add Entry</button>
                <button className="btn-ghost">Download PDF</button>
              </div>
            </div>
            
            <input 
              type="text" 
              placeholder="Search by crop or date..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1rem', background: 'var(--surface)', color: 'var(--text-900)' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cropHistory.filter(c => c.crop.toLowerCase().includes(searchQuery.toLowerCase()) || c.date.includes(searchQuery)).map(entry => (
                <div key={entry.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text-900)' }}>{entry.crop} - {entry.date}</h4>
                    <p style={{ margin: 0, color: 'var(--text-500)', fontSize: '0.9rem' }}>
                      Disease: <strong>{entry.disease}</strong> | Treatment: {entry.treatment}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--text-700)', fontSize: '0.85rem' }}>Outcome: {entry.outcome}</p>
                  </div>
                  <span className={`badge ${entry.severity === 'High' ? 'badge-red' : entry.severity === 'Medium' ? 'badge-amber' : 'badge-green'}`}>
                    {entry.severity} Severity
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'Livestock':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">🐄 Livestock Management</h3>
              <button className="btn-primary">+ Add Animal</button>
            </div>
            
            <div className="quick-actions-grid">
              {MOCK_LIVESTOCK.map(animal => (
                <div key={animal.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-900)' }}>{animal.name}</h4>
                    <span className={`badge ${animal.vaxStatus === 'Pending' ? 'badge-amber' : 'badge-green'}`}>
                      {animal.vaxStatus}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.2rem', color: 'var(--text-500)', fontSize: '0.9rem' }}>Species: {animal.species}</p>
                  <p style={{ margin: '0 0 0.2rem', color: 'var(--text-500)', fontSize: '0.9rem' }}>Age: {animal.age}</p>
                  <p style={{ margin: '0 0 1rem', color: 'var(--text-500)', fontSize: '0.9rem' }}>Last Checkup: {animal.lastCheckup}</p>
                  
                  <div style={{ padding: '0.5rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-700)', fontWeight: 600 }}>Weight Growth (Last 6 months)</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '40px', gap: '4px' }}>
                      {animal.weight.map((w, i) => (
                        <div key={i} style={{ flex: 1, background: 'var(--brand-green)', height: `${(w / Math.max(...animal.weight)) * 100}%`, borderRadius: '2px 2px 0 0' }} title={`${w} kg`} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'Health':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">🏥 Personal Health Records</h3>
              <button className="btn-secondary">Upload Document</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Date</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Blood Pressure</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Sugar (mg/dL)</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Hemoglobin (g/dL)</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_VITALS.map(vital => (
                    <tr key={vital.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-900)' }}>{vital.date}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-700)' }}>{vital.bp}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-700)' }}>{vital.sugar}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-700)' }}>{vital.hb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div className="card" style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem' }}>Current Medications</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-700)' }}>• Metformin (500mg) - 1x Daily</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-700)' }}>• Amlodipine (5mg) - 1x Daily</p>
              </div>
              <div className="card" style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem' }}>Insurance</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-700)' }}>Provider: Ayushman Bharat</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-700)' }}>Status: Active (till 2026)</p>
              </div>
            </div>
          </motion.div>
        );

      case 'Financial':
        const totalIncome = MOCK_FINANCIAL.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = MOCK_FINANCIAL.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
        
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">💰 Financial Tracker</h3>
              <div>
                <button className="btn-secondary" style={{ marginRight: '0.5rem' }}>Profit Calculator</button>
                <button className="btn-primary">+ Add Transaction</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-card" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--brand-green)' }}>
                <p style={{ margin: '0 0 0.5rem', color: 'var(--text-500)' }}>Total Income</p>
                <h2 style={{ margin: 0, color: 'var(--brand-green)' }}>₹{totalIncome.toLocaleString()}</h2>
              </div>
              <div className="stat-card" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--brand-blue)' }}>
                <p style={{ margin: '0 0 0.5rem', color: 'var(--text-500)' }}>Total Expense</p>
                <h2 style={{ margin: 0, color: '#f43f5e' }}>₹{totalExpense.toLocaleString()}</h2>
              </div>
              <div className="stat-card" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 0.5rem', color: 'var(--text-500)' }}>Net Balance</p>
                <h2 style={{ margin: 0, color: 'var(--text-900)' }}>₹{(totalIncome - totalExpense).toLocaleString()}</h2>
              </div>
            </div>

            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Date</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Source</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Notes</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Amount</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_FINANCIAL.map(txn => (
                  <tr key={txn.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-900)' }}>{txn.date}</td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-900)' }}>{txn.source}</td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-500)' }}>{txn.notes}</td>
                    <td style={{ padding: '1rem 0.5rem', color: txn.type === 'Income' ? 'var(--brand-green)' : '#f43f5e', fontWeight: 600 }}>
                      {txn.type === 'Income' ? '+' : '-'}₹{txn.amount}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span className={`badge ${txn.type === 'Income' ? 'badge-green' : 'badge-red'}`}>{txn.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        );

      case 'Documents':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">📋 Document Vault</h3>
              <label className="btn-primary" style={{ cursor: 'pointer' }}>
                + Upload Document
                <input type="file" style={{ display: 'none' }} />
              </label>
            </div>
            
            <div className="quick-actions-grid">
              {MOCK_DOCS.map(doc => (
                <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-900)' }}>{doc.name}</h4>
                      <span className="badge badge-gray">{doc.type}</span>
                    </div>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-500)' }}>Added: {doc.date}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>Preview</button>
                    <button className="btn-ghost" style={{ flex: 1, padding: '0.5rem' }}>Download</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'Reports':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">📊 Analytics & Reports</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button className="btn-secondary">Generate Crop Season Summary</button>
              <button className="btn-secondary">Generate Annual Financial</button>
              <button className="btn-secondary">Generate Health Summary</button>
              <button className="btn-secondary">Generate Livestock Health</button>
            </div>

            <h4 style={{ color: 'var(--text-900)', marginBottom: '1rem' }}>Recent Reports</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {MOCK_REPORTS.map(report => (
                <div key={report.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text-900)' }}>{report.name}</h4>
                    <p style={{ margin: 0, color: 'var(--text-500)', fontSize: '0.85rem' }}>
                      {report.date} • {report.size} • <span style={{ color: 'var(--brand-blue)' }}>{report.type}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-ghost" 
                      style={{ padding: '0.5rem 1rem' }}
                      onClick={() => speak(`Reading summary for ${report.name}. This report shows overall healthy progress.`)}
                    >
                      🔊 Read Summary
                    </button>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Download</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: 'var(--text-900)', fontSize: '2rem' }}>📁 Farm Records</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-ghost" onClick={handleExport}>Export CSV</button>
          <button className="btn-primary" onClick={handleBackup}>Backup to Cloud</button>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="tab-bar" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1.5rem',
              background: activeTab === tab ? 'var(--brand-green)' : 'transparent',
              color: activeTab === tab ? 'var(--white)' : 'var(--text-700)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 600 : 400,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'Crop' ? '🌾 ' : tab === 'Livestock' ? '🐄 ' : tab === 'Health' ? '🏥 ' : tab === 'Financial' ? '💰 ' : tab === 'Documents' ? '📋 ' : '📊 '}{tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
