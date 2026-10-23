import React from 'react';
import { Sprout, Globe, ShieldCheck, Activity } from 'lucide-react';

export default function Header({ selectedDialect, setSelectedDialect, activeTab, setActiveTab }) {
  const dialects = [
    { code: 'hi-IN', name: 'Hindi (हिंदी)' },
    { code: 'te-IN', name: 'Telugu (తెలుగు)' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)' },
    { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'mr-IN', name: 'Marathi (मराठी)' },
    { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'en-IN', name: 'English (India)' }
  ];

  return (
    <header className="header-card">
      <div className="brand-container">
        <div className="brand-logo-icon overflow-hidden bg-transparent p-0 flex items-center">
          <img src="/app-logo.jpg" alt="AgriHeal Logo" className="w-10 h-10 object-contain mix-blend-multiply" />
        </div>
        <div className="brand-title-group ml-2">
          <h1>AgriHeal</h1>
          <p>
            <ShieldCheck size={14} color="#10b981" /> Voice-Controlled Farm & Rural Health Engine
            <span className="tag-badge">100% Software • Zero Hardware</span>
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="dialect-selector-group">
          <Globe size={18} color="#22d3ee" />
          <select 
            className="dialect-select"
            value={selectedDialect}
            onChange={(e) => setSelectedDialect(e.target.value)}
          >
            {dialects.map((d) => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>

        <button 
          className={`btn-secondary ${activeTab === 'b2b' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'b2b' ? 'main' : 'b2b')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Activity size={16} color="#f59e0b" />
          {activeTab === 'b2b' ? 'Farmer View' : 'B2B & Health Ministry Portal'}
        </button>
      </div>
    </header>
  );
}
