import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Phone,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NodeMeshBackground from '@/components/ui/NodeMeshBackground';
import { useWorkerStore } from '@/store/useStore';
import { MOCK_WORKER } from '@/lib/mockData';

const STEPS: Array<{ id: number; label: string; icon: LucideIcon }> = [
  { id: 0, label: 'Identify', icon: Phone },
  { id: 1, label: 'Mint DID', icon: Key },
  { id: 2, label: 'Wallet', icon: Wallet },
  { id: 3, label: 'Ready', icon: CheckCircle },
];



function WizardHeader({
  icon: Icon,
  eyebrow,
  title,
  copy,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color="var(--accent-secondary)" />
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{eyebrow}</p>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.65rem', letterSpacing: 0, marginBottom: 6 }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.58 }}>{copy}</p>
      </div>
    </div>
  );
}

function DataStreamVisualizer() {
  const columns = 8;
  const rows = 6;
  const [matrix, setMatrix] = useState<string[][]>([]);

  useEffect(() => {
    const initMatrix = Array.from({ length: columns }, () => 
      Array.from({ length: rows }, () => Math.random().toString(16).substring(2, 4).toUpperCase())
    );
    setMatrix(initMatrix);

    const interval = setInterval(() => {
      setMatrix(prev => prev.map(col => {
        if (Math.random() > 0.25) {
          return [Math.random().toString(16).substring(2, 4).toUpperCase(), ...col.slice(0, rows - 1)];
        }
        return col;
      }));
    }, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8, overflow: 'hidden', padding: '10px 0', background: 'radial-gradient(circle at center, rgba(0,255,156,0.05) 0%, transparent 70%)', borderRadius: 12 }}>
      
      {/* Matrix code stream */}
      <div style={{ position: 'absolute', inset: 0, padding: '0 10px', display: 'flex', justifyContent: 'space-between', opacity: 0.85 }}>
        {matrix.map((col, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: i % 3 === 0 ? '#00FF9C' : 'var(--text-muted)', fontWeight: i % 3 === 0 ? 800 : 500 }}>
            {col.map((cell, j) => (
              <motion.span 
                key={`${i}-${j}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 - (j * 0.15) }}
              >
                {cell}
              </motion.span>
            ))}
          </div>
        ))}
      </div>

      {/* Scanning laser line */}
      <motion.div 
        style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#00FF9C', boxShadow: '0 0 15px #00FF9C', opacity: 0.6, zIndex: 1 }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2.5, ease: 'linear', repeat: Infinity }}
      />

      {/* Footer Info overlay */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(0,255,156,0.2)', background: 'linear-gradient(to top, var(--bg-primary) 10%, transparent)' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 2 }}>NODE SYNC</div>
            <motion.div style={{ fontSize: '0.8rem', color: '#00FF9C', fontWeight: 700 }} animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>OPTIMAL</motion.div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 2 }}>PEER HASH</div>
            <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>0x8F2...9C</div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
        >
          <Activity size={18} color="#00FF9C" />
        </motion.div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setWorker, setAuthenticated, setOnboarded } = useWorkerStore();

  const [step, setStep] = useState(0);
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [did, setDid] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (aadhaar.replace(/\s/g, '').length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setOtpSent(true);
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit verification code');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep(1);
  };

  const createDid = async () => {
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1300));
    const generated = `did:polygon:0x${Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('')}`;
    setDid(generated);
    setLoading(false);
    setStep(2);
  };

  const setupWallet = async () => {
    if (!upiId.includes('@')) {
      setError('Enter a valid UPI ID, for example name@upi');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep(3);
  };

  const finish = () => {
    setWorker({ ...MOCK_WORKER, did, upiId: upiId || MOCK_WORKER.upiId });
    setAuthenticated(true);
    setOnboarded(true);
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-shell">
      <NodeMeshBackground />

      <div className="onboarding-layout">
        <motion.section className="onboarding-intro" initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
          <div className="onboarding-brand-row">
            <div className="onboarding-brand-mark">
              <Activity size={28} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '2rem', letterSpacing: 0 }}>NAMASTE</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 800 }}>DIGITAL TRUST PASSPORT</p>
            </div>
          </div>

          <div>
            <h2 className="onboarding-title">Your work history, rebuilt as a private trust layer.</h2>
            <p className="onboarding-copy" style={{ marginTop: 18 }}>
              Verify identity, mint a private DID, and connect payouts through a spacious flow that feels less like paperwork and more like activating a control room.
            </p>
          </div>

          <div className="onboarding-feature-grid">
            {[
              { label: 'Verified ID', icon: ShieldCheck, color: '#00FF9C' },
              { label: 'Private DID', icon: Key, color: '#A78BFA' },
              { label: 'Payout Ready', icon: Wallet, color: '#F5C518' },
            ].map(feature => {
              const FeatureIcon = feature.icon;
              return (
                <div key={feature.label} className="onboarding-feature-pill">
                  <FeatureIcon size={16} color={feature.color} style={{ flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feature.label}</span>
                </div>
              );
            })}
          </div>

          <div className="onboarding-map-card">
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.1em' }}>LIVE DATA STREAM</p>
              <span className="badge badge-success" style={{ fontSize: '0.66rem' }}>Active</span>
            </div>
            <DataStreamVisualizer />
          </div>
        </motion.section>

        <motion.section className="onboarding-wizard-shell" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}>
          <div className="onboarding-stepper" aria-label="Onboarding progress">
            {STEPS.map((item, i) => {
              const StepIcon = item.icon;
              const statusClass = i < step ? ' is-complete' : i === step ? ' is-active' : '';
              return (
                <div key={item.id} className={`onboarding-step-item${statusClass}`}>
                  <div className="onboarding-step-icon">
                    {i < step ? <CheckCircle size={16} color="#00FF9C" /> : <StepIcon size={16} color={i === step ? '#fff' : 'var(--text-muted)'} />}
                  </div>
                  <span className="onboarding-step-label">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="glass-card onboarding-card">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-6">
                  <WizardHeader icon={Phone} eyebrow="Step 1" title="Verify identity" copy="Start with a clean identity check so your trust passport can be issued to the right worker." />

                  <div className="flex flex-col gap-3">
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em' }}>AADHAAR NUMBER</label>
                    <input
                      className="input-glass font-mono"
                      style={{ fontSize: '1rem', padding: '15px 18px', letterSpacing: '0.1em', lineHeight: 1.4 }}
                      placeholder="0000 0000 0000"
                      maxLength={14}
                      value={aadhaar}
                      onChange={event => {
                        const val = event.target.value.replace(/\D/g, '').slice(0, 12);
                        setAadhaar(val.replace(/(.{4})/g, '$1 ').trim());
                      }}
                    />
                  </div>

                  {otpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-3">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em' }}>VERIFICATION CODE</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="input-glass font-mono"
                          style={{ fontSize: '1rem', padding: '15px 52px 15px 18px', letterSpacing: '0.32em', lineHeight: 1.4 }}
                          placeholder="000000"
                          type={showOtp ? 'text' : 'password'}
                          maxLength={6}
                          value={otp}
                          onChange={event => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                        <button type="button" onClick={() => setShowOtp(!showOtp)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                          {showOtp ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
                        </button>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Default test code: <span className="font-mono" style={{ color: '#F5C518', fontWeight: 800 }}>123456</span></p>
                    </motion.div>
                  )}

                  {error && <p style={{ color: '#FF4D6A', fontSize: '0.86rem', fontWeight: 700 }}>{error}</p>}

                  <button className="btn-primary" onClick={otpSent ? verifyOtp : sendOtp} disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '0.95rem' }}>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : otpSent ? 'Authorize and continue' : 'Request access code'}
                    {!loading && <ChevronRight size={18} />}
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-6">
                  <WizardHeader icon={Key} eyebrow="Step 2" title="Mint private DID" copy="Your decentralized identifier is generated locally, then anchored to the Polygon trust registry." />

                  <div className="onboarding-detail-panel">
                    {[
                      ['Standard', 'W3C DID v1.0'],
                      ['Network', 'Polygon Proof-of-Stake'],
                      ['Key type', 'Ed25519'],
                      ['Integrity', 'Jlyn* Merkle witness'],
                    ].map(([label, value]) => (
                      <div key={label} className="onboarding-detail-row">
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.86rem', fontWeight: 600 }}>{label}</span>
                        <span className="onboarding-value" style={{ color: 'var(--accent-secondary)', fontSize: '0.86rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary" onClick={createDid} disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '0.95rem' }}>
                    {loading ? (<><Loader2 size={20} className="animate-spin" /> Committing identity...</>) : (<>Generate identity <ChevronRight size={18} /></>)}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col gap-6">
                  <WizardHeader icon={Wallet} eyebrow="Step 3" title="Connect settlement" copy="Add the UPI address where approved data dividends and payouts should settle." />

                  <div style={{ background: 'rgba(0,255,156,0.05)', border: '1px solid rgba(0,255,156,0.18)', borderRadius: 12, padding: 16 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: 8 }}>YOUR DID</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#00FF9C', wordBreak: 'break-all', lineHeight: 1.6 }}>{did}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em' }}>UPI ADDRESS</label>
                    <input className="input-glass font-mono" style={{ fontSize: '1rem', padding: '15px 18px', lineHeight: 1.4 }} placeholder="username@handle" value={upiId} onChange={event => setUpiId(event.target.value)} />
                  </div>

                  {error && <p style={{ color: '#FF4D6A', fontSize: '0.86rem', fontWeight: 700 }}>{error}</p>}

                  <button className="btn-primary btn-success" onClick={setupWallet} disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '0.95rem', color: '#0A0F1E' }}>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <>Activate settlement <ChevronRight size={18} /></>}
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center">
                  <motion.div
                    style={{ width: 92, height: 92, borderRadius: '50%', background: 'rgba(0,255,156,0.1)', border: '2px solid rgba(0,255,156,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    animate={{ boxShadow: ['0 0 18px rgba(0,255,156,0.16)', '0 0 42px rgba(0,255,156,0.35)', '0 0 18px rgba(0,255,156,0.16)'] }}
                    transition={{ duration: 2.6, repeat: Infinity }}
                  >
                    <CheckCircle size={44} color="#00FF9C" strokeWidth={1.6} />
                  </motion.div>

                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Passport ready</p>
                    <h2 style={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '2rem', color: '#00FF9C', letterSpacing: 0 }}>Node activated</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '1rem', fontWeight: 500, lineHeight: 1.55 }}>Welcome, {MOCK_WORKER.name.split(' ')[0]}. Your private dashboard is ready.</p>
                  </div>

                  <div className="onboarding-complete-list" style={{ width: '100%' }}>
                    {[
                      ['Blockchain DID', 'Minted'],
                      ['Trust Score', '742 / 900'],
                      ['Settlement', 'Active'],
                    ].map(([label, value]) => (
                      <div key={label} className="onboarding-complete-row">
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 700 }}>{label}</span>
                        <span className="onboarding-value" style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} onClick={finish}>
                    Enter dashboard <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
