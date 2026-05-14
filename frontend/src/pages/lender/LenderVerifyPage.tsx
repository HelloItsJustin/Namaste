/**
 * NAMASTE — Lender Verify Page
 * Enter Worker ID → receive ZK-Proof verification result + TrustScore
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import TrustScoreDial from '@/components/ui/TrustScoreDial';
import ZKProofShield from '@/components/ui/ZKProofShield';
import { MOCK_WORKER, MOCK_TRUST_SCORE_DETAILS } from '@/lib/mockData';

type VerifyState = 'idle' | 'loading' | 'found' | 'notfound';

export default function LenderVerifyPage() {
  const [workerId, setWorkerId] = useState('');
  const [state, setState] = useState<VerifyState>('idle');
  const [step, setStep] = useState(0);

  const STEPS = ['Fetching ZK-Proof from IPFS...', 'Verifying cryptographic proof...', 'Checking on-chain credential registry...', 'Computing TrustScore...'];

  const verify = async () => {
    if (!workerId.trim()) return;
    setState('loading');
    setStep(0);
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setStep(i + 1);
    }
    setState(workerId.toUpperCase() === 'W-2024-MH-00781' || workerId === MOCK_WORKER.id ? 'found' : 'notfound');
  };

  return (
    <AppShell title="Verify Worker" subtitle="Zero-Knowledge identity verification for lending decisions">
      <div style={{ maxWidth: 820, margin: '0 auto' }} className="flex flex-col gap-6">

        {/* Search bar */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Enter Worker ID</p>
          <div className="flex gap-3">
            <input
              className="input-glass font-mono"
              style={{ flex: 1 }}
              placeholder="W-2024-MH-00781"
              value={workerId}
              onChange={e => { setWorkerId(e.target.value); setState('idle'); }}
              onKeyDown={e => e.key === 'Enter' && verify()}
            />
            <motion.button className="btn-primary" style={{ flexShrink: 0, padding: '12px 24px' }} onClick={verify} disabled={state === 'loading'} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {state === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <><Search size={16} /> Verify</>}
            </motion.button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            Try: <span className="font-mono" style={{ color: '#A78BFA' }}>W-2024-MH-00781</span> — the lender never sees raw data, only cryptographic proof
          </p>
        </div>

        {/* Loading steps */}
        <AnimatePresence>
          {state === 'loading' && (
            <motion.div className="glass-card p-6 flex flex-col gap-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>ZK VERIFICATION IN PROGRESS</p>
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: i < step ? 'rgba(0,255,156,0.15)' : i === step - 1 ? 'rgba(108,99,255,0.15)' : 'rgba(108,99,255,0.05)', border: `1px solid ${i < step ? '#00FF9C40' : i === step - 1 ? '#6C63FF40' : 'rgba(108,99,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {i < step ? <CheckCircle size={12} color="#00FF9C" /> : i === step - 1 ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Loader2 size={12} color="#6C63FF" /></motion.div> : null}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: i < step ? '#00FF9C' : i === step - 1 ? '#A78BFA' : 'var(--text-muted)' }}>{s}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {state === 'found' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              {/* Success banner */}
              <motion.div style={{ padding: '14px 18px', background: 'rgba(0,255,156,0.08)', border: '1px solid rgba(0,255,156,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }} animate={{ boxShadow: ['0 0 0 rgba(0,255,156,0)', '0 0 24px rgba(0,255,156,0.2)', '0 0 0 rgba(0,255,156,0)'] }} transition={{ duration: 2, repeat: Infinity }}>
                <ShieldCheck size={24} color="#00FF9C" />
                <div>
                  <p style={{ fontWeight: 700, color: '#00FF9C' }}>ZK-Proof Verified — Worker is Creditworthy</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: 2 }}>No raw data was transmitted. All claims verified cryptographically.</p>
                </div>
              </motion.div>

              <div className="verify-result-grid">
                {/* Shield */}
                <div className="glass-card p-6 flex items-center justify-center">
                  <ZKProofShield active size="md" />
                </div>

                {/* Details */}
                <div className="glass-card p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p style={{ fontWeight: 600 }}>Worker Profile</p>
                    <span className="badge badge-success"><CheckCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> ZK Verified</span>
                  </div>
                  {[
                    ['Worker ID', MOCK_WORKER.id],
                    ['Occupation', MOCK_WORKER.occupation + ' · ' + MOCK_WORKER.platform],
                    ['Platform Tenure', '18 months'],
                    ['e-Shram', MOCK_WORKER.eshrammId],
                    ['Location', MOCK_WORKER.location],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(108,99,255,0.08)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{k}</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ padding: 12, background: 'rgba(0,255,156,0.06)', border: '1px solid rgba(0,255,156,0.2)', borderRadius: 8 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>SHAP Explanation</p>
                    <p style={{ color: '#00FF9C', fontSize: '0.82rem', marginTop: 4 }}>{MOCK_TRUST_SCORE_DETAILS.explanation}</p>
                  </div>
                </div>
              </div>

              {/* TrustScore + Claims */}
              <div className="verify-score-grid">
                <div className="glass-card p-6 flex flex-col items-center gap-3">
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>TRUST SCORE</p>
                  <TrustScoreDial score={MOCK_WORKER.trustScore} size={180} />
                </div>
                <div className="glass-card p-6 flex flex-col gap-3">
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Proven Claims (ZK-Verified)</p>
                  {[
                    { label: 'TrustScore ≥ 650', proven: true },
                    { label: 'Income consistency ≥ 12 months', proven: true },
                    { label: 'Aadhaar identity verified', proven: true },
                    { label: 'Active platform employment', proven: true },
                    { label: 'e-Shram registered', proven: true },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-3" style={{ padding: '8px 12px', background: 'rgba(0,255,156,0.05)', borderRadius: 8, border: '1px solid rgba(0,255,156,0.15)' }}>
                      <CheckCircle size={15} color="#00FF9C" />
                      <span style={{ fontSize: '0.82rem' }}>{c.label}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, padding: 12, background: 'rgba(108,99,255,0.06)', borderRadius: 8, border: '1px solid rgba(108,99,255,0.15)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Recommendation: <span style={{ color: '#00FF9C', fontWeight: 600 }}>Pre-approve up to ₹50,000 at 12% p.a.</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'notfound' && (
            <motion.div className="glass-card p-8 flex flex-col items-center gap-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <XCircle size={48} color="#FF4D6A" />
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem' }}>Worker Not Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 360 }}>No NAMASTE profile found for this ID. The worker may not be onboarded yet or the ID may be incorrect.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
