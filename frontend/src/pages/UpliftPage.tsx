/**
 * NAMASTE — Financial Uplift Plan Page
 * Personalised 90-day growth roadmap for informal workers.
 * Shows projected TrustScore, top-3 action cards, scheme matches, and platform suggestions.
 */
import { motion } from 'framer-motion';
import {
  TrendingUp,
  PlusCircle,
  Link,
  Users,
  Landmark,
  CheckCircle,
  ExternalLink,
  Bike,
  ShoppingBag,
  Truck,
  ArrowUpRight,
  Sparkles,
  Info,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import TrustScoreDial from '@/components/ui/TrustScoreDial';
import { MOCK_UPLIFT_DATA, MOCK_WORKER } from '@/lib/mockData';

// ---------------------------------------------------------------------------
// Icon resolver (maps backend icon string → lucide component)
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, React.ElementType> = {
  PlusCircle,
  Link,
  TrendingUp,
  Users,
  Landmark,
  CheckCircle,
  Bike,
  ShoppingBag,
  Truck,
};

function ResolvedIcon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
  const Icon = ICON_MAP[name] || TrendingUp;
  return <Icon size={size} color={color} />;
}

// ---------------------------------------------------------------------------
// Difficulty badge
// ---------------------------------------------------------------------------
const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: 'rgba(0,255,156,0.1)',   color: '#00FF9C' },
  Medium: { bg: 'rgba(245,197,24,0.12)', color: '#F5C518' },
  Hard:   { bg: 'rgba(255,77,106,0.1)',  color: '#FF4D6A' },
};

