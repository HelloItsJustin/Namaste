/**
 * NAMASTE — Lender Reports Page
 */
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

const MONTHLY_DATA = [
  { month: 'Dec', verifications: 112, approved: 84 },
  { month: 'Jan', verifications: 145, approved: 108 },
  { month: 'Feb', verifications: 178, approved: 131 },
  { month: 'Mar', verifications: 234, approved: 182 },
  { month: 'Apr', verifications: 312, approved: 248 },
  { month: 'May', verifications: 421, approved: 312 },
];

export default function LenderReportsPage() {
  const maxV = Math.max(...MONTHLY_DATA.map(d => d.verifications));
  return (
    <AppShell title="Reports & Analytics" subtitle="Aggregated, anonymised worker trust data">
      <div className="flex flex-col gap-6">
        <div className="stats-grid-3">
          {[
            { label: 'Total Verifications', value: '1,847', icon: BarChart2, color: '#6C63FF' },
            { label: 'Approval Rate', value: '76.4%', icon: TrendingUp, color: '#00FF9C' },
            { label: 'Unique Workers', value: '1,203', icon: Users, color: '#F5C518' },
          ].map((s, i) => (
            <motion.div key={s.label} className="glass-card p-5 flex items-center gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3 }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <p style={{ fontWeight: 600 }}>Monthly Verification Volume</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, paddingBottom: 4 }}>
            {MONTHLY_DATA.map((d, i) => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                  <motion.div style={{ width: '70%', background: 'rgba(108,99,255,0.25)', borderRadius: '4px 4px 0 0' }} initial={{ height: 0 }} animate={{ height: `${(d.approved / maxV) * 140}px` }} transition={{ delay: i * 0.1, duration: 0.7 }} />
                  <motion.div style={{ width: '100%', background: 'linear-gradient(180deg,#6C63FF,#A78BFA)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(108,99,255,0.4)' }} initial={{ height: 0 }} animate={{ height: `${((d.verifications - d.approved) / maxV) * 140}px` }} transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }} />
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-5">
            {[{ color: '#6C63FF', label: 'Total Verifications' }, { color: 'rgba(108,99,255,0.3)', label: 'Approved' }].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupation breakdown */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <p style={{ fontWeight: 600 }}>Worker Occupation Breakdown</p>
          {[
            { label: 'Delivery Executive', pct: 42, color: '#FC8019' },
            { label: 'Home Services Worker', pct: 24, color: '#1B5EAB' },
            { label: 'Auto / Bike Rider', pct: 18, color: '#F5C518' },
            { label: 'Construction Worker', pct: 10, color: '#6C63FF' },
            { label: 'Domestic Helper', pct: 6, color: '#00FF9C' },
          ].map(o => (
            <div key={o.label}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.label}</span>
                <span style={{ fontSize: '0.8rem', color: o.color, fontWeight: 600 }}>{o.pct}%</span>
              </div>
              <div style={{ height: 7, background: 'rgba(108,99,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: o.color, borderRadius: 4 }} initial={{ width: 0 }} animate={{ width: `${o.pct}%` }} transition={{ delay: 0.4, duration: 0.8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
