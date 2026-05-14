/**
 * NAMASTE — ZK Proof Page
 * Generate and share ZK-Proof with a selected lender
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Copy, CheckCircle, Send, Loader2, Building2, Activity, IndianRupee, ShieldCheck, Lock } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ZKProofShield from '@/components/ui/ZKProofShield';
import { MOCK_WORKER, LENDERS } from '@/lib/mockData';
import { jlynEncrypt } from '@/lib/jlynCipher';

function CircuitAnimation({ step }: { step: number }) {
  return (
    <motion.div 
      style={{ position: 'relative', height: 240, background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(108,99,255,0.2)', overflow: 'hidden', padding: 20 }}
      initial={{ opacity: 0, height: 0 }} 
      animate={{ opacity: 1, height: 240 }} 
      exit={{ opacity: 0, height: 0 }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'linear-gradient(#6C63FF 1px, transparent 1px), linear-gradient(90deg, #6C63FF 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        <defs>
          <filter id="circuit-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <motion.circle cx="200" cy="100" r="30" fill="none" stroke="rgba(108,99,255,0.3)" strokeWidth="2" />
        <motion.circle cx="200" cy="100" r="20" fill="none" stroke="#6C63FF" strokeWidth="1" strokeDasharray="5,5" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '200px 100px' }} />
        
        <g opacity={step >= 1 ? 1 : 0.2}>
          <motion.path d="M 50 50 L 120 50 L 170 85" fill="none" stroke={step >= 1 ? '#00FF9C' : '#6C63FF'} strokeWidth="2" filter="url(#circuit-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <motion.path d="M 50 150 L 120 150 L 170 115" fill="none" stroke={step >= 1 ? '#00FF9C' : '#6C63FF'} strokeWidth="2" filter="url(#circuit-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <circle cx="50" cy="50" r="6" fill={step >= 1 ? '#00FF9C' : '#6C63FF'} />
          <circle cx="50" cy="150" r="6" fill={step >= 1 ? '#00FF9C' : '#6C63FF'} />
        </g>

        <g opacity={step >= 2 ? 1 : 0.2}>
          <motion.path d="M 200 20 L 200 70" fill="none" stroke={step >= 2 ? '#A78BFA' : '#6C63FF'} strokeWidth="3" filter="url(#circuit-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 2 ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <motion.path d="M 200 180 L 200 130" fill="none" stroke={step >= 2 ? '#A78BFA' : '#6C63FF'} strokeWidth="3" filter="url(#circuit-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 2 ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <rect x="185" y="10" width="30" height="10" fill={step >= 2 ? '#A78BFA' : '#6C63FF'} />
          <rect x="185" y="180" width="30" height="10" fill={step >= 2 ? '#A78BFA' : '#6C63FF'} />
        </g>

        {step >= 3 && (
          <motion.circle cx="200" cy="100" r="10" fill="#00FF9C" filter="url(#circuit-glow)" initial={{ scale: 0 }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        )}

        <g opacity={step >= 4 ? 1 : 0.2}>
          <motion.path d="M 230 85 L 280 50 L 350 50" fill="none" stroke={step >= 4 ? '#00FF9C' : '#6C63FF'} strokeWidth="2" filter="url(#circuit-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 4 ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <motion.path d="M 230 115 L 280 150 L 350 150" fill="none" stroke={step >= 4 ? '#00FF9C' : '#6C63FF'} strokeWidth="2" filter="url(#circuit-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 4 ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <circle cx="350" cy="50" r="6" fill={step >= 4 ? '#00FF9C' : '#6C63FF'} />
          <circle cx="350" cy="150" r="6" fill={step >= 4 ? '#00FF9C' : '#6C63FF'} />
        </g>

        {step >= 5 && (
          <motion.path d="M 350 50 L 380 100 L 350 150" fill="none" stroke="#A78BFA" strokeWidth="4" filter="url(#circuit-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
        )}
      </svg>
      
      <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#00FF9C', fontWeight: 600 }}>
          {step === 0 ? 'AWAITING INIT' :
           step === 1 ? 'COMPILING CONSTRAINTS...' :
           step === 2 ? 'SNARK PROVER ACTIVE' :
           step === 3 ? 'WITNESS GENERATED' :
           step === 4 ? 'GROTH16 PROOF CREATED' : 'POLYGON ANCHOR COMPLETE'}
        </p>
      </div>
    </motion.div>
  )
}

type ProofStatus = 'idle' | 'generating' | 'ready' | 'shared';

export default function ZKProofPage() {
  const [status, setStatus] = useState<ProofStatus>('idle');
  const [selectedLender, setSelectedLender] = useState('');
  const [selectedClaims, setSelectedClaims] = useState<string[]>(['trustScore', 'income']);
  const [proofId, setProofId] = useState('');
  const [proofHash, setProofHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareStep, setShareStep] = useState(0);

  const CLAIMS = [
    { id: 'trustScore', label: 'TrustScore Range', desc: 'Prove score >= 650 without revealing exact value', icon: Activity },
    { id: 'income', label: 'Income Consistency', desc: 'Prove 12+ months consistent income', icon: IndianRupee },
    { id: 'identity', label: 'Aadhaar Verified', desc: 'Prove Aadhaar verification without sharing number', icon: ShieldCheck },
    { id: 'employment', label: 'Platform Employment', desc: 'Prove active employment on registered platforms', icon: Activity },
    { id: 'eshram', label: 'e-Shram Registered', desc: 'Prove government worker registration', icon: Building2 },
  ];

  const toggleClaim = (id: string) => {
    setSelectedClaims(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const generateProof = async () => {
    if (!selectedLender) return;
    setStatus('generating');
    setShareStep(0);
    const steps = ['Compiling circuit constraints...', 'Running zk-SNARK prover...', 'Generating witness...', 'Creating Groth16 proof...', 'Anchoring on Polygon...'];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setShareStep(i + 1);
    }
    const id = `ZKP-${Date.now().toString(36).toUpperCase()}`;
    const enc = jlynEncrypt(JSON.stringify({ workerId: MOCK_WORKER.id, claims: selectedClaims, lender: selectedLender, timestamp: Date.now() }));
    setProofId(id);
    setProofHash('0x' + enc.key.slice(0, 40));
    setStatus('ready');
  };

  const shareProof = async () => {
    setStatus('shared');
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell title="ZK Proof" subtitle="Share proof of creditworthiness - zero raw data exposed">
      <div className="zk-proof-grid">

        {/* Left — Config panel */}
        <div className="flex flex-col gap-8">

          {/* Lender selector */}
          <div className="glass-card p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={20} color="var(--accent-secondary)" />
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: 0 }}>Target Institution</h3>
            </div>
            <div className="credential-vault-grid">
              {LENDERS.map(lender => (
                <motion.button
                  key={lender}
                  onClick={() => setSelectedLender(lender)}
                  style={{
                    padding: '14px 18px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    background: selectedLender === lender ? 'rgba(108,99,255,0.2)' : 'rgba(17,24,39,0.6)',
                    border: `1px solid ${selectedLender === lender ? 'rgba(108,99,255,0.5)' : 'rgba(108,99,255,0.12)'}`,
                    color: selectedLender === lender ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.85rem', fontWeight: selectedLender === lender ? 700 : 500,
                    boxShadow: selectedLender === lender ? '0 0 20px rgba(108,99,255,0.3)' : 'none',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Activity size={14} style={{ display: 'inline', marginRight: 10, opacity: 0.6 }} /> {lender}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Claim selector */}
          <div className="glass-card p-8 flex flex-col gap-6">
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: 0 }}>Select Claims to Prove</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: -12 }}>
              Zero-Knowledge Proofs verify these claims without exposing underlying data
            </p>
            <div className="flex flex-col gap-4">
              {CLAIMS.map(claim => (
                <motion.div
                  key={claim.id}
                  onClick={() => toggleClaim(claim.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 18, padding: '16px 20px',
                    borderRadius: 14, cursor: 'pointer',
                    background: selectedClaims.includes(claim.id) ? 'rgba(108,99,255,0.12)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${selectedClaims.includes(claim.id) ? 'rgba(108,99,255,0.4)' : 'rgba(108,99,255,0.1)'}`,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: selectedClaims.includes(claim.id) ? 'rgba(108,99,255,0.3)' : 'rgba(108,99,255,0.08)',
                    border: `1px solid ${selectedClaims.includes(claim.id) ? '#6C63FF' : 'rgba(108,99,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selectedClaims.includes(claim.id)
                      ? <CheckCircle size={18} color="#6C63FF" />
                      : <claim.icon size={18} color="var(--text-muted)" />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: selectedClaims.includes(claim.id) ? '#fff' : 'var(--text-secondary)' }}>
                      {claim.label}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{claim.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <motion.button
            className="btn-primary"
            style={{ justifyContent: 'center', padding: '18px', fontSize: '1rem', opacity: (!selectedLender || selectedClaims.length === 0) ? 0.5 : 1 }}
            onClick={generateProof}
            disabled={!selectedLender || selectedClaims.length === 0 || status === 'generating' || status === 'ready' || status === 'shared'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'generating' ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
            {status === 'generating' ? 'Generating Secure Proof...' : 'Generate ZK Proof'}
            {status === 'idle' && <ChevronRight size={18} />}
          </motion.button>

          {/* Generation progress */}
          <AnimatePresence>
            {status === 'generating' && (
              <CircuitAnimation step={shareStep} />
            )}
          </AnimatePresence>
          
          {/* Filler UI: Network Status */}
          <div className="glass-card p-5 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Decentralized Verifier Network</p>
              <Activity size={14} color="#00FF9C" />
            </div>
            <div className="flex flex-col gap-3">
              {[
                { node: 'Polygon Mainnet RPC', status: 'Optimal', ping: '12ms' },
                { node: 'IPFS Gateway (Pinata)', status: 'Optimal', ping: '45ms' },
                { node: 'Polygon ID Issuer', status: 'Optimal', ping: '28ms' }
              ].map(n => (
                <div key={n.node} className="flex justify-between items-center" style={{ fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{n.node}</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#00FF9C' }}>{n.status}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>{n.ping}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filler UI: Key Rotation */}
          <div className="glass-card p-5 mt-5">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Key Rotation Policy</p>
              <Lock size={14} color="var(--text-muted)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 12 }}>Ed25519 proving keys auto-rotate</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Current Epoch</p>
                <p style={{ fontFamily: 'JetBrains Mono', color: '#00FF9C', fontSize: '0.8rem', marginTop: 2 }}>EP-942</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Next Rotation</p>
                <p style={{ fontFamily: 'JetBrains Mono', color: '#A78BFA', fontSize: '0.8rem', marginTop: 2 }}>02:14:59</p>
              </div>
            </div>
          </div>

          {/* Filler UI: Validator Nodes */}
          <div className="glass-card p-5 mt-5 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Network Validators</p>
                <Activity size={14} color="#F5C518" />
             </div>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Nodes</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>1,248</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Online Consensus</span>
                <span style={{ color: '#00FF9C', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>99.98%</span>
             </div>
          </div>
        </div>

        {/* Right — Shield + Proof result */}
        <div className="flex flex-col gap-5 items-center">
          {/* Shield */}
          <div className="glass-card p-8 w-full flex flex-col items-center gap-6">
            <ZKProofShield active={status === 'ready' || status === 'shared'} verifying={status === 'generating'} size="md" />

            <AnimatePresence>
              {(status === 'ready' || status === 'shared') && (
                <motion.div className="w-full flex flex-col gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="divider" />
                  <div className="flex flex-col gap-2">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>PROOF ID</p>
                    <div className="flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(108,99,255,0.15)' }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#00FF9C' }}>{proofId}</span>
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => copy(proofId)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {copied ? <CheckCircle size={14} color="#00FF9C" /> : <Copy size={14} color="var(--text-muted)" />}
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>PROOF HASH</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#A78BFA', wordBreak: 'break-all', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(108,99,255,0.12)' }}>{proofHash}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>CLAIMS PROVEN</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedClaims.map(c => (
                          <span key={c} className="badge badge-success" style={{ fontSize: '0.65rem' }}><CheckCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {CLAIMS.find(cl => cl.id === c)?.label}</span>
                      ))}
                    </div>
                  </div>
                  {status === 'ready' && (
                    <motion.button className="btn-primary" style={{ justifyContent: 'center', background: 'linear-gradient(135deg,#00c97a,#00FF9C)', color: '#0A0F1E' }} onClick={shareProof} whileHover={{ scale: 1.02 }}>
                      <Send size={15} /> Send to {selectedLender.split(' ')[0]}
                    </motion.button>
                  )}
                  {status === 'shared' && (
                    <motion.div
                      style={{ textAlign: 'center', padding: '12px', background: 'rgba(0,255,156,0.08)', border: '1px solid rgba(0,255,156,0.25)', borderRadius: 10 }}
                      initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                    >
                      <p style={{ color: '#00FF9C', fontWeight: 700 }}><CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }} /> Proof Delivered!</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>{selectedLender} has received your ZK-Proof and will respond within 24 hours</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {status === 'idle' && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', maxWidth: 260 }}>
                Select a lender and claims, then generate a cryptographic proof that reveals nothing but the truth
              </p>
            )}
          </div>

          {/* Proof History Log */}
          <div className="glass-card p-5 w-full flex flex-col gap-4 mt-auto">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Proof History Log</p>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>Last 30 Days</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { to: 'HDFC Bank', date: '2 days ago', status: 'Active' },
                { to: 'SBI (State Bank of India)', date: '1 week ago', status: 'Expired' },
                { to: 'Uber Onboarding', date: '3 weeks ago', status: 'Active' }
              ].map((h, i) => (
                <div key={i} className="flex justify-between items-center pb-2 border-b border-white/5" style={{ fontSize: '0.75rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.to}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{h.date}</p>
                  </div>
                  <span style={{ color: h.status === 'Active' ? '#00FF9C' : 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Minimization Metrics */}
          <div className="glass-card p-5 w-full flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Data Exposure Prevented</p>
                <ShieldCheck size={14} color="#6C63FF" />
             </div>
             <div className="flex flex-col gap-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Aadhaar Number</span>
                  <span style={{ color: '#00FF9C', fontWeight: 600 }}>100% Protected</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Exact Income Values</span>
                  <span style={{ color: '#00FF9C', fontWeight: 600 }}>100% Protected</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Home Address</span>
                  <span style={{ color: '#00FF9C', fontWeight: 600 }}>100% Protected</span>
                </div>
                <div style={{ height: 4, background: 'rgba(0,255,156,0.1)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
                   <div style={{ height: '100%', width: '100%', background: '#00FF9C' }} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
