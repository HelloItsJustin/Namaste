/**
 * NAMASTE — Lender Dashboard
 * Overview of verifications done, loans pre-approved, analytics
 */
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, Building2, Activity, CheckCircle } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_LENDER_STATS } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function LenderDashboard() {
  const navigate = useNavigate();
  const stats = MOCK_LENDER_STATS;

  return (
    <AppShell title="Lender Portal" subtitle="NBFC & Microfinance Verification Dashboard">
      <div className="flex flex-col gap-6">

        {/* Stats */}
        <div className="stats-grid-4">
          {[
            { label: 'Total Verifications', value: stats.totalVerifications.toLocaleString('en-IN'), icon: Activity, color: '#6C63FF', delta: '+12.4%' },
            { label: 'Pre-approved Loans', value: stats.preApprovedLoans.toLocaleString('en-IN'), icon: CheckCircle, color: '#00FF9C', delta: '+8.7%' },
            { label: 'Avg TrustScore', value: String(stats.avgTrustScore), icon: Activity, color: '#A78BFA', delta: '+15 pts' },
            { label: 'Acceptance Rate', value: `${stats.acceptanceRate}%`, icon: Building2, color: '#F5C518', delta: '+2.1%' },
          ].map((s, i) => (
            <motion.div key={s.label} className="glass-card p-6 flex flex-col gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
              <div className="flex justify-between">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={22} color={s.color} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#00FF9C', fontWeight: 700, background: 'rgba(0,255,156,0.1)', padding: '4px 10px', borderRadius: 8, height: 'fit-content' }}>
                  <TrendingUp size={12} style={{ display:'inline', marginRight: 4 }} />{s.delta}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.9rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', marginTop: 8 }}>{s.label.toUpperCase()}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent verifications table + quick verify */}
        <div className="app-grid-2">

          {/* Table */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Recent Verifications</p>
              <button className="btn-ghost" style={{ fontSize: '0.75rem' }} onClick={() => navigate('/lender/reports')}>
                Full Report <ArrowUpRight size={13} />
              </button>
            </div>
            <div className="table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    {['Worker', 'TrustScore', 'Amount', 'Result', 'Lender', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--text-muted)', fontSize: '0.68rem', letterSpacing: '0.06em', borderBottom: '1px solid rgba(108,99,255,0.12)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVerifications.map((v, i) => (
                    <motion.tr key={v.workerId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                      style={{ borderBottom: '1px solid rgba(108,99,255,0.06)', cursor: 'pointer' }}
                      whileHover={{ background: 'rgba(108,99,255,0.05)' }}
                    >
                      <td style={{ padding: '12px 10px' }}>
                        <div>
                          <p style={{ fontWeight: 600 }}>{v.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'JetBrains Mono' }}>{v.workerId}</p>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: v.score >= 700 ? '#00FF9C' : v.score >= 600 ? '#A78BFA' : '#F5C518' }}>{v.score}</span>
                      </td>
                      <td style={{ padding: '12px 10px', fontFamily: 'JetBrains Mono', color: '#F5C518', fontWeight: 600 }}>₹{v.amount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className={`badge ${v.result === 'approved' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                          {v.result === 'approved' ? 'Approved' : 'Review'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{v.lender}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem' }}>{v.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick verify panel */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Building2 size={16} color="var(--accent-secondary)" />
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quick Verify</p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Enter a Worker ID to instantly get their ZK-Proof verification result</p>
            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => navigate('/lender/verify')}>
              Start Verification <ArrowUpRight size={15} />
            </button>
            <div className="divider" />
            <div className="flex flex-col gap-2">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.06em' }}>SCORE BANDS TODAY</p>
              {[
                { band: 'Excellent (750–900)', pct: 28, color: '#00FF9C' },
                { band: 'Good (650–749)', pct: 41, color: '#6C63FF' },
                { band: 'Fair (500–649)', pct: 22, color: '#F5C518' },
                { band: 'Building (<500)', pct: 9, color: '#FF4D6A' },
              ].map(b => (
                <div key={b.band}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{b.band}</span>
                    <span style={{ fontSize: '0.72rem', color: b.color, fontWeight: 600 }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(108,99,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', background: b.color, borderRadius: 3, opacity: 0.7 }} initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ delay: 0.5, duration: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom insights grid */}
        <div className="admin-score-grid">
          {/* Top performing lenders */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Top Performing Partners</p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'NBFC Premium', verifications: 1280, rate: '94.5%', color: '#6C63FF' },
                { name: 'Microfinance Co', verifications: 856, rate: '91.2%', color: '#00FF9C' },
                { name: 'Digital Lending', verifications: 723, rate: '88.7%', color: '#F5C518' },
              ].map((lender, i) => (
                <motion.div
                  key={lender.name}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(0,0,0,0.2)',
                    border: `1px solid ${lender.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                >
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{lender.name}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{lender.verifications} verifications</p>
                  </div>
                  <span style={{ color: lender.color, fontFamily: 'JetBrains Mono', fontSize: '0.85rem', fontWeight: 700 }}>{lender.rate}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Monthly volume forecast */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Volume Forecast (Next 30d)</p>
              <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(0,255,156,0.1)', color: '#00FF9C', borderColor: 'rgba(0,255,156,0.3)' }}>+12%</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8 }}>
              {[
                { label: 'Optimistic', value: '₹4.2M', color: '#00FF9C' },
                { label: 'Expected', value: '₹3.8M', color: '#A78BFA' },
                { label: 'Conservative', value: '₹3.1M', color: '#F5C518' },
              ].map((f) => (
                <motion.div
                  key={f.label}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: `${f.color}08`,
                    border: `1px solid ${f.color}20`,
                    textAlign: 'center',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</p>
                  <p style={{ color: f.color, fontFamily: 'JetBrains Mono', fontSize: '1.1rem', fontWeight: 800, marginTop: 6 }}>{f.value}</p>
                </motion.div>
              ))}
            </div>
            {/* Forecast Drivers to fill empty space */}
            <div className="flex flex-col gap-2 mt-2">
               <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Primary Drivers</p>
               {[
                 { driver: 'Seasonal Gig Demand Spike', impact: '+8.5%' },
                 { driver: 'New Zomato Fleet Onboarding', impact: '+3.2%' },
                 { driver: 'Base Interest Rate Cut', impact: '+0.3%' },
               ].map((d, i) => (
                 <div key={i} className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.driver}</span>
                   <span style={{ fontSize: '0.75rem', color: '#00FF9C', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{d.impact}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
