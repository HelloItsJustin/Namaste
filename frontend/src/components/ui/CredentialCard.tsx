/**
 * NAMASTE — Holographic Credential Card
 * Shimmer gradient border, verified badge, credential type icon
 */
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ExternalLink, 
  Lock, 
  Calendar, 
  IdCard, 
  Bike, 
  IndianRupee, 
  Building, 
  Users, 
  Wrench,
  Activity
} from 'lucide-react';
import { truncateHash } from '@/lib/jlynCipher';

interface CredentialCardProps {
  credential: {
    id: string;
    type: string;
    title: string;
    issuer: string;
    issuedDate: string;
    expiryDate: string;
    status: string;
    icon: string;
    ipfsHash: string;
    encryptedWith: string;
    vcHash: string;
  };
  index?: number;
  onClick?: () => void;
}

const IconMap: Record<string, any> = {
  IdCard,
  Bike,
  IndianRupee,
  Building,
  Users,
  Wrench,
};

const TYPE_COLORS: Record<string, string> = {
  IdentityCredential: '#6C63FF',
  EmploymentCredential: '#F5C518',
  IncomeCredential: '#00FF9C',
  GovernmentCredential: '#A78BFA',
  VouchCredential: '#FF9C6E',
  PlatformCredential: '#38BDF8',
};

export default function CredentialCard({ credential, index = 0, onClick }: CredentialCardProps) {
  const color = TYPE_COLORS[credential.type] ?? '#6C63FF';
  const Icon = IconMap[credential.icon] || Activity;

  return (
    <motion.div
      className="holographic-card credential-card cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120 }}
      whileHover={{ y: -4, scale: 1.01, boxShadow: `0 15px 30px -10px ${color}33` }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon */}
          <motion.div
            style={{
              width: 52, height: 52,
              borderRadius: 14,
              background: `${color}12`,
              border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Icon size={22} color={color} />
          </motion.div>

          {/* Title + issuer */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="credential-title">
              {credential.title}
            </p>
            <p className="credential-subtitle">
              {credential.issuer.length > 35 ? credential.issuer.slice(0, 35) + '...' : credential.issuer}
            </p>
          </div>
        </div>

        {/* Verified badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.08 + 0.3, type: 'spring' }}
          style={{ flexShrink: 0 }}
        >
          <CheckCircle size={20} color="#00FF9C" strokeWidth={2.5} />
        </motion.div>
      </div>

      {/* Divider */}
      <div className="divider" style={{ opacity: 0.15 }} />

      {/* IPFS + Encryption info */}
      <div className="flex flex-col gap-2.5">
        <div className="credential-metadata-row">
          <div className="flex items-center gap-2 min-w-0">
            <Lock size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span className="credential-mono" style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'JetBrains Mono', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {truncateHash(credential.ipfsHash, 12)}
            </span>
          </div>
          <span className="badge" style={{ fontSize: '0.65rem', padding: '4px 10px', background: 'rgba(108,99,255,0.1)', color: 'var(--accent-secondary)', borderColor: 'rgba(108,99,255,0.2)', flexShrink: 0 }}>
            {credential.encryptedWith} STAR
          </span>
        </div>

        {/* Dates */}
        <div className="credential-metadata-row">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span className="credential-mono" style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Issued {new Date(credential.issuedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <span style={{ color: color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', flexShrink: 0 }}>
            {credential.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* On-chain hash */}
      <div
        className="credential-chain-row"
      >
        <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 500, flexShrink: 0 }}>On-chain</span>
        <div className="flex items-center gap-2 min-w-0">
          <span className="credential-mono" style={{ color: color, fontFamily: 'JetBrains Mono', fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {credential.vcHash}
          </span>
          <ExternalLink size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        </div>
      </div>
    </motion.div>
  );
}
