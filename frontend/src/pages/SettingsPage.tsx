/**
 * NAMASTE - Settings Page
 * Consent management, data source toggles, language selector.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, CheckCircle, Database, Globe, RefreshCw, Shield, Smartphone } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_WORKER } from '@/lib/mockData';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <motion.div
      onClick={onToggle}
      style={{ width: 48, height: 26, borderRadius: 8, background: enabled ? 'linear-gradient(90deg,#00b8ff,#2ef2a5)' : 'rgba(160,190,220,0.13)', border: `1px solid ${enabled ? 'rgba(46,242,165,0.44)' : 'rgba(160,190,220,0.16)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 3, flexShrink: 0 }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        style={{ width: 18, height: 18, borderRadius: 6, background: enabled ? '#06101b' : '#b8c7d8', boxShadow: '0 1px 4px rgba(0,0,0,0.28)' }}
        animate={{ x: enabled ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </motion.div>
  );
}

const SECTIONS = [
  {
    id: 'data',
    title: 'Data Consent Pipelines',
    icon: Database,
    color: '#00b8ff',
    items: [
      { id: 'swiggy', label: 'Swiggy Order & Route Data', desc: 'Delivery route, completion rate, ratings', default: true },
      { id: 'urbancompany', label: 'Urban Company Service Data', desc: 'Job completions, customer ratings, tenure', default: true },
      { id: 'phonepay', label: 'PhonePe Transaction Signals', desc: 'Payment regularity, wallet usage patterns', default: true },
      { id: 'rapido', label: 'Rapido Location & Trip Data', desc: 'Trip completion, area coverage', default: false },
      { id: 'ondc', label: 'ONDC Platform Data Portability', desc: 'Cross-platform order history', default: false },
      { id: 'upi', label: 'UPI Consent Manager', desc: 'Direct income signal from UPI transactions', default: true },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    color: '#ffd166',
    items: [
      { id: 'dividend', label: 'Dividend Payments', desc: 'Alert when data dividend is credited', default: true },
      { id: 'vouch', label: 'Peer Vouch Requests', desc: 'When someone requests a vouch from you', default: true },
      { id: 'lender', label: 'Lender Verification Results', desc: 'When a lender verifies your ZK-Proof', default: true },
      { id: 'trustscore', label: 'TrustScore Updates', desc: 'Weekly score recalculation alerts', default: false },
    ],
  },
  {
    id: 'security',
    title: 'Privacy & Security',
    icon: Shield,
    color: '#2ef2a5',
    items: [
      { id: 'zkonly', label: 'ZK-Proof Only Mode', desc: 'Lenders can only see proof, never raw data', default: true },
      { id: 'consentlog', label: 'Consent Audit Log', desc: 'Track every data access event on-chain', default: true },
      { id: 'biometric', label: 'Biometric App Lock', desc: 'Require fingerprint or face unlock to open app', default: false },
    ],
  },
];

const LANGUAGES = ['English', 'हिन्दी', 'मराठी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'ಕನ್ನಡ', 'ਪੰਜਾਬੀ'];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SECTIONS.forEach(section => section.items.forEach(item => { init[item.id] = item.default; }));
    return init;
  });
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => setToggles(prev => ({ ...prev, [id]: !prev[id] }));

  const save = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell title="Settings" subtitle="Consent management and privacy controls">
      <div className="settings-layout">
        <div className="flex flex-col gap-5">
          <motion.div className="glass-card p-6 flex flex-col gap-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4">
              <div style={{ width: 58, height: 58, borderRadius: 8, background: 'linear-gradient(135deg,#00b8ff,#2ef2a5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#06101b', fontSize: '1.35rem', flexShrink: 0 }}>
                {MOCK_WORKER.name.charAt(0)}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 800, fontSize: '1rem' }}>{MOCK_WORKER.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{MOCK_WORKER.id}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{MOCK_WORKER.phone} · {MOCK_WORKER.email}</p>
              </div>
            </div>
            <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}><CheckCircle size={10} /> Verified profile</span>
          </motion.div>

          <motion.div className="glass-card p-6 flex flex-col gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="flex items-center gap-2">
              <Globe size={16} color="#8b5cf6" />
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Language</p>
            </div>
            <div className="credential-vault-grid" style={{ gap: 8 }}>
              {LANGUAGES.map(lang => (
                <motion.button key={lang} onClick={() => setLanguage(lang)}
                  style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', background: language === lang ? 'rgba(139,92,246,0.16)' : 'rgba(255,255,255,0.035)', color: language === lang ? '#d8c8ff' : 'var(--text-secondary)', border: `1px solid ${language === lang ? 'rgba(139,92,246,0.42)' : 'rgba(160,190,220,0.12)'}`, fontWeight: 700 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ padding: '16px 18px', background: 'rgba(255,209,102,0.07)', border: '1px solid rgba(255,209,102,0.22)', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 12 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Smartphone size={16} color="#ffd166" style={{ flexShrink: 0, marginTop: 3 }} />
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffd166' }}>USSD and kiosk access</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: 4, lineHeight: 1.5 }}>
                Dial <span className="font-mono" style={{ color: '#ffd166', fontWeight: 800 }}>*99#</span> from any mobile, or use a CSC kiosk to reach the same wallet controls.
              </p>
            </div>
          </motion.div>

          <motion.div style={{ padding: '16px 18px', background: 'rgba(255,92,122,0.06)', border: '1px solid rgba(255,92,122,0.22)', borderRadius: 8 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={15} color="#ff5c7a" />
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ff5c7a' }}>Account controls</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '8px 16px', borderColor: 'rgba(255,92,122,0.3)', color: '#ff9bad' }}>Export My Data</button>
              <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '8px 16px', borderColor: 'rgba(255,92,122,0.3)', color: '#ff9bad' }}>Delete Account</button>
            </div>
          </motion.div>

          <motion.button
            className="btn-primary"
            style={{ justifyContent: 'center', width: '100%', background: saved ? 'linear-gradient(135deg,#00b8ff,#2ef2a5)' : undefined }}
            onClick={save}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {saved ? <><CheckCircle size={16} /> Saved</> : <><RefreshCw size={15} /> Save Settings</>}
          </motion.button>
        </div>

        <div className="flex flex-col gap-5">
          {SECTIONS.map((section, sectionIndex) => (
            <motion.div key={section.id} className="glass-card p-6 flex flex-col gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sectionIndex * 0.08 + 0.1 }}>
              <div className="flex items-center gap-2">
                <section.icon size={16} color={section.color} />
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{section.title}</p>
              </div>
              <div className="app-grid-2-even" style={{ gap: 12 }}>
                {section.items.map((item, itemIndex) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: sectionIndex * 0.08 + itemIndex * 0.05 + 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px', borderRadius: 8, background: toggles[item.id] ? 'rgba(0,184,255,0.06)' : 'rgba(0,0,0,0.16)', border: `1px solid ${toggles[item.id] ? 'rgba(0,184,255,0.2)' : 'rgba(160,190,220,0.08)'}` }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.86rem', fontWeight: 700, color: toggles[item.id] ? '#fff' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</p>
                    </div>
                    <Toggle enabled={toggles[item.id]} onToggle={() => toggle(item.id)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
