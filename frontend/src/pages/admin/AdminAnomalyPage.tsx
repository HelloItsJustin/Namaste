/**
 * NAMASTE — Behavioral Anomaly Detector Admin Page (Feature 2)
 * Shows flagged workers, risk profiles, and anomaly details.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_ANOMALY_FLAGS, MOCK_ANOMALY_STATS } from '@/lib/mockData';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const SEVERITY_META: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  critical: { icon: AlertCircle,  color: '#FF0000', bg: 'rgba(255,0,0,0.1)',      label: 'Critical' },
  high:     { icon: ShieldAlert,  color: '#FF4D6A', bg: 'rgba(255,77,106,0.1)',   label: 'High' },
  medium:   { icon: AlertTriangle,color: '#F5C518', bg: 'rgba(245,197,24,0.1)',   label: 'Medium' },
  low:      { icon: Info,         color: '#A78BFA', bg: 'rgba(167,139,250,0.1)',  label: 'Low' },
};

const CATEGORY_LABEL: Record<string, string> = {
  vouching: 'Vouching',
  score:    'Score Gaming',
  identity: 'Identity',
  session:  'Session',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Flag card
// ---------------------------------------------------------------------------
function FlagCard({ flag, index }: { flag: typeof MOCK_ANOMALY_FLAGS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [resolved, setResolved] = useState(flag.resolved);
  const meta = SEVERITY_META[flag.severity] ?? SEVERITY_META.low;
  const SevIcon = meta.icon;

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{
        border: resolved
          ? '1px solid rgba(0,255,156,0.15)'
          : `1px solid ${meta.color}30`,
        opacity: resolved ? 0.65 : 1,
      }}
    >
      {/* Summary row */}
      <div
        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Severity icon */}
        <div style={{ width: 40, height: 40, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SevIcon size={20} color={meta.color} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-3 flex-wrap">
            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{flag.title}</p>
            <span style={{ padding: '2px 8px', background: meta.bg, color: meta.color, fontSize: '0.65rem', fontWeight: 700, borderRadius: 6 }}>
              {meta.label}
            </span>
            <span style={{ padding: '2px 8px', background: 'rgba(108,99,255,0.1)', color: '#A78BFA', fontSize: '0.65rem', fontWeight: 700, borderRadius: 6 }}>
              {CATEGORY_LABEL[flag.category] ?? flag.category}
            </span>
            {resolved && (
              <span style={{ padding: '2px 8px', background: 'rgba(0,255,156,0.1)', color: '#00FF9C', fontSize: '0.65rem', fontWeight: 700, borderRadius: 6 }}>
                Resolved
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 3 }}>
            {flag.worker_name} · {flag.worker_id} · {formatDate(flag.detected_at)}
          </p>
        </div>

        {/* Expand toggle */}
        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(108,99,255,0.08)', paddingTop: 16 }}>
              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.65 }}>{flag.description}</p>

              {/* Actions */}
              <div className="flex gap-3">
                {!resolved && (
                  <motion.button
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.8rem' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setResolved(true)}
                  >
                    <CheckCircle size={14} /> Mark Resolved
                  </motion.button>
                )}
                <motion.button
                  className="btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '0.8rem' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Eye size={14} /> View Worker Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminAnomalyPage() {
  const stats = MOCK_ANOMALY_STATS;
  const flags = MOCK_ANOMALY_FLAGS;

  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filtered = filter === 'all'
    ? flags
    : flags.filter(f => f.severity === filter || (filter === 'high' && f.severity === 'critical'));

  return (
    <AppShell title="Anomaly Detector" subtitle="Behavioral risk flags across the worker network">
      <div className="flex flex-col gap-6">

        {/* Stats row */}
        <div className="stats-grid-4">
          {[
            { label: 'Total Flagged',    value: stats.total_flagged,   color: '#FF4D6A', icon: ShieldAlert },
            { label: 'High / Critical',  value: stats.high + stats.critical, color: '#FF4D6A', icon: AlertCircle },
            { label: 'Medium',           value: stats.medium,          color: '#F5C518', icon: AlertTriangle },
            { label: 'Resolved Today',   value: stats.resolved_today,  color: '#00FF9C', icon: CheckCircle },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="glass-card p-5 flex flex-col gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.8rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 4, fontWeight: 600 }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live heatmap strip */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <Activity size={16} color="#FF4D6A" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>ANOMALY SIGNAL DENSITY</p>
          <div style={{ flex: 1, display: 'flex', gap: 3, alignItems: 'center' }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const hot = [3, 7, 8, 18, 19, 31].includes(i);
              const warm = [2, 9, 17, 20, 30, 32].includes(i);
              const color = hot ? '#FF4D6A' : warm ? '#F5C518' : 'rgba(255,255,255,0.05)';
              return (
                <motion.div
                  key={i}
                  style={{ flex: 1, height: 20, borderRadius: 3, background: color }}
                  animate={hot ? { opacity: [0.6, 1, 0.6] } : undefined}
                  transition={hot ? { duration: 1.5, repeat: Infinity, delay: i * 0.05 } : undefined}
                />
              );
            })}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Last 24 hours</p>
        </motion.div>

        {/* Filter tabs + flags */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>Active Flags</p>
            <div className="flex gap-2">
              {(['all', 'high', 'medium', 'low'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: filter === f ? '1px solid rgba(108,99,255,0.5)' : '1px solid rgba(108,99,255,0.15)',
                    background: filter === f ? 'rgba(108,99,255,0.18)' : 'transparent',
                    color: filter === f ? '#A78BFA' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {f === 'all' ? `All (${flags.length})` : f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="glass-card p-10 flex flex-col items-center gap-3">
                <CheckCircle size={40} color="#00FF9C" />
                <p style={{ fontWeight: 600 }}>No active flags in this category</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>All workers are within normal behaviour range.</p>
              </div>
            ) : (
              filtered.map((flag, i) => (
                <FlagCard key={flag.id} flag={flag} index={i} />
              ))
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="glass-card p-4" style={{ borderStyle: 'dashed', borderColor: 'rgba(108,99,255,0.2)', background: 'transparent' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', lineHeight: 1.6 }}>
            Anomaly detection runs continuously on worker activity signals. Flags are generated by rule-based heuristics and do not constitute evidence of fraud. All flagged workers retain full rights and are notified of any review.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
