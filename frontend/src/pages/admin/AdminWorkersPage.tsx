/**
 * NAMASTE — Admin Workers Page
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, UserCheck, MapPin, Building2, Smartphone, Activity, Terminal } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_ADMIN_STATS } from '@/lib/mockData';

export default function AdminWorkersPage() {
  const workers = [
    { id: 'W-2024-MH-00781', name: 'Rajesh Kumar Sharma', role: 'Delivery Executive', loc: 'Mumbai, MH', did: 'did:poly:0x7f3...3b9C', score: 742 },
    { id: 'W-2024-DL-00892', name: 'Amit Singh', role: 'Home Services', loc: 'Delhi, DL', did: 'did:poly:0x8e4...4c2A', score: 698 },
    { id: 'W-2024-KA-01456', name: 'Meera Krishnan', role: 'Domestic Helper', loc: 'Bengaluru, KA', did: 'did:poly:0x2a1...9d8E', score: 612 },
    { id: 'W-2024-TN-00234', name: 'Suresh Kumar', role: 'Auto Driver', loc: 'Chennai, TN', did: 'did:poly:0x9c5...2b4F', score: 558 },
    { id: 'W-2024-UP-03821', name: 'Pooja Verma', role: 'Delivery Executive', loc: 'Lucknow, UP', did: 'did:poly:0x3b8...7e1D', score: 715 },
    { id: 'W-2024-WB-04912', name: 'Ravi Das', role: 'Construction Worker', loc: 'Kolkata, WB', did: 'did:poly:0x5d2...8a3C', score: 480 },
    { id: 'W-2024-WB-04912', name: 'Ravi Das', role: 'Construction Worker', loc: 'Kolkata, WB', did: 'did:poly:0x5d2...8a3C', score: 480 },
  ];

  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    const events = [
      'DID 0x8e4...4c2A verified',
      'TrustScore updated for W-2024-TN',
      'New node connected: Mumbai_04',
      'Dividend batch settled (12 peers)',
      'Jlyn* Cipher sync complete',
    ];
    const interval = setInterval(() => {
      setLogs(prev => [events[Math.floor(Math.random() * events.length)], ...prev].slice(0, 5));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell title="Worker Registry" subtitle="Global overview of onboarded informal workers">
      <div className="flex flex-col gap-6">

        {/* Stats */}
        <div className="stats-grid-3">
          <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={20} color="#6C63FF" /></div>
              <div><p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.6rem', color: '#6C63FF', lineHeight: 1 }}>{MOCK_ADMIN_STATS.totalWorkers.toLocaleString()}</p><p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3 }}>Total Workers Onboarded</p></div>
            </div>
          </motion.div>
          <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,255,156,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={20} color="#00FF9C" /></div>
              <div><p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.6rem', color: '#00FF9C', lineHeight: 1 }}>{MOCK_ADMIN_STATS.activeCredentials.toLocaleString()}</p><p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3 }}>Active Credentials Issued</p></div>
            </div>
          </motion.div>
          <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,197,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Smartphone size={20} color="#F5C518" /></div>
              <div><p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.6rem', color: '#F5C518', lineHeight: 1 }}>14.2%</p><p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3 }}>Onboarded via USSD Kiosk</p></div>
            </div>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Table Controls */}
          <div className="glass-card p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 w-1/2">
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-glass" style={{ paddingLeft: 34, paddingRight: 12, paddingBottom: 8, paddingTop: 8, fontSize: '0.8rem' }} placeholder="Search by name, ID, or phone" />
              </div>
              <button className="btn-secondary" style={{ padding: '8px 12px' }}><Filter size={14} /> Filter</button>
            </div>
            <button className="btn-primary" style={{ padding: '8px 16px' }}><Download size={14} /> Export CSV</button>
          </div>

          <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  {['Worker Name & ID', 'Role & Location', 'Polygon DID', 'TrustScore', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(108,99,255,0.15)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(108,99,255,0.06)' }}>
                    <td style={{ padding: '12px 12px' }}>
                      <p style={{ fontWeight: 600 }}>{w.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'JetBrains Mono' }}>{w.id}</p>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <p style={{ color: 'var(--text-secondary)' }}>{w.role}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><MapPin size={10} /> {w.loc}</p>
                    </td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#6C63FF' }}>{w.did}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: w.score >= 700 ? '#00FF9C' : w.score >= 600 ? '#A78BFA' : '#F5C518' }}>{w.score}</span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column - Live Telemetry & Heatmap */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Node Heatmap</p>
              <Activity size={14} color="#00FF9C" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4, padding: '10px 0' }}>
              {Array.from({ length: 72 }).map((_, i) => {
                const isActive = Math.random() > 0.7;
                return (
                  <motion.div
                    key={i}
                    style={{ aspectRatio: '1', background: isActive ? '#00FF9C' : 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                    animate={{ opacity: isActive ? [0.4, 1, 0.4] : 1 }}
                    transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
                  />
                )
              })}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Live regional worker activity density</p>
          </div>

          <div className="glass-card p-5 flex flex-col gap-4" style={{ border: '1px solid rgba(108,99,255,0.2)' }}>
            <div className="flex items-center gap-2">
              <Terminal size={14} color="#A78BFA" />
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#A78BFA' }}>Live Telemetry</p>
            </div>
            <div className="flex flex-col gap-3 font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {logs.map((log, i) => (
                <motion.div 
                  key={`${i}-${log}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1 - (i * 0.2), x: 0 }}
                  style={{ borderLeft: '2px solid #A78BFA', paddingLeft: 10 }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>[{new Date().toLocaleTimeString()}]</span> {log}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </AppShell>
  );
}
