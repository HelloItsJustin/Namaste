/**
 * NAMASTE — Top Navigation Bar
 */
import { motion } from 'framer-motion';
import { Menu, Bell, Zap } from 'lucide-react';
import { useUIStore } from '@/store/useStore';
import { MOCK_WORKER } from '@/lib/mockData';
import { useState } from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { setSidebarOpen, sidebarOpen } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationRead, setNotificationRead] = useState(false);

  const notifications = [
    { id: 1, title: 'Dividend Credited', message: '₹45.50 has been added to your wallet', time: '2 min ago', read: false },
    { id: 2, title: 'ZK-Proof Generated', message: 'Your cryptographic proof is ready for lenders', time: '1 hour ago', read: false },
    { id: 3, title: 'Vouch Request', message: 'Priya Patel requested a peer verification', time: '3 hours ago', read: true },
  ];

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setNotificationRead(true);
  };

  return (
    <motion.header
      className="topbar-shell"
      style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(10,15,30,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(108,99,255,0.12)',
        padding: '0 64px',
        height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16,
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <motion.button
          className="btn-ghost"
          style={{ padding: '8px' }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={20} color="var(--text-secondary)" />
        </motion.button>

        <div>
          <h1 className="topbar-title" style={{ fontFamily: 'Poppins', lineHeight: 1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 1 }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Dividend live chip */}
        <motion.div
          className="hidden sm:flex items-center gap-1.5"
          style={{
            background: 'rgba(245,197,24,0.1)',
            border: '1px solid rgba(245,197,24,0.25)',
            borderRadius: 99, padding: '5px 12px',
          }}
          animate={{ boxShadow: ['0 0 0px rgba(245,197,24,0)', '0 0 12px rgba(245,197,24,0.3)', '0 0 0px rgba(245,197,24,0)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Zap size={12} color="#F5C518" />
          <span style={{ color: '#F5C518', fontSize: '0.72rem', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
            ₹{MOCK_WORKER.pendingDividend.toFixed(2)} pending
          </span>
        </motion.div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <motion.button
            className="btn-ghost"
            style={{ padding: '8px', position: 'relative' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNotificationClick}
          >
            <Bell size={18} color="var(--text-secondary)" />
            {!notificationRead && (
              <motion.div
                style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#6C63FF',
                  border: '2px solid #0A0F1E',
                }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{
                position: 'absolute',
                top: 44,
                right: -8,
                width: 340,
                background: 'rgba(10,15,30,0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: 12,
                zIndex: 40,
                maxHeight: 400,
                overflowY: 'auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(108,99,255,0.1)' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</p>
              </div>
              <div>
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(108,99,255,0.06)',
                      cursor: 'pointer',
                      background: notif.read ? 'transparent' : 'rgba(108,99,255,0.05)',
                      transition: 'background 0.2s',
                    }}
                    whileHover={{ background: 'rgba(108,99,255,0.1)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{notif.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6C63FF', marginTop: 6, flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{notif.time}</p>
                  </motion.div>
                ))}
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(108,99,255,0.1)', textAlign: 'center' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>View All Notifications</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Avatar */}
        <motion.div
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00b8ff, #2ef2a5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#06101b', fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 0 18px rgba(0,184,255,0.25)',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {MOCK_WORKER.name.charAt(0)}
        </motion.div>
      </div>
    </motion.header>
  );
}
