/**
 * NAMASTE - The Neural Network Ignition Loading Screen
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),   // Start ignition sequence
      setTimeout(() => setPhase(2), 2600),  // Dim UI, network fully lit
      setTimeout(() => setPhase(3), 3200),  // Massive shockwave flash
      setTimeout(() => onComplete(), 4200), // Transition to app
    ];
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  // Generate a random network of nodes and lines
  const { nodes, lines } = useMemo(() => {
    interface Node { id: number; x: number; y: number; tier: number; }
    interface Line { id: string; n1: Node; n2: Node; tier: number; }
    
    const n: Node[] = [];
    n.push({ id: 0, x: 50, y: 50, tier: 0 }); // Center core node
    
    // Tier 1 (inner ring)
    for(let i=0; i<8; i++) {
       const angle = (i/8) * Math.PI * 2;
       n.push({ id: n.length, x: 50 + Math.cos(angle)*15, y: 50 + Math.sin(angle)*15, tier: 1 });
    }
    // Tier 2 (middle ring)
    for(let i=0; i<16; i++) {
       const angle = (i/16) * Math.PI * 2 + 0.2;
       n.push({ id: n.length, x: 50 + Math.cos(angle)*35, y: 50 + Math.sin(angle)*35, tier: 2 });
    }
    // Tier 3 (outer edges)
    for(let i=0; i<24; i++) {
       const angle = (i/24) * Math.PI * 2;
       n.push({ id: n.length, x: 50 + Math.cos(angle)*55, y: 50 + Math.sin(angle)*55, tier: 3 });
    }
    // Tier 4 (far edges)
    for(let i=0; i<32; i++) {
      const angle = (i/32) * Math.PI * 2 + 0.1;
      n.push({ id: n.length, x: 50 + Math.cos(angle)*75, y: 50 + Math.sin(angle)*75, tier: 4 });
   }

    const l: Line[] = [];
    // Connect center to T1
    n.filter(nd => nd.tier === 1).forEach(nd => l.push({ id: `0-${nd.id}`, n1: n[0], n2: nd, tier: 1 }));
    // Connect T1 to T2
    n.filter(nd => nd.tier === 1).forEach((n1, i) => {
       const t2s = n.filter(nd => nd.tier === 2);
       l.push({ id: `${n1.id}-${t2s[i*2].id}`, n1, n2: t2s[i*2], tier: 2 });
       l.push({ id: `${n1.id}-${t2s[i*2+1].id}`, n1, n2: t2s[i*2+1], tier: 2 });
    });
    // Connect T2 to T3
    n.filter(nd => nd.tier === 2).forEach((n1) => {
       const t3s = n.filter(nd => nd.tier === 3);
       const closest = [...t3s].sort((a,b) => (Math.pow(a.x-n1.x,2)+Math.pow(a.y-n1.y,2)) - (Math.pow(b.x-n1.x,2)+Math.pow(b.y-n1.y,2)));
       l.push({ id: `${n1.id}-${closest[0].id}`, n1, n2: closest[0], tier: 3 });
       if (Math.random() > 0.3) {
          l.push({ id: `${n1.id}-${closest[1].id}`, n1, n2: closest[1], tier: 3 });
       }
    });
    // Connect T3 to T4
    n.filter(nd => nd.tier === 3).forEach((n1) => {
      const t4s = n.filter(nd => nd.tier === 4);
      const closest = [...t4s].sort((a,b) => (Math.pow(a.x-n1.x,2)+Math.pow(a.y-n1.y,2)) - (Math.pow(b.x-n1.x,2)+Math.pow(b.y-n1.y,2)));
      l.push({ id: `${n1.id}-${closest[0].id}`, n1, n2: closest[0], tier: 4 });
   });

    // Connect some ring nodes laterally for web effect
    n.filter(nd => nd.tier === 2).forEach((nd, i, arr) => {
       const next = arr[(i+1)%arr.length];
       l.push({ id: `ring-${nd.id}-${next.id}`, n1: nd, n2: next, tier: 2 });
    });

    return { nodes: n, lines: l };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#02050A', // Deep black for max contrast
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* FULL SCREEN NEURAL NETWORK */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ width: '100vw', height: '100vh', opacity: phase >= 3 ? 0 : 1, transition: 'opacity 0.2s ease' }}>
          <defs>
             <filter id="network-glow">
                <feGaussianBlur stdDeviation="0.6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
             </filter>
             <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
               <stop offset="0%" stopColor="#00FF9C" />
               <stop offset="100%" stopColor="#A78BFA" />
             </linearGradient>
          </defs>

          {/* Dormant Nodes & Lines */}
          {lines.map(l => (
             <line key={`dormant-${l.id}`} x1={l.n1.x} y1={l.n1.y} x2={l.n2.x} y2={l.n2.y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
          ))}
          {nodes.map(n => (
             <circle key={`dormant-${n.id}`} cx={n.x} cy={n.y} r="0.2" fill="rgba(255,255,255,0.05)" />
          ))}

          {/* Ignited Lines */}
          {lines.map(l => (
             <motion.line 
               key={`active-${l.id}`} 
               x1={l.n1.x} y1={l.n1.y} x2={l.n2.x} y2={l.n2.y} 
               stroke="url(#line-grad)" 
               strokeWidth="0.25"
               filter="url(#network-glow)"
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ 
                 pathLength: phase >= 1 ? 1 : 0, 
                 opacity: phase >= 1 ? 0.9 : 0 
               }}
               transition={{ 
                 duration: 0.8, 
                 delay: l.tier * 0.35 + Math.random() * 0.2, // Cascading chain reaction
                 ease: "easeOut"
               }}
             />
          ))}

          {/* Ignited Nodes */}
          {nodes.map(n => (
             <motion.circle 
               key={`active-${n.id}`} 
               cx={n.x} cy={n.y} r={n.id === 0 ? "0.8" : "0.35"} 
               fill="#00FF9C"
               filter="url(#network-glow)"
               initial={{ scale: 0, opacity: 0 }}
               animate={{ 
                 scale: phase >= 1 ? 1 : 0, 
                 opacity: phase >= 1 ? 1 : 0 
               }}
               transition={{ 
                 duration: 0.4, 
                 delay: n.tier * 0.35 - 0.1, // Pops right before lines branch out
                 ease: "backOut"
               }}
             />
          ))}
        </svg>
      </div>

      {/* The Shockwave Climax */}
      <AnimatePresence>
         {phase === 3 && (
            <motion.div 
               style={{ position: 'absolute', left: '50%', top: '50%', width: 10, height: 10, borderRadius: '50%', background: '#00FF9C', boxShadow: '0 0 100px 50px #00FF9C', zIndex: 10, transform: 'translate(-50%, -50%)' }}
               initial={{ scale: 0, opacity: 1 }}
               animate={{ scale: 300, opacity: 1 }}
               transition={{ duration: 0.7, ease: "easeIn" }}
               exit={{ opacity: 0 }}
            />
         )}
      </AnimatePresence>

      {/* Main UI Overlay - Dims completely at the end */}
      <motion.div 
        style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 500, background: 'rgba(2,5,10,0.6)', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}
        animate={{ 
          opacity: phase >= 2 ? 0 : 1, 
          scale: phase >= 2 ? 0.8 : 1 
        }}
        transition={{ duration: 0.6, ease: "easeIn" }}
      >
        <h1 style={{ fontFamily: 'Poppins', fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #A78BFA 50%, #00FF9C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16, letterSpacing: '-0.03em' }}>
          NAMASTE
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500, marginBottom: 40 }}>
          Initializing global trust network...
        </p>

        <div style={{ height: 3, background: 'rgba(108,99,255,0.1)', borderRadius: 2, overflow: 'hidden', maxWidth: 240, margin: '0 auto' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #6C63FF, #A78BFA, #00FF9C)', borderRadius: 2 }}
            initial={{ width: 0 }}
            animate={{ width: phase >= 1 ? '100%' : '20%' }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
