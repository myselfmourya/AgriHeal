import React from 'react';
import { Activity, Building2, ShieldCheck, Users, Globe2, FileText } from 'lucide-react';

export default function B2BDashboard() {
  return (
    <div className="module-grid col-12">
      {/* Enterprise Overview Banner */}
      <div className="glass-card col-12" style={{ background: 'linear-gradient(135deg, #ffffff 40%, var(--primary-mint-bg))', border: '1px solid var(--border-green-hover)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <Building2 size={18} /> Enterprise & Public Health Analytics Portal
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-dark)', margin: '4px 0' }}>
              AgriHeal Data Engine for Co-ops, Ministries & Insurers
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Anonymized regional public health metrics, ESG compliance logs, supply chain traceability, and insurance risk reduction dashboard.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '0.85rem 1.3rem', borderRadius: '14px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Farmer Nodes</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-green)' }}>142,850</div>
            </div>
            <div style={{ background: '#ffffff', padding: '0.85rem 1.3rem', borderRadius: '14px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pesticide Illness Reduced</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-gold)' }}>-74.2%</div>
            </div>
            <div style={{ background: '#ffffff', padding: '0.85rem 1.3rem', borderRadius: '14px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Insurance Claims Saved</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>₹14.2 Cr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Application 1: Public Health Ministries */}
      <div className="glass-card col-6">
        <h3 style={{ color: 'var(--primary-green-dark)', fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe2 size={18} color="var(--primary-green)" /> 1. Public Health & Government Ministries
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>
          Real-time heatwave impact telemetry, well-water nitrate contamination heatmaps, and regional malnutrition deficiency maps.
        </p>

        <div style={{ background: 'var(--bg-card-subtle)', padding: '1.1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Water Well Contamination Clusters:</span>
            <strong style={{ color: 'var(--accent-rose)' }}>14 Hotspots Flagged</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Iron Anemia Mitigation Coverage:</span>
            <strong style={{ color: 'var(--primary-green)' }}>88% Village Matching</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Heatstroke Pre-Alerts Dispatched:</span>
            <strong style={{ color: 'var(--accent-gold)' }}>34,200 Voice Broadcasts</strong>
          </div>
        </div>
      </div>

      {/* Industry Application 2: Agro-Chemical Corporations */}
      <div className="glass-card col-6">
        <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--accent-gold)" /> 2. Agro-Chemical Corporate ESG Auditing
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>
          Verify that licensed fertilizers and pesticides are applied safely without over-exposure, hitting corporate environmental & social safety goals.
        </p>

        <div style={{ background: 'var(--bg-card-subtle)', padding: '1.1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Safe Spray Protocol Compliance Rate:</span>
            <strong style={{ color: 'var(--primary-green)' }}>94.6% Verified</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>PPE Mask Adoption Enforcement:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>82.1% Active</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Chemical Runoff Buffer Margin:</span>
            <strong style={{ color: 'var(--accent-gold)' }}>150 meters from wells</strong>
          </div>
        </div>
      </div>

      {/* Industry Application 3: Rural Micro-Insurance */}
      <div className="glass-card col-6">
        <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent-cyan)" /> 3. Rural InsurTech & Bank Risk Telemetry
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>
          Direct API connection to ToxiGuard & ThermaPlan activity logs. Farmers following app safety rules receive 25% lower health insurance premiums.
        </p>
        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          <FileText size={16} /> Export InsurTech Actuarial Report
        </button>
      </div>

      {/* Industry Application 4: Corporate Food Supply Chains */}
      <div className="glass-card col-6">
        <h3 style={{ color: 'var(--accent-purple)', fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} color="var(--accent-purple)" /> 4. Corporate Food Supply Chain Procurement
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>
          Food processors and organic retailers locate and purchase high-nutrient, low-chemical crops directly from verified safe farm clusters.
        </p>
        <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
          🌾 Sourcing Safe Biofortified Crop Clusters
        </button>
      </div>
    </div>
  );
}
