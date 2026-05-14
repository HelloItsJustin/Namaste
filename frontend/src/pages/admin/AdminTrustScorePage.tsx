/**
 * NAMASTE — Admin TrustScore Page
 */
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

export default function AdminTrustScorePage() {
  const modelMetrics = [
    { label: 'Model Version', value: 'v2.4.1 (XGBoost)', icon: Cpu, color: '#A78BFA' },
    { label: 'Gini Coefficient', value: '0.64', icon: Activity, color: '#00FF9C' },
    { label: 'KS Statistic', value: '42.8', icon: Activity, color: '#F5C518' },
    { label: 'Default Rate', value: '2.1%', icon: AlertTriangle, color: '#FF4D6A' },
  ];

  const fairnessAudits = [
    { attribute: 'Gender (M/F/O)', bias: 0.002, status: 'Passed', threshold: 0.05 },
    { attribute: 'Region (Urban/Rural)', bias: 0.014, status: 'Passed', threshold: 0.05 },
    { attribute: 'State Origin', bias: 0.021, status: 'Passed', threshold: 0.05 },
    { attribute: 'Language Proxy', bias: 0.008, status: 'Passed', threshold: 0.05 },
  ];

  const featureImportance = [
    { name: 'Income Consistency (12m)', weight: 0.32 },
    { name: 'Job Completion Rate', weight: 0.24 },
    { name: 'Peer Vouch Score', weight: 0.18 },
    { name: 'Platform Tenure', weight: 0.15 },
    { name: 'Payment Punctuality', weight: 0.11 },
  ];

  return (
    <AppShell title="TrustScore AI Engine" subtitle="Model performance metrics and fairness audit dashboard">
      <div className="flex flex-col gap-6">

        {/* Top metrics */}
        <div className="admin-model-grid">
          {modelMetrics.map((m, i) => (
            <motion.div key={m.label} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <m.icon size={18} color={m.color} />
                </div>
                <div>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.4rem', color: '#fff' }}>{m.value}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 2 }}>{m.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="admin-score-grid">
          {/* Fairness Audit */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} color="#00FF9C" />
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Fairness Audit Results</p>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Model Certified</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Constraint: Score must not correlate with protected attributes. Maximum allowed bias threshold is 0.05.</p>
            
            <div className="flex flex-col gap-3 mt-2">
              {fairnessAudits.map((f, i) => (
                <div key={f.attribute}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.attribute}</span>
                    <span style={{ fontSize: '0.8rem', color: '#00FF9C', fontFamily: 'JetBrains Mono' }}>{f.bias} <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>(&lt;{f.threshold})</span></span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(108,99,255,0.1)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                    <motion.div style={{ height: '100%', background: '#00FF9C', borderRadius: 3 }} initial={{ width: 0 }} animate={{ width: `${(f.bias / f.threshold) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.8 }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '100%', width: 1, background: '#FF4D6A', zIndex: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Importance */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Activity size={18} color="#A78BFA" />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Global Feature Importance (SHAP)</p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Mean absolute SHAP value impact on TrustScore output.</p>
            
            <div className="flex flex-col gap-3 mt-2">
              {featureImportance.map((f, i) => (
                <div key={f.name} className="feature-importance-row">
                  <div className="feature-importance-header">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.name}</span>
                    <span className="score-weight-pill">{Math.round(f.weight * 100)}%</span>
                  </div>
                  <div style={{ height: 7, background: 'rgba(108,99,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #6C63FF, #A78BFA)', borderRadius: 4 }} initial={{ width: 0 }} animate={{ width: `${(f.weight / 0.4) * 100}%` }} transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Performance Trend */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} color="#00FF9C" />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Model Performance Trend</p>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>+2.3% (30d)</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
            {[
              { metric: 'AUC-ROC', value: '0.892', target: '0.85', trend: '+0.012' },
              { metric: 'Precision', value: '0.847', target: '0.80', trend: '+0.008' },
              { metric: 'Recall', value: '0.823', target: '0.75', trend: '-0.002' },
              { metric: 'F1-Score', value: '0.835', target: '0.80', trend: '+0.006' },
            ].map((m) => (
              <motion.div
                key={m.metric}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: 'rgba(108,99,255,0.06)',
                  border: '1px solid rgba(108,99,255,0.1)',
                  textAlign: 'center',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{m.metric}</p>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00FF9C', marginTop: 6 }}>{m.value}</p>
                <p style={{ fontSize: '0.65rem', color: '#A78BFA', marginTop: 4 }}>Target: {m.target}</p>
                <p style={{ fontSize: '0.65rem', color: '#F5C518', marginTop: 3 }}>{m.trend}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Model Audit History */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Recent Audit Events</p>
          
          <div className="flex flex-col gap-3">
            {[
              { event: 'Monthly Fairness Check', date: '2 hours ago', status: 'Passed', color: '#00FF9C' },
              { event: 'Performance Degradation Alert', date: '1 day ago', status: 'Resolved', color: '#A78BFA' },
              { event: 'Bias Threshold Review', date: '3 days ago', status: 'Certified', color: '#00FF9C' },
              { event: 'Feature Importance Update', date: '5 days ago', status: 'Applied', color: '#F5C518' },
            ].map((a, i) => (
              <motion.div
                key={a.event}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(108,99,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{a.event}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.date}</p>
                </div>
                <span className="badge" style={{ fontSize: '0.65rem', background: `${a.color}20`, color: a.color, borderColor: `${a.color}40` }}>
                  {a.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
