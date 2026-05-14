/**
 * NAMASTE — ZK Proof Shield Component
 * 3D-style shield with radiating concentric glow rings when active
 */
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Zap } from 'lucide-react';

interface ZKProofShieldProps {
  active?: boolean;
  verifying?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { shield: 80, rings: [100, 130], icon: 24 },
  md: { shield: 140, rings: [180, 220, 260], icon: 40 },
  lg: { shield: 200, rings: [260, 310, 360, 420], icon: 56 },
};

export default function ZKProofShield({ active = false, verifying = false, size = 'lg' }: ZKProofShieldProps) {
  const dim = sizes[size];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dim.rings[dim.rings.length - 1], height: dim.rings[dim.rings.length - 1] }}
    >
      {/* Concentric glow rings */}
      {dim.rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: r, height: r,
            borderColor: active
              ? `rgba(46,242,165,${0.35 - i * 0.08})`
              : `rgba(0,184,255,${0.3 - i * 0.06})`,
            boxShadow: active
              ? `0 0 ${20 + i * 10}px rgba(46,242,165,${0.2 - i * 0.04})`
              : `0 0 ${12 + i * 8}px rgba(0,184,255,${0.15 - i * 0.03})`,
          }}
          animate={active ? {
            scale: [1, 1.04, 1],
            opacity: [0.6, 1, 0.6],
          } : verifying ? {
            scale: [1, 1.08, 1],
            opacity: [0.4, 0.9, 0.4],
          } : {
            scale: 1, opacity: 0.5,
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Shield body */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: dim.shield,
          height: dim.shield,
          background: active
            ? 'linear-gradient(145deg, rgba(46,242,165,0.16), rgba(7,17,28,0.95), rgba(0,184,255,0.1))'
            : 'linear-gradient(145deg, rgba(0,184,255,0.18), rgba(7,17,28,0.95), rgba(139,92,246,0.12))',
          borderRadius: '50% 50% 45% 45%',
          border: active
            ? '2px solid rgba(46,242,165,0.5)'
            : '2px solid rgba(0,184,255,0.38)',
          backdropFilter: 'blur(16px)',
          boxShadow: active
            ? '0 0 40px rgba(46,242,165,0.26), inset 0 1px 0 rgba(46,242,165,0.2)'
            : '0 0 40px rgba(0,184,255,0.22), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
        animate={active ? {
          boxShadow: [
            '0 0 40px rgba(46,242,165,0.26)',
            '0 0 70px rgba(46,242,165,0.42)',
            '0 0 40px rgba(46,242,165,0.26)',
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          {verifying ? (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Zap size={dim.icon} color="#ffd166" />
              </motion.div>
            </motion.div>
          ) : active ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <ShieldCheck size={dim.icon} color="#2ef2a5" strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Lock size={dim.icon} color="#00b8ff" strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inner shimmer */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
            borderRadius: '50% 50% 45% 45%',
          }}
        />
      </motion.div>

      {/* Status label */}
      <motion.div
        className="absolute bottom-0 left-1/2"
        style={{ transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span
          className="badge text-xs"
          style={
            active
              ? { color: '#2ef2a5', borderColor: 'rgba(46,242,165,0.3)', background: 'rgba(46,242,165,0.1)' }
              : verifying
              ? { color: '#ffd166', borderColor: 'rgba(255,209,102,0.3)', background: 'rgba(255,209,102,0.1)' }
              : { color: '#00b8ff', borderColor: 'rgba(0,184,255,0.3)', background: 'rgba(0,184,255,0.1)' }
          }
        >
          {active ? 'ZK-Proof Verified' : verifying ? 'Generating Proof...' : 'ZK-Proof Ready'}
        </span>
      </motion.div>
    </div>
  );
}
