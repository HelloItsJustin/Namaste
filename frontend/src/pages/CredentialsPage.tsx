/**
 * NAMASTE — Credentials Page
 * Full list of Verifiable Credentials with details modal
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Copy, CheckCircle, Lock, Shield, IdCard, Bike, IndianRupee, Building, Users, Wrench, Activity } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import CredentialCard from '@/components/ui/CredentialCard';
import { MOCK_CREDENTIALS } from '@/lib/mockData';
import { truncateHash } from '@/lib/jlynCipher';

const IconMap: Record<string, any> = {
  IdCard,
  Bike,
  IndianRupee,
  Building,
  Users,
  Wrench,
};

const TYPE_COLORS: Record<string, string> = {
  IdentityCredential: '#6C63FF',
  EmploymentCredential: '#F5C518',
  IncomeCredential: '#00FF9C',
  GovernmentCredential: '#A78BFA',
  VouchCredential: '#FF9C6E',
  PlatformCredential: '#38BDF8',
};

export default function CredentialsPage() {
  const [selected, setSelected] = useState<typeof MOCK_CREDENTIALS[0] | null>(null);
  const [copied, setCopied] = useState('');

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <AppShell title="Credentials" subtitle="Your Verifiable Credential portfolio">
      <div className="flex flex-col gap-6">

        {/* Header stats */}
        <div className="credential-stats-grid">
          {[
            { label: 'Verified Credentials', value: String(MOCK_CREDENTIALS.length), color: '#00FF9C', icon: CheckCircle },
            { label: 'Secure Encryption', value: '100%', color: '#F5C518', icon: Lock },
            { label: 'Blockchain Anchors', value: String(MOCK_CREDENTIALS.length), color: '#6C63FF', icon: Shield },
          ].map((s) => (
            <motion.div key={s.label} className="glass-card credential-stat-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label.toUpperCase()}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Credential grid */}
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 20 }}>SOVEREIGN ASSET VAULT</p>
          <div className="credential-vault-grid">
            {MOCK_CREDENTIALS.map((cred, i) => (
              <CredentialCard key={cred.id} credential={cred} index={i} onClick={() => setSelected(cred)} />
            ))}
          </div>
        </div>

        {/* IPFS notice */}
        <motion.div
          className="credential-notice"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          <Lock size={16} color="#6C63FF" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>All credentials encrypted with Jlyn* Cipher before IPFS upload</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3, overflowWrap: 'anywhere' }}>Raw credential data never leaves your device unencrypted · SHA-256 content addressing · Ed25519 signed</p>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              style={{ width: '100%', maxWidth: 520 }}
              className="glass-card p-7"
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                      const Icon = IconMap[selected.icon] || Activity;
                      const color = TYPE_COLORS[selected.type] ?? '#6C63FF';
                      return <Icon size={24} color={color} />;
                    })()}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem' }}>{selected.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 2 }}>{selected.type}</p>
                  </div>
                </div>
                <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setSelected(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="divider mb-5" />

              {/* Fields */}
              <div className="flex flex-col gap-3">
                {[
                  ['Issuer', selected.issuer],
                  ['Issued', new Date(selected.issuedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Expires', new Date(selected.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Status', selected.status.toUpperCase()],
                  ['Encryption', selected.encryptedWith + ' Cipher'],
                ].map(([k, v]) => (
                  <div key={k} className="credential-modal-field">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{k}</span>
                    <span className="credential-modal-value" style={{ color: k === 'Status' ? '#00FF9C' : 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}

                {/* IPFS Hash */}
                <div className="credential-modal-field">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>IPFS Hash</span>
                  <div className="flex items-center gap-2 credential-modal-value">
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'var(--accent-secondary)' }}>{truncateHash(selected.ipfsHash, 10)}</span>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => copy(selected.ipfsHash, 'ipfs')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {copied === 'ipfs' ? <CheckCircle size={13} color="#00FF9C" /> : <Copy size={13} color="var(--text-muted)" />}
                    </motion.button>
                  </div>
                </div>

                {/* On-chain hash */}
                <div className="credential-modal-field" style={{ borderBottom: 'none' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>On-chain Hash</span>
                  <div className="flex items-center gap-2 credential-modal-value">
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#6C63FF' }}>{selected.vcHash}</span>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => copy(selected.vcHash, 'vc')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {copied === 'vc' ? <CheckCircle size={13} color="#00FF9C" /> : <Copy size={13} color="var(--text-muted)" />}
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="divider my-5" />

              {/* VC Data Preview */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 14, border: '1px solid rgba(108,99,255,0.1)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em', marginBottom: 8 }}>DECRYPTED CREDENTIAL DATA</p>
                <pre style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#A78BFA', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(selected.data, null, 2)}
                </pre>
              </div>

              <div className="flex gap-3 mt-5">
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>
                  <ExternalLink size={14} /> View on Polygon
                </button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>
                  <Shield size={14} /> Generate ZK-Proof
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
