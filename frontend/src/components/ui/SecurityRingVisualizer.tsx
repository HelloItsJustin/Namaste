import { motion } from 'framer-motion';
import { Lock, KeyRound, Zap, Shield, Database, Wallet } from 'lucide-react';

interface NetworkNode {
  id: string;
  label: string;
  icon: any;
  color: string;
  x: number;
  y: number;
  delay: number;
}

const NODES: NetworkNode[] = [
  { id: 'identity', label: 'Identity', icon: Shield, color: '#A78BFA', x: 20, y: 50, delay: 0 },
  { id: 'cipher', label: 'Cipher', icon: Lock, color: '#F5C518', x: 50, y: 15, delay: 0.1 },
  { id: 'keys', label: 'DID Keys', icon: KeyRound, color: '#F5C518', x: 80, y: 50, delay: 0.2 },
  { id: 'proofs', label: 'Proofs', icon: Shield, color: '#38BDF8', x: 20, y: 85, delay: 0.3 },
  { id: 'registry', label: 'Registry', icon: Database, color: '#FF9C6E', x: 50, y: 95, delay: 0.4 },
  { id: 'payouts', label: 'Payouts', icon: Wallet, color: '#00FF9C', x: 80, y: 85, delay: 0.5 },
  { id: 'core', label: 'Worker Core', icon: Zap, color: '#00FF9C', x: 50, y: 50, delay: 0.6 },
];

const CONNECTIONS = [
  ['identity', 'core'],
  ['cipher', 'core'],
  ['keys', 'core'],
  ['proofs', 'core'],
  ['registry', 'core'],
  ['payouts', 'core'],
  ['identity', 'proofs'],
  ['cipher', 'keys'],
];

export default function SecurityRingVisualizer() {
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  return (
    <div className="relative w-full" style={{ paddingBottom: '100%', height: 0, overflow: 'hidden', borderRadius: 16, background: 'linear-gradient(135deg, rgba(108,99,255,0.03) 0%, rgba(0,255,156,0.02) 100%)', border: '1px solid rgba(108,99,255,0.1)' }}>
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Grid background */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="20%" height="20%" patternUnits="userSpaceOnUse">
              <path d="M 20% 0 L 0 0 0 20%" fill="none" stroke="rgba(108,99,255,0.06)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
          {CONNECTIONS.map((conn) => {
            const from = nodeMap[conn[0]];
            const to = nodeMap[conn[1]];
            const x1 = `${from.x}%`;
            const y1 = `${from.y}%`;
            const x2 = `${to.x}%`;
            const y2 = `${to.y}%`;

            return (
              <motion.line
                key={`${conn[0]}-${conn[1]}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={from.color}
                strokeWidth="1.5"
                opacity="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: Math.max(from.delay, to.delay) + 0.2, duration: 0.8 }}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {NODES.map((node) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: node.delay, type: 'spring', stiffness: 150 }}
            >
              {/* Node circle */}
              <motion.div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${node.color}20, ${node.color}05)`,
                  border: `2px solid ${node.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${node.color}30`,
                  position: 'relative',
                }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: `0 0 40px ${node.color}60`,
                }}
              >
                <Icon size={24} color={node.color} strokeWidth={1.5} />

                {/* Pulsing outer ring */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: -8,
                    borderRadius: '50%',
                    border: `1.5px solid ${node.color}`,
                    opacity: 0.3,
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: node.delay }}
                />
              </motion.div>

              {/* Label below node */}
              <motion.div
                style={{
                  marginTop: 12,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: node.delay + 0.3 }}
              >
                <p style={{ color: node.color, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {node.label}
                </p>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Live indicator */}
        <motion.div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 20,
            background: 'rgba(0,255,156,0.1)',
            border: '1px solid rgba(0,255,156,0.3)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00FF9C',
              boxShadow: '0 0 8px #00FF9C',
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ color: '#00FF9C', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Live</span>
        </motion.div>
      </div>
    </div>
  );
}
