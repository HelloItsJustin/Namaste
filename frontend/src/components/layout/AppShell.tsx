/**
 * NAMASTE — App Shell Layout
 * Wraps all authenticated pages with sidebar + topbar
 */
import type { ReactNode } from 'react';
import { useUIStore } from '@/store/useStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NodeMeshBackground from '@/components/ui/NodeMeshBackground';
import { motion } from 'framer-motion';

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showMesh?: boolean;
}

export default function AppShell({ children, title, subtitle, showMesh = false }: AppShellProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {showMesh && <NodeMeshBackground />}

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <motion.div
        className="app-shell-main"
        style={{
          marginLeft: sidebarOpen ? 260 : 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Topbar title={title} subtitle={subtitle} />

        <main className="app-main" style={{ flex: 1, padding: '48px 56px', overflowX: 'hidden' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="app-footer" style={{
          padding: '24px 40px',
          borderTop: '1px solid rgba(108,99,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            © 2024 NAMASTE — Powered by Polygon ID + IPFS + Jlyn* Cipher
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF9C' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Polygon Mumbai Testnet</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