function DifficultyBadge({ level }: { level: string }) {
  const s = DIFFICULTY_STYLE[level] ?? DIFFICULTY_STYLE.Medium;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.04em' }}>
      {level}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Recommendation card
// ---------------------------------------------------------------------------
function RecommendationCard({
  rec,
  index,
}: {
  rec: typeof MOCK_UPLIFT_DATA.recommendations[number];
  index: number;
}) {
  return (
    <motion.div
      className="glass-card p-7 flex flex-col gap-5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: `0 12px 32px -8px ${rec.color}22` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${rec.color}18`,
              border: `1px solid ${rec.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ResolvedIcon name={rec.icon} size={22} color={rec.color} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{rec.title}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3, fontFamily: 'JetBrains Mono' }}>
              {rec.timeframe_days} days · {rec.category}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            style={{
              fontFamily: 'JetBrains Mono',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: rec.color,
              background: `${rec.color}12`,
              padding: '6px 12px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
            }}
          >
            +{rec.impact_pts} pts
          </span>
          <DifficultyBadge level={rec.difficulty} />
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.6 }}>{rec.description}</p>

      {/* Action steps */}
      <div className="flex flex-col gap-2">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', letterSpacing: '0.08em', fontWeight: 700 }}>ACTION STEPS</p>
        {rec.action_steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: `${rec.color}15`,
                border: `1px solid ${rec.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: rec.color }}>{i + 1}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>{step}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Scheme card
// ---------------------------------------------------------------------------
function SchemeCard({ scheme, index }: { scheme: typeof MOCK_UPLIFT_DATA.schemes[number]; index: number }) {
  return (
    <motion.div
      className="glass-card p-5 flex flex-col gap-3"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      style={{ borderColor: scheme.eligible ? 'rgba(0,255,156,0.2)' : 'rgba(108,99,255,0.12)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{scheme.name}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 2 }}>{scheme.authority}</p>
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 6,
            background: scheme.eligible ? 'rgba(0,255,156,0.1)' : 'rgba(108,99,255,0.1)',
            color: scheme.eligible ? '#00FF9C' : '#A78BFA',
          }}
        >
          {scheme.eligible ? 'Eligible' : 'Not Yet'}
        </span>
      </div>

      <p style={{ color: '#F5C518', fontSize: '0.82rem', fontWeight: 600 }}>{scheme.benefit}</p>

      <div className="flex items-center gap-2">
        <Info size={12} color="var(--text-muted)" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{scheme.reason}</p>
      </div>

      {scheme.eligible && (
        <a
          href={scheme.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#00FF9C',
            textDecoration: 'none',
            marginTop: 2,
          }}
        >
          Apply Now <ExternalLink size={12} />
        </a>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Platform recommendation chip
// ---------------------------------------------------------------------------
function PlatformChip({
  plat,
  index,
}: {
  plat: typeof MOCK_UPLIFT_DATA.platform_recommendations[number];
  index: number;
}) {
  return (
    <motion.div
      className="glass-card p-5 flex flex-col gap-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      whileHover={{ y: -3, boxShadow: `0 10px 24px -8px ${plat.color}33` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${plat.color}18`,
              border: `1px solid ${plat.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ResolvedIcon name={plat.icon} size={18} color={plat.color} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{plat.name}</span>
        </div>
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#00FF9C',
            background: 'rgba(0,255,156,0.1)',
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          +{plat.score_boost} pts
        </span>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5 }}>{plat.reason}</p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function UpliftPage() {
  const data = MOCK_UPLIFT_DATA;
  const totalImpact = data.recommendations.reduce((s, r) => s + r.impact_pts, 0);

  return (
    <AppShell title="Uplift Plan" subtitle="Your personalised 90-day financial growth roadmap">
      <div className="flex flex-col gap-8">

        {/* ── Hero: score projection ───────────────────────────────────── */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(0,184,255,0.06) 100%)',
            border: '1px solid rgba(108,99,255,0.2)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Current vs projected dials */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="flex flex-col items-center gap-2">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 700 }}>NOW</p>
                <TrustScoreDial score={data.current_score} size={140} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(108,99,255,0.1)', padding: '3px 10px', borderRadius: 6 }}>
                  {data.score_band}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <ArrowUpRight size={28} color="#00FF9C" />
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1rem', color: '#00FF9C' }}>
                  +{totalImpact}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>pts</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p style={{ color: '#00FF9C', fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 700 }}>
                  IN {data.projected_in_days}D
                </p>
                <TrustScoreDial score={data.projected_score} size={140} />
                <span style={{ fontSize: '0.72rem', color: '#00FF9C', background: 'rgba(0,255,156,0.1)', padding: '3px 10px', borderRadius: 6 }}>
                  {data.projected_band}
                </span>
              </div>
            </div>

            {/* Summary text */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-3">
                <Sparkles size={20} color="#F5C518" />
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.15rem' }}>
                  Your 90-Day Growth Plan
                </p>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                {data.summary}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { label: 'Score Gain', value: `+${totalImpact} pts`, color: '#00FF9C' },
                  { label: 'Timeframe', value: `${data.projected_in_days} days`, color: '#F5C518' },
                  { label: 'Steps', value: `${data.recommendations.length} actions`, color: '#A78BFA' },
                  { label: 'Schemes', value: `${data.schemes.filter(s => s.eligible).length} eligible`, color: '#00b8ff' },
                ].map(stat => (
                  <div
                    key={stat.label}
                    style={{
                      padding: '8px 16px',
                      background: `${stat.color}10`,
                      border: `1px solid ${stat.color}25`,
                      borderRadius: 10,
                    }}
                  >
                    <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1rem', color: stat.color }}>
                      {stat.value}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: 2 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Top 3 recommendations ────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp size={18} color="var(--accent-secondary)" />
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>Top Actions</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', background: 'rgba(108,99,255,0.1)', padding: '2px 8px', borderRadius: 6 }}>
              Ranked by score impact
            </span>
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {data.recommendations.map((rec, i) => (
              <RecommendationCard key={rec.id} rec={rec} index={i} />
            ))}
          </div>
        </div>

        {/* ── Government schemes + Platform suggestions ─────────────────── */}
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

          {/* Schemes */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Landmark size={18} color="#F5C518" />
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>Government Schemes</p>
              <span style={{ color: '#00FF9C', fontSize: '0.72rem', background: 'rgba(0,255,156,0.1)', padding: '2px 8px', borderRadius: 6 }}>
                {data.schemes.filter(s => s.eligible).length} eligible now
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {data.schemes.map((scheme, i) => (
                <SchemeCard key={scheme.name} scheme={scheme} index={i} />
              ))}
            </div>
          </div>

          {/* Platform suggestions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <PlusCircle size={18} color="#00b8ff" />
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>Recommended Platforms</p>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', background: 'rgba(0,184,255,0.1)', padding: '2px 8px', borderRadius: 6 }}>
                score boost
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {data.platform_recommendations.map((plat, i) => (
                <PlatformChip key={plat.name} plat={plat} index={i} />
              ))}
            </div>

            {/* Disclaimer */}
            <div
              className="glass-card p-4 mt-2"
              style={{ borderStyle: 'dashed', borderColor: 'rgba(108,99,255,0.25)', background: 'transparent' }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', lineHeight: 1.6 }}>
                Score projections are estimates based on historical signal weights. Actual impact may vary.
                NAMASTE does not share your data with platforms without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
