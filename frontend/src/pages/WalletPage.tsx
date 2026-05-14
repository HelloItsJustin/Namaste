import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Send, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Wallet, 
  ArrowUpRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import DividendTicker from '@/components/ui/DividendTicker';
import { MOCK_WORKER, MOCK_DIVIDENDS } from '@/lib/mockData';

export default function WalletPage() {
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<'idle'|'pending'|'done'>('idle');
  const [filter, setFilter] = useState<'all'|'credit'|'debit'>('all');

  const filtered = MOCK_DIVIDENDS.filter(t => filter === 'all' || t.type === filter);

  const withdraw = async () => {
    const amt = parseFloat(withdrawAmt);
    if (!amt || amt > MOCK_WORKER.totalDividends) return;
    setWithdrawStatus('pending');
    await new Promise(r => setTimeout(r, 2400));
    setWithdrawStatus('done');
    setTimeout(() => { setWithdrawStatus('idle'); setWithdrawAmt(''); }, 3000);
  };

  return (
    <AppShell title="Dividend Wallet" subtitle="Sovereign management of your data earnings">
      <div className="wallet-grid">

        {/* Left — transactions & Analytics */}
        <div className="flex flex-col gap-6">
          <DividendTicker total={MOCK_WORKER.totalDividends} monthly={MOCK_WORKER.monthlyDividend} pending={MOCK_WORKER.pendingDividend} />

          {/* Monthly chart bars */}
          <div className="glass-card p-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>Earning Analytics</p>
              <div className="badge badge-primary" style={{ padding: '6px 12px' }}>
                <TrendingUp size={12} /> Live Stream
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, padding: '10px 10px 0 10px' }}>
              {[140, 185, 125, 245, 220, 310].map((v, i) => {
                const max = 320;
                const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <motion.div
                      style={{ width: '100%', background: i === 5 ? 'linear-gradient(180deg,#6C63FF,#A78BFA)' : 'rgba(108,99,255,0.18)', borderRadius: '8px 8px 0 0', position: 'relative', minHeight: 8 }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(v / max) * 160}px` }}
                      transition={{ delay: i * 0.12, duration: 1.2, ease: 'circOut' }}
                    >
                      {i === 5 && (
                        <motion.div 
                          style={{ position: 'absolute', top: -3, left: 0, right: 0, height: 2, background: '#00FF9C', boxShadow: '0 0 10px #00FF9C', borderRadius: 1 }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>{months[i]}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Period Average: <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>₹232.50</span></span>
              <div className="flex items-center gap-1" style={{ color: '#00FF9C', fontSize: '0.8rem', fontWeight: 700 }}>
                <TrendingUp size={14} /> 68.3%
              </div>
            </div>
          </div>

          {/* Staking / Yield Forecast panel */}
          <motion.div 
            className="glass-card p-7 flex flex-col gap-5"
            style={{ border: '1px solid rgba(167,139,250,0.2)', background: 'linear-gradient(135deg, rgba(108,99,255,0.05), rgba(167,139,250,0.05))' }}
          >
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#A78BFA' }}>Yield Forecasting</p>
              <div className="badge" style={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)' }}>
                12.4% APY
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Stake your unused data dividends in the Polygon decentralized liquidity pool to earn passive compounding yield.
            </p>
            
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(167,139,250,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 2 }}>Est. 1 Year Return</p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '1.1rem', fontWeight: 700, color: '#A78BFA' }}>+ ₹1,124.50</p>
              </div>
              <button className="btn-secondary" style={{ padding: '8px 16px', background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: 'none' }}>
                Start Staking
              </button>
            </div>
          </motion.div>

          {/* Data Value Index (DVI) Ticker */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Data Value Index (DVI)</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,255,156,0.1)', padding: '4px 8px', borderRadius: 6, color: '#00FF9C', fontSize: '0.7rem', fontWeight: 600 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF9C' }} /> LIVE
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: -8 }}>Real-time market value per MB of worker data</p>
            <div className="flex gap-4" style={{ overflow: 'hidden' }}>
              {[
                { label: 'Logistics', val: '₹14.20/MB', diff: '+2.4%' },
                { label: 'Domestic', val: '₹18.50/MB', diff: '+1.1%' },
                { label: 'Mobility', val: '₹12.80/MB', diff: '-0.4%' }
              ].map(idx => (
                <div key={idx.label} className="flex flex-col gap-1 p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, flex: 1 }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{idx.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.85rem' }}>{idx.val}</span>
                  <span style={{ color: idx.diff.startsWith('+') ? '#00FF9C' : '#FF4D6A', fontSize: '0.7rem', fontWeight: 600 }}>{idx.diff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction filter + list */}
          <div className="glass-card p-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>Audit Ledger</p>
              <div className="flex gap-2">
                {(['all','credit','debit'] as const).map(f => (
                  <motion.button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="badge"
                    style={{ 
                      cursor: 'pointer', 
                      background: filter === f ? 'rgba(108,99,255,0.2)' : 'rgba(0,0,0,0.2)', 
                      color: filter === f ? 'var(--accent-secondary)' : 'var(--text-muted)', 
                      border: `1px solid ${filter === f ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
                      transition: 'all 0.2s'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 14, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(108,99,255,0.05)' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: tx.type === 'credit' ? 'rgba(0,255,156,0.08)' : 'rgba(255,77,106,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {tx.type === 'credit' ? <TrendingUp size={18} color="#00FF9C" /> : <TrendingDown size={18} color="#FF4D6A" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.source}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{tx.date} · {tx.txHash}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: tx.type === 'credit' ? '#00FF9C' : '#FF4D6A', fontSize: '1rem' }}>
                        {tx.type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                      </span>
                      <ExternalLink size={14} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right — withdraw panel */}
        <div className="flex flex-col gap-6">
          {/* Balance card */}
          <motion.div
            className="glass-card p-8 flex flex-col gap-5"
            style={{ border: '1px solid rgba(245,197,24,0.2)', background: 'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(245,197,24,0.05))' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>AVAILABLE LIQUIDITY</p>
              <Wallet size={16} color="#F5C518" />
            </div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '2.5rem', fontWeight: 800, color: '#F5C518', textShadow: '0 0 30px rgba(245,197,24,0.3)' }}>
              ₹{MOCK_WORKER.totalDividends.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex flex-col gap-3">
              <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 12 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Primary UPI Handle</p>
                <p style={{ color: '#F5C518', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', fontWeight: 700, marginTop: 2 }}>{MOCK_WORKER.upiId}</p>
              </div>
              <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(108,99,255,0.1)', borderRadius: 12 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Polygon Settlement Node</p>
                <p style={{ color: 'var(--accent-secondary)', fontFamily: 'JetBrains Mono', fontSize: '0.7rem', wordBreak: 'break-all', marginTop: 2 }}>{MOCK_WORKER.walletAddress}</p>
              </div>
            </div>
          </motion.div>

          {/* Withdraw form */}
          <div className="glass-card p-7 flex flex-col gap-6">
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>Instant Settlement</p>
            <div className="flex flex-col gap-3">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Transfer Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>
                <input
                  className="input-glass font-mono"
                  style={{ paddingLeft: 36, fontSize: '1.2rem', fontWeight: 700 }}
                  placeholder="0.00"
                  value={withdrawAmt}
                  onChange={e => setWithdrawAmt(e.target.value.replace(/[^\d.]/g, ''))}
                  type="number"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 2000, 5000].map(amt => (
                <button key={amt} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: 10 }} onClick={() => setWithdrawAmt(String(amt))}>
                  ₹{amt}
                </button>
              ))}
            </div>
            <motion.button
              className="btn-primary"
              style={{ padding: '14px', justifyContent: 'center', opacity: !withdrawAmt || withdrawStatus !== 'idle' ? 0.6 : 1 }}
              onClick={withdraw}
              disabled={!withdrawAmt || withdrawStatus !== 'idle'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {withdrawStatus === 'pending' ? <><Loader2 size={18} className="animate-spin" /> Processing UPI Bridge...</> :
               withdrawStatus === 'done' ? <><CheckCircle size={18} color="#00FF9C" /> Settlement Confirmed</> :
               <><Send size={16} /> Execute Transfer</>}
            </motion.button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              <ShieldCheck size={14} color="#00FF9C" /> Encrypted via Jlyn* Star Algorithm
            </div>
          </div>

          {/* Data sources */}
          <div className="glass-card p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monetized Channels</p>
              <ArrowUpRight size={14} color="var(--text-muted)" />
            </div>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Swiggy Logistics', share: '₹89.25/mo', color: '#FC8019' },
                { name: 'Urban Company', share: '₹112.50/mo', color: '#1B5EAB' },
                { name: 'PhonePe Payments', share: '₹45.00/mo', color: '#5F259F' },
                { name: 'Rapido Mobility', share: '₹67.75/mo', color: '#F5C518' },
              ].map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <span style={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', fontWeight: 700 }}>{p.share}</span>
                </div>
              ))}
            </div>

            {/* Total monthly from channels */}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(108,99,255,0.1)' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Total from Channels</span>
                <span style={{ color: '#00FF9C', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.1rem' }}>₹314.50</span>
              </div>
              <div style={{ height: 6, background: 'rgba(0,255,156,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg, #00FF9C, #6C63FF)', borderRadius: 3 }}
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: 8 }}>82% of total monthly earnings</p>
            </div>

            {/* Connection status */}
            <motion.div
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(0,255,156,0.08)',
                border: '1px solid rgba(0,255,156,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#00FF9C',
                  boxShadow: '0 0 8px #00FF9C',
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span style={{ color: '#00FF9C', fontSize: '0.7rem', fontWeight: 600 }}>All data sources active • Auto-synced hourly</span>
            </motion.div>
          </div>

          {/* Network Gas Savings widget */}
          <div className="glass-card p-6 flex flex-col gap-4" style={{ overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.05, transform: 'scale(2)' }}>
              <ShieldCheck size={120} />
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Polygon L2 Gas Savings</p>
            <div className="flex items-end gap-3">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '2rem', fontWeight: 800, color: '#00FF9C', lineHeight: 1 }}>₹4,892</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', paddingBottom: 4 }}>saved YTD</span>
            </div>
            <div style={{ display: 'flex', gap: 2, height: 24, marginTop: 8 }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  style={{ flex: 1, background: '#00FF9C', opacity: Math.random() * 0.5 + 0.1, borderRadius: 2 }}
                  animate={{ height: ['40%', '100%', '40%'] }}
                  transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
                />
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Batched ZK-rollups prevent you from paying mainnet gas fees on data payouts.
            </p>
          </div>

          {/* Liquid vs Locked Allocation */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Capital Allocation</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Liquid (Withdrawable)</span>
                <span style={{ fontFamily: 'JetBrains Mono', color: '#F5C518', fontWeight: 700 }}>78%</span>
              </div>
              <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Locked (Staked)</span>
                <span style={{ fontFamily: 'JetBrains Mono', color: '#A78BFA', fontWeight: 700 }}>22%</span>
              </div>
            </div>
            
            <div style={{ height: 8, display: 'flex', gap: 4, marginTop: 4 }}>
              <motion.div 
                style={{ height: '100%', background: 'linear-gradient(90deg, #F5C518, #FCD34D)', borderRadius: 4 }}
                initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1, ease: 'easeOut' }}
              />
              <motion.div 
                style={{ height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)', borderRadius: 4 }}
                initial={{ width: 0 }} animate={{ width: '22%' }} transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Security & Encryption Status */}
          <div className="glass-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Security Protocol</p>
              <Lock size={14} color="#00FF9C" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Asset Encryption</span>
              <span style={{ color: '#00FF9C', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>Jlyn* Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Key Management</span>
              <span style={{ color: '#A78BFA', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>MPC Sharded</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Last Backup</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>2 hrs ago</span>
            </div>
          </div>

          {/* Smart Contract Audit Status */}
          <div className="glass-card p-6 flex flex-col gap-3">
             <div className="flex items-center justify-between mb-1">
               <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Smart Contract Audit</p>
               <ShieldCheck size={14} color="#F5C518" />
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,197,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <CheckCircle size={18} color="#F5C518" />
                </div>
                <div style={{ flex: 1 }}>
                   <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>CertiK Verified</p>
                   <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score: 98/100 • Critical: 0</p>
                </div>
             </div>
             <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '8px 10px', marginTop: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  Latest scan: <span style={{ color: '#00FF9C' }}>Passed (24m ago)</span>
                </p>
             </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
