import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Star, 
  CheckCircle, 
  Search, 
  Loader2, 
  Send, 
  Plus, 
  Shield, 
  Network, 
  Trophy, 
  UserPlus, 
  Activity 
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_VOUCHES, MOCK_WORKER } from '@/lib/mockData';

export default function VouchingPage() {
  const [tab, setTab] = useState<'received'|'give'>('received');
  const [searchId, setSearchId] = useState('');
  const [found, setFound] = useState<null|{ name: string; id: string; platform: string; score: number }>(null);
  const [vouchMsg, setVouchMsg] = useState('');
  const [vouchScore, setVouchScore] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const search = async () => {
    if (!searchId.trim()) return;
    setFound(null);
    await new Promise(r => setTimeout(r, 1000));
    // Mock found worker
    setFound({ name: 'Priya Patel', id: searchId || 'W-2024-MH-00456', platform: 'Urban Company', score: 698 });
  };

  const submitVouch = async () => {
    if (!vouchMsg.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFound(null); setSearchId(''); setVouchMsg(''); setVouchScore(5); }, 3500);
  };

  return (
    <AppShell title="Peer Vouching" subtitle="Decentralized community trust verification">
      <div className="flex flex-col gap-8">

        {/* Stats bar - Expansive layout */}
        <div className="stats-grid-4">
          {[
            { label: 'Attestations Received', value: MOCK_WORKER.vouchCount, color: '#00FF9C', icon: CheckCircle },
            { label: 'Network Reputation', value: '4.7/5', color: '#F5C518', icon: Star },
            { label: 'Attestations Given', value: '4', color: '#A78BFA', icon: UserPlus },
            { label: 'Connected Nodes', value: '23', color: '#6C63FF', icon: Network },
          ].map(s => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} className="glass-card p-6 flex items-center gap-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={s.color} />
                </div>
                <div>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {[{ id: 'received', label: 'Received Attestations' }, { id: 'give', label: 'Create New Vouch' }].map(t => (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id as 'received'|'give')}
              style={{ padding: '12px 24px', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', background: tab === t.id ? 'rgba(108,99,255,0.15)' : 'rgba(0,0,0,0.2)', color: tab === t.id ? 'var(--accent-secondary)' : 'var(--text-muted)', border: `1px solid ${tab === t.id ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)'}` }}
              whileTap={{ scale: 0.97 }}
            >
              {t.id === 'received' ? <><Users size={16} style={{ display: 'inline', marginRight: 8 }} />{t.label}</> : <><Plus size={16} style={{ display: 'inline', marginRight: 8 }} />{t.label}</>}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'received' && (
            <motion.div key="received" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {MOCK_VOUCHES.map((v, i) => (
                <motion.div
                  key={v.id}
                  className="glass-card p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6C63FF,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1.2rem', flexShrink: 0 }}>
                      {v.from.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{v.from}</p>
                        <Shield size={16} color="#00FF9C" />
                        <span className="badge" style={{ fontSize: '0.7rem', padding: '4px 12px', background: 'rgba(108,99,255,0.1)', color: 'var(--accent-secondary)' }}>{v.relation}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{v.fromId} | {v.platform}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 14, lineHeight: 1.7, fontStyle: 'italic' }}>"{v.message}"</p>
                    </div>
                  </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} size={15} color={si < Math.floor(v.score) ? '#F5C518' : 'rgba(245,197,24,0.1)'} fill={si < Math.floor(v.score) ? '#F5C518' : 'none'} />
                        ))}
                      </div>
                      <span style={{ color: '#F5C518', fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '0.9rem' }}>{v.score}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{v.date}</span>
                    </div>
                  </div>
                  {/* Jlyn signed badge */}
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, width: 'fit-content', border: '1px solid rgba(108,99,255,0.05)' }}>
                    <Activity size={12} color="#6C63FF" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 500 }}>Jlyn* Cryptographic Seal · On-chain Anchored</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'give' && (
            <motion.div key="give" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="vouch-create-grid">
              {/* Search */}
              <div className="glass-card p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Search size={18} color="var(--accent-secondary)" />
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Find Worker Node</h3>
                </div>
                <div className="flex gap-3">
                  <input className="input-glass" placeholder="W-2024-XX-XXXXX" value={searchId} onChange={e => setSearchId(e.target.value)} style={{ flex: 1, fontSize: '1rem' }} />
                  <motion.button className="btn-primary" style={{ padding: '12px 20px', flexShrink: 0 }} onClick={search} whileTap={{ scale: 0.95 }}>
                    Search
                  </motion.button>
                </div>

                <AnimatePresence>
                  {found && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ padding: 18, background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 14 }}
                    >
                      <div className="flex items-center gap-4">
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#00FF9C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                          {found.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '1rem' }}>{found.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{found.id} · {found.platform}</p>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <p style={{ color: '#00FF9C', fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.1rem' }}>{found.score}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>TrustScore</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: '0.75rem', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
                  <Trophy size={14} color="#F5C518" />
                  <span>Only workers with 600+ TrustScore can receive community attestations.</span>
                </div>
              </div>

              {/* Vouch form */}
              <AnimatePresence>
                {found && (
                  <motion.div
                    className="glass-card p-8 flex flex-col gap-6"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex items-center gap-3">
                      <Plus size={18} color="#00FF9C" />
                      <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Create Attestation</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Reputation Rating</label>
                      <div className="flex gap-3">
                        {[1,2,3,4,5].map(s => (
                          <motion.button key={s} onClick={() => setVouchScore(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} whileTap={{ scale: 0.8 }}>
                            <Star size={32} color={s <= vouchScore ? '#F5C518' : 'rgba(245,197,24,0.1)'} fill={s <= vouchScore ? '#F5C518' : 'none'} />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Attestation Message</label>
                      <textarea
                        className="input-glass"
                        style={{ minHeight: 120, resize: 'none', fontSize: '0.95rem' }}
                        placeholder="Provide professional feedback on this worker node..."
                        value={vouchMsg}
                        onChange={e => setVouchMsg(e.target.value)}
                      />
                    </div>

                    {submitted ? (
                      <motion.div style={{ textAlign: 'center', padding: 20, background: 'rgba(0,255,156,0.04)', borderRadius: 14, border: '1px solid rgba(0,255,156,0.2)' }} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <CheckCircle size={32} color="#00FF9C" style={{ margin: '0 auto 12px' }} />
                        <p style={{ color: '#00FF9C', fontWeight: 800, fontSize: '1.1rem' }}>Attestation Anchored</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>Transaction verified on Polygon Mumbai</p>
                      </motion.div>
                    ) : (
                      <motion.button className="btn-primary" style={{ padding: '16px', justifyContent: 'center' }} onClick={submitVouch} disabled={submitting || !vouchMsg.trim()} whileHover={{ scale: 1.02 }}>
                        {submitting ? <><Loader2 size={18} className="animate-spin" /> Signing Jlyn* Payload...</> : <><Send size={16} /> Authorize Vouch</>}
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
