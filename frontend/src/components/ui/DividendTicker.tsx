/**
 * NAMASTE — Dividend Ticker
 * Live-updating gold number counter showing total earnings
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';

interface DividendTickerProps {
  total: number;
  monthly: number;
  pending: number;
  compact?: boolean;
}

function useCountUp(target: number, duration = 1600, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(parseFloat((eased * target).toFixed(2)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

export default function DividendTicker({ total, monthly, pending, compact = false }: DividendTickerProps) {
  const totalAnimated = useCountUp(total, 2000, 200);
  const monthlyAnimated = useCountUp(monthly, 1400, 400);
  const pendingAnimated = useCountUp(pending, 1200, 600);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Zap size={16} color="#ffd166" />
        <span style={{ color: '#ffd166', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.1rem' }}>
          ₹{totalAnimated.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>total earned</span>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{
            width: 40, height: 40,
            background: 'rgba(245,197,24,0.12)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(245,197,24,0.25)',
          }}>
            <Zap size={20} color="#F5C518" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>DATA DIVIDENDS</p>
            <p style={{ color: '#F5C518', fontSize: '0.65rem', marginTop: 2 }}>Real-time earnings</p>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF9C' }}
        />
      </div>

      {/* Total earnings — hero number */}
      <div className="flex flex-col gap: 2">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.08em', fontWeight: 600 }}>TOTAL EARNED</span>
        <motion.div
          className="flex items-baseline gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '2.6rem',
            fontWeight: 900,
            color: '#F5C518',
            textShadow: '0 0 24px rgba(245,197,24,0.4)',
            lineHeight: 1,
          }}>
            ₹{totalAnimated.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="badge-success badge" style={{ fontSize: '0.7rem', padding: '6px 12px' }}>
            <TrendingUp size={11} style={{ marginRight: 4 }} />+18.4%
          </span>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="divider" style={{ opacity: 0.2 }} />

      {/* Monthly + Pending in 2-column grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap: 2">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', letterSpacing: '0.06em', fontWeight: 600 }}>THIS MONTH</span>
          <motion.span
            style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#8bdcff', fontSize: '1.5rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ₹{monthlyAnimated.toFixed(2)}
          </motion.span>
          <div style={{ marginTop: 8, height: 3, background: 'rgba(139,220,255,0.15)', borderRadius: 1.5, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #6C63FF, #8bdcff)', borderRadius: 1.5 }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((monthlyAnimated / 500) * 100, 100)}%` }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </div>
        </div>

        <div className="flex flex-col gap: 2">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', letterSpacing: '0.06em', fontWeight: 600 }}>PENDING</span>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#F5C518' }}
            />
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#F5C518', fontSize: '1.5rem' }}>
              ₹{pendingAnimated.toFixed(2)}
            </span>
          </div>
          <div style={{ marginTop: 8, fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            Processing...
          </div>
        </div>
      </div>

      {/* Progress section */}
      <div className="bg-black/20 p-4 rounded-10" style={{ borderRadius: 10, background: 'rgba(0,0,0,0.2)', padding: 12 }}>
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>Monthly target</span>
          <span style={{ color: '#F5C518', fontSize: '0.68rem', fontWeight: 700 }}>
            {Math.round((monthlyAnimated / 500) * 100)}%
          </span>
        </div>
        <div style={{ height: 8, background: 'rgba(245,197,24,0.12)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(245,197,24,0.1)' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #ff7a45, #ffd166)', borderRadius: 4 }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((monthlyAnimated / 500) * 100, 100)}%` }}
            transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Daily Avg', value: '₹' + (total / 30).toFixed(2), color: '#00FF9C' },
          { label: 'Weekly', value: '₹' + (total / 4).toFixed(2), color: '#A78BFA' },
          { label: 'Growth', value: '+18.4%', color: '#F5C518' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            style={{
              padding: '12px',
              borderRadius: 10,
              background: 'rgba(108,99,255,0.06)',
              border: '1px solid rgba(108,99,255,0.1)',
              textAlign: 'center',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + i * 0.1 }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.04em' }}>{stat.label}</p>
            <p style={{ color: stat.color, fontSize: '1.1rem', fontWeight: 800, marginTop: 6, fontFamily: 'JetBrains Mono' }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer info */}
      <motion.div
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(0,255,156,0.06)',
          border: '1px solid rgba(0,255,156,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00FF9C', flexShrink: 0 }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Next settlement: 3d 14h</span>
      </motion.div>
    </div>
  );
}
