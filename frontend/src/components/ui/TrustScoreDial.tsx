/**
 * NAMASTE — TrustScore Dial
 * Circular arc gauge with gradient purple-to-green fill, animated on mount
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TrustScoreDialProps {
  score: number;
  maxScore?: number;
  minScore?: number;
  size?: number;
  showDetails?: boolean;
}

const getBand = (score: number) => {
  if (score >= 750) return { label: 'Excellent', color: '#2ef2a5' };
  if (score >= 650) return { label: 'Good', color: '#00b8ff' };
  if (score >= 500) return { label: 'Fair', color: '#ffd166' };
  return { label: 'Building', color: '#ff5c7a' };
};

export default function TrustScoreDial({
  score,
  maxScore = 900,
  minScore = 300,
  size = 220,
  showDetails = true,
}: TrustScoreDialProps) {
  const [animatedScore, setAnimatedScore] = useState(minScore);
  const band = getBand(score);

  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 14;
  const innerStroke = 6;
  const radius = (size - strokeWidth * 2 - 20) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc spans 240 degrees (from 150° to 390°)
  const arcDeg = 240;
  const arcRad = (arcDeg * Math.PI) / 180;
  const arcLength = (arcRad / (2 * Math.PI)) * circumference;

  const normalised = Math.max(0, Math.min(1, (animatedScore - minScore) / (maxScore - minScore)));
  const dashFill = normalised * arcLength;

  // Count-up animation
  useEffect(() => {
    let start = minScore;
    const duration = 1800;
    const step = (timestamp: number, startTime: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(start + (score - start) * eased));
      if (progress < 1) requestAnimationFrame((ts) => step(ts, startTime));
    };
    requestAnimationFrame((ts) => step(ts, ts));
  }, [score, minScore]);

  // SVG arc path helpers
  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const startAngle = 150;
  const endAngle = 390;
  const startPt = polarToCartesian(startAngle);
  const endPt = polarToCartesian(endAngle);

  const arcPath = `M ${startPt.x} ${startPt.y} A ${radius} ${radius} 0 1 1 ${endPt.x} ${endPt.y}`;

  const gradientId = `trust-gradient-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 60%, ${band.color}18 100%)`,
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg width={size} height={size} style={{ transform: 'rotate(0deg)' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00b8ff" />
              <stop offset="52%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#2ef2a5" />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(160,190,220,0.14)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Inner dim track */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(160,190,220,0.07)"
            strokeWidth={innerStroke}
            strokeLinecap="round"
          />

          {/* Animated fill arc */}
          <motion.path
            d={arcPath}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={arcLength - dashFill}
            filter="url(#glow-filter)"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: arcLength - dashFill }}
            transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
          />

          {/* Endpoint dot */}
          {dashFill > 5 && (() => {
            const angle = startAngle + normalised * arcDeg;
            const pt = polarToCartesian(angle);
            return (
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={strokeWidth / 2 + 1}
                fill={band.color}
                filter="url(#glow-filter)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.3 }}
              />
            );
          })()}
        </svg>

        {/* Center score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-mono font-bold"
            style={{ fontSize: size * 0.22, color: band.color, lineHeight: 1 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            {animatedScore}
          </motion.span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 2 }}>
            / {maxScore}
          </span>
        </div>
      </div>

      {showDetails && (
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span
            className="text-sm font-semibold badge"
            style={{ color: band.color, borderColor: `${band.color}40`, background: `${band.color}12` }}
          >
            {band.label} Credit Profile
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Top {score >= 750 ? '15%' : score >= 650 ? '35%' : '60%'} of all workers
          </span>
        </motion.div>
      )}
    </div>
  );
}
