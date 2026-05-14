/**
 * NAMASTE — Worker Dashboard
 * TrustScore dial, credential list, dividend summary, signal breakdown
 */
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Activity, 
  IndianRupee, 
  IdCard, 
  Bike, 
  Users, 
  CheckCircle, 
  TrendingUp as Growth, 
  Calendar, 
  Clock, 
  Building,
  ShieldCheck
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import TrustScoreDial from '@/components/ui/TrustScoreDial';
import DividendTicker from '@/components/ui/DividendTicker';
import CredentialCard from '@/components/ui/CredentialCard';
import { MOCK_WORKER, MOCK_TRUST_SCORE_DETAILS, MOCK_CREDENTIALS, MOCK_DIVIDENDS } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

const IconMap: Record<string, any> = {
  CheckCircle,
  IndianRupee,
  Calendar,
  Clock,
  Users,
  Building,
  IdCard,
  Bike,
  Activity,
};

function StatCard({ label, value, sub, icon: IconName, color, delta }: { label: string; value: string; sub: string; icon: string; color: string; delta?: string }) {
  const Icon = IconMap[IconName] || Activity;
  return (
    <motion.div
      className="glass-card p-10 flex flex-col gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: `0 10px 30px -10px ${color}33` }}
    >
      <div className="flex items-center justify-between">
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} color={color} />
        </div>
        {delta && (
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: delta.startsWith('+') ? '#00FF9C' : '#FF4D6A', background: delta.startsWith('+') ? 'rgba(0,255,156,0.1)' : 'rgba(255,77,106,0.1)', padding: '6px 12px', borderRadius: 8 }}>
            {delta.startsWith('+') ? <TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} /> : <TrendingDown size={14} style={{ display: 'inline', marginRight: 4 }} />}
            {delta}
          </span>
        )}
      </div>
      <div>
        <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.9rem', color, lineHeight: 1 }}>{value}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 700, marginTop: 8, letterSpacing: '0.02em' }}>{label}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{sub}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const details = MOCK_TRUST_SCORE_DETAILS;

  return (
    <AppShell title="Dashboard" subtitle={`Welcome back, ${MOCK_WORKER.name.split(' ')[0]}`} showMesh>
      <div className="flex flex-col gap-8">

        {/* Hero row - Balanced 3-column layout */}
        <div className="dashboard-hero-grid">
          {/* TrustScore Dial */}
          <motion.div
            className="glass-card p-10 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Private Trust Score</p>
            <TrustScoreDial score={MOCK_WORKER.trustScore} />
            <motion.button
              className="btn-primary w-full"
              style={{ padding: '16px', justifyContent: 'center', fontSize: '0.95rem' }}
              onClick={() => navigate('/zkproof')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShieldCheck size={18} /> Generate ZK-Proof
            </motion.button>
          </motion.div>

          {/* Stats column 1 */}
          <div className="flex flex-col gap-6">
            <StatCard label="Platform Yield" value={`₹${MOCK_WORKER.totalDividends.toLocaleString('en-IN')}`} sub="Cumulative data dividends" icon="IndianRupee" color="#F5C518" delta="+18.4%" />
            <StatCard label="Identity Vault" value={String(MOCK_WORKER.credentialCount)} sub="On-chain anchored identities" icon="IdCard" color="#A78BFA" delta="+1 new" />
          </div>

          {/* Stats column 2 */}
          <div className="flex flex-col gap-6">
            <StatCard label="Network Trust" value={String(MOCK_WORKER.vouchCount)} sub="Verified community attestations" icon="Users" color="#00FF9C" delta="+2 active" />
            <StatCard label="Worker Integrity" value="94%" sub="Job completion & service level" icon="CheckCircle" color="#6C63FF" delta="+2.1%" />
          </div>
        </div>

        {/* Dividend Ticker + Signal Breakdown */}
        <div className="dashboard-insight-grid">
          <DividendTicker total={MOCK_WORKER.totalDividends} monthly={MOCK_WORKER.monthlyDividend} pending={MOCK_WORKER.pendingDividend} />

          {/* TrustScore Signals */}
          <div className="glass-card score-weightage-card flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Growth size={18} color="var(--accent-secondary)" />
                <p style={{ fontWeight: 600, fontSize: '1rem' }}>Score Weightage</p>
              </div>
              <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => navigate('/credentials')}>
                Full Audit <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="score-weightage-list">
              {details.signals.map((sig, i) => {
                const SignalIcon = IconMap[sig.icon] || Activity;
                return (
                  <motion.div className="score-signal-row" key={sig.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <div className="score-signal-header">
                      <div className="score-signal-title">
                        <SignalIcon size={14} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>{sig.label}</span>
                      </div>
                      <div className="score-signal-meta">
                        <span className="score-weight-pill">{Math.round(sig.weight * 100)}%</span>
                        <span style={{ color: '#00FF9C', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{sig.contribution}</span>
                      </div>
                    </div>
                    <div style={{ height: 7, background: 'rgba(108,99,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', background: 'linear-gradient(90deg,#6C63FF,#00FF9C)', borderRadius: 4 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(sig.value / sig.max) * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {/* Fairness badge */}
            <div style={{ marginTop: 6, padding: '12px 16px', background: 'rgba(0,255,156,0.04)', border: '1px solid rgba(0,255,156,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={16} color="#00FF9C" />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>Fairness audit passed — Zero demographic bias detected</span>
            </div>
          </div>
        </div>

        {/* Bottom Row - Activity & Credentials */}
        <div className="dashboard-bottom-grid">
          {/* Recent Transactions */}
          <div className="glass-card p-7">
            <div className="flex items-center justify-between mb-6">
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>Dividend Stream</p>
              <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => navigate('/wallet')}>
                Ledger <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {MOCK_DIVIDENDS.slice(0, 4).map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(108,99,255,0.06)' }}
                >
                  <div className="flex items-center gap-4">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === 'credit' ? 'rgba(0,255,156,0.08)' : 'rgba(255,77,106,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tx.type === 'credit' ? <TrendingUp size={16} color="#00FF9C" /> : <TrendingDown size={16} color="#FF4D6A" />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tx.source}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'JetBrains Mono', marginTop: 1 }}>{tx.date} · {tx.txHash}</p>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: tx.type === 'credit' ? '#00FF9C' : '#FF4D6A', fontSize: '0.95rem' }}>
                    {tx.type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Credentials */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>Verified Portfolio</p>
              <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => navigate('/credentials')}>
                Vault <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="recent-credential-grid">
              {MOCK_CREDENTIALS.slice(0, 2).map((cred, i) => (
                <CredentialCard key={cred.id} credential={cred} index={i} onClick={() => navigate('/credentials')} />
              ))}
            </div>
            <div className="glass-card p-5 mt-auto" style={{ borderStyle: 'dashed', borderColor: 'rgba(108,99,255,0.3)', background: 'transparent' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                All credentials are encrypted via Jlyn* Star Algorithm before being anchored to the Polygon network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
