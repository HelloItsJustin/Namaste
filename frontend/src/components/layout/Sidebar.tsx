/**
 * NAMASTE — Sidebar Navigation
 * Worker PWA sidebar with glassmorphism, active route glow, and DID display
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Award, Shield, Wallet, Users,
  Settings, ChevronRight, LogOut, X, Database, Activity,
  TrendingUp, MessageCircle, ShieldAlert
} from 'lucide-react';
import { useUIStore } from '@/store/useStore';
import { useWorkerStore } from '@/store/useStore';
import { truncateHash } from '@/lib/jlynCipher';
import { MOCK_WORKER } from '@/lib/mockData';

const NAV_ITEMS = [
  { path: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/credentials', icon: Award,           label: 'Credentials' },
  { path: '/zkproof',     icon: Shield,          label: 'ZK Proof' },
  { path: '/wallet',      icon: Wallet,          label: 'Wallet' },
  { path: '/vouching',    icon: Users,           label: 'Vouching' },
  { path: '/uplift',      icon: TrendingUp,      label: 'Uplift Plan' },
  { path: '/chat',        icon: MessageCircle,   label: 'AI Assistant' },
  { path: '/settings',    icon: Settings,        label: 'Settings' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { logout } = useWorkerStore();
  const worker = MOCK_WORKER;

  const handleSignOut = () => {
    logout();
    navigate('/onboarding');
  };

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 lg:hidden"
            style={{ background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="sidebar-glass"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 260,
          background: 'rgba(10,15,30,0.95)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(108,99,255,0.15)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(108,99,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #00b8ff, #2ef2a5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,184,255,0.22)' }}>
                <Activity size={22} color="#fff" />
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', color: '#fff' }}>NAMASTE</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '0.1em' }}>TRUST ENGINE</p>
              </div>
            </div>
            <button className="btn-ghost lg:hidden" onClick={() => setSidebarOpen(false)} style={{ padding: 4 }}><X size={18} /></button>
          </div>
        </div>

        {/* Identity Card */}
        <div style={{ padding: '20px' }}>
          <motion.div
            style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 12, padding: 12, cursor: 'pointer' }}
            whileHover={{ borderColor: 'rgba(108,99,255,0.35)', boxShadow: '0 0 12px rgba(108,99,255,0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #00b8ff, #2ef2a5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#06101b', fontSize: '0.9rem', flexShrink: 0 }}>
                {worker.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{worker.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontFamily: 'JetBrains Mono', overflow: 'hidden', textOverflow: 'ellipsis' }}>{worker.id}</p>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 6, border: '1px solid rgba(108,99,255,0.1)' }}>
              <p style={{ color: 'var(--accent-secondary)', fontFamily: 'JetBrains Mono', fontSize: '0.55rem', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-all' }}>{truncateHash(worker.did, 14)}</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>WORKER PORTAL</p>
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <motion.div key={item.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, transition: 'all 0.2s', color: isActive(item.path) ? 'var(--accent-secondary)' : 'var(--text-secondary)', background: isActive(item.path) ? 'rgba(108,99,255,0.12)' : 'transparent', border: isActive(item.path) ? '1px solid rgba(108,99,255,0.25)' : '1px solid transparent' }}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  <item.icon size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                  {isActive(item.path) && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </Link>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>SYSTEM</p>

            {/* Lender Portal */}
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }}>
              <Link to="/lender/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, transition: 'all 0.2s', color: pathname.startsWith('/lender') ? 'var(--accent-secondary)' : 'var(--text-secondary)', background: pathname.startsWith('/lender') ? 'rgba(108,99,255,0.12)' : 'transparent', border: pathname.startsWith('/lender') ? '1px solid rgba(108,99,255,0.25)' : '1px solid transparent' }}>
                <Shield size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Lender Portal</span>
                {pathname.startsWith('/lender') && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </Link>
            </motion.div>

            {/* Admin Panel */}
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }}>
              <Link to="/admin/workers" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, transition: 'all 0.2s', color: pathname.startsWith('/admin') ? 'var(--accent-secondary)' : 'var(--text-secondary)', background: pathname.startsWith('/admin') ? 'rgba(108,99,255,0.12)' : 'transparent', border: pathname.startsWith('/admin') ? '1px solid rgba(108,99,255,0.25)' : '1px solid transparent' }}>
                <Database size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Admin Panel</span>
                {pathname.startsWith('/admin') && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </Link>
            </motion.div>

            {/* Anomaly Detector — direct link with red badge */}
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }}>
              <Link to="/admin/anomaly" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, transition: 'all 0.2s', color: pathname === '/admin/anomaly' ? '#FF4D6A' : 'var(--text-secondary)', background: pathname === '/admin/anomaly' ? 'rgba(255,77,106,0.1)' : 'transparent', border: pathname === '/admin/anomaly' ? '1px solid rgba(255,77,106,0.25)' : '1px solid transparent' }}>
                <ShieldAlert size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Anomaly Detector</span>
                <span style={{ marginLeft: 'auto', background: 'rgba(255,77,106,0.15)', color: '#FF4D6A', fontSize: '0.6rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>2</span>
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Sign Out */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(108,99,255,0.08)' }}>
          <motion.button
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', gap: 10, color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 16px', borderRadius: 8 }}
            onClick={handleSignOut}
            whileHover={{ background: 'rgba(108,99,255,0.1)', color: 'var(--text-secondary)' }}
            whileTap={{ scale: 0.97 }}
          >
            <LogOut size={16} />
            Sign Out
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
