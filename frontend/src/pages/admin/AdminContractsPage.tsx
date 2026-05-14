/**
 * NAMASTE — Admin Contracts Page
 */
import { motion } from 'framer-motion';
import { Database, Zap, Clock, ShieldCheck, Activity } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_ADMIN_STATS } from '@/lib/mockData';

export default function AdminContractsPage() {
  const events = [
    { type: 'DividendDistributed', hash: '0xabc1...def4', worker: 'W-...00781', amount: '₹89.25', time: '2 mins ago', status: 'Success' },
    { type: 'TrustScoreUpdated', hash: '0x1a2b...3c4d', worker: 'W-...00892', amount: '-', time: '5 mins ago', status: 'Success' },
    { type: 'CredentialAnchored', hash: '0x9f8e...7d6c', worker: 'W-...01456', amount: '-', time: '12 mins ago', status: 'Success' },
    { type: 'DividendDistributed', hash: '0x5e4d...6c7b', worker: 'W-...00234', amount: '₹45.00', time: '18 mins ago', status: 'Success' },
    { type: 'VouchAnchored', hash: '0x2b3c...4d5e', worker: 'W-...03821', amount: '-', time: '22 mins ago', status: 'Success' },
  ];

  return (
    <AppShell title="Smart Contracts" subtitle="Polygon network status and on-chain events">
      <div className="flex flex-col gap-6">

        {/* Network Status */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} color="#00FF9C" />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Network Status: {MOCK_ADMIN_STATS.polygonNetwork}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#00FF9C15] border border-[#00FF9C30] rounded-full">
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF9C' }} />
              <span style={{ color: '#00FF9C', fontSize: '0.75rem', fontWeight: 600 }}>Healthy</span>
            </div>
          </div>
          
          <div className="contract-metric-grid">
            {[
              { label: 'Contract Address', value: `${MOCK_ADMIN_STATS.smartContractAddress.slice(0,10)}...`, icon: Database },
              { label: 'Latest Block', value: MOCK_ADMIN_STATS.blockNumber.toLocaleString(), icon: Clock },
              { label: 'Contract Balance', value: `₹${MOCK_ADMIN_STATS.contractBalance.toLocaleString()}`, icon: Zap },
              { label: 'Total Paid Out', value: `₹${MOCK_ADMIN_STATS.totalDividendsPaid.toLocaleString()}`, icon: ShieldCheck },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(108,99,255,0.05)', padding: 12, borderRadius: 10, border: '1px solid rgba(108,99,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={14} color="var(--text-muted)" />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{s.label}</span>
                </div>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '1.1rem', fontWeight: 700, color: '#A78BFA' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Logs */}
        <div className="glass-card p-6">
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 16 }}>Live On-Chain Events</p>
          <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  {['Event Type', 'Tx Hash', 'Worker ID', 'Data/Amount', 'Time', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(108,99,255,0.15)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ borderBottom: '1px solid rgba(108,99,255,0.06)' }}>
                    <td style={{ padding: '12px 12px', color: '#fff', fontWeight: 500 }}>{e.type}</td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono', color: '#6C63FF', fontSize: '0.75rem' }}>{e.hash}</td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{e.worker}</td>
                    <td style={{ padding: '12px 12px', color: e.amount !== '-' ? '#F5C518' : 'var(--text-muted)', fontWeight: e.amount !== '-' ? 600 : 400 }}>{e.amount}</td>
                    <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{e.time}</td>
                    <td style={{ padding: '12px 12px' }}><span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{e.status}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
