/**
 * NAMASTE — Loan Explainer & AI Chat Page (Feature 1)
 * Worker-facing conversational AI that explains TrustScore,
 * loan eligibility, government schemes, and improvement steps.
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_WORKER, MOCK_CHAT_HISTORY } from '@/lib/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Local AI engine (mirrors backend chat_service.py logic)
// ---------------------------------------------------------------------------
const SIGNALS = {
  score: MOCK_WORKER.trustScore,
  job_completion_rate: 0.94,
  income_consistency: 0.88,
  vouch_count: 7,
  eshram_status: true,
  bank_linked: false,
  total_dividends: MOCK_WORKER.totalDividends,
  name: MOCK_WORKER.name,
};

function getAIReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('why') && (q.includes('low') || q.includes('score')))
    return `Your score of ${SIGNALS.score} is mainly held back by single-platform dependency — you're only on Swiggy. Workers on 2+ platforms score ~28 pts higher on average due to income diversification. That's your biggest lever right now.`;
  if (q.includes('improve') || q.includes('increase') || q.includes('boost'))
    return `Three fastest ways to improve your score:\n① Join Zomato or Rapido alongside Swiggy (+28 pts in 30 days)\n② Link your PAN to your e-Shram profile on eshram.gov.in (+15 pts instantly)\n③ Maintain 96% job completion for 60 days (+13 pts)\nTotal potential: +56 pts, reaching ~798 (Excellent band).`;
  if (q.includes('what is') || q.includes('how does') || q.includes('explain'))
    return `Your TrustScore (300–900) is a creditworthiness signal built from 6 factors:\n• Job Completion Rate (25%)\n• Income Consistency (20%)\n• Platform Tenure (15%)\n• Payment Punctuality (15%)\n• Peer Vouches (15%)\n• e-Shram Status (10%)\nNo raw personal data is ever shared with lenders — only a cryptographic proof.`;
  if (q.includes('loan') || q.includes('borrow') || q.includes('credit'))
    return `With your score of ${SIGNALS.score} you're pre-qualified for:\n• Up to ₹50,000 at 12% p.a. from Ujjivan SFB or IIFL Finance\n• Recommended amount: ₹35,000 over 18 months (EMI ~₹2,139/mo)\nGenerate a ZK-Proof from the ZK Proof tab to share with your lender — no raw data leaves the app.`;
  if (q.includes('scheme') || q.includes('government') || q.includes('benefit'))
    return `You qualify for 2 government schemes right now:\n① PM SVANidhi — ₹10,000–₹50,000 working capital loan at 7% p.a. (pmsvanidhi.mohua.gov.in)\n② e-Shram Insurance — ₹2 lakh accidental cover (auto-enrolled with your card)\n\nTo unlock PMEGP (up to ₹25 lakh subsidy), link a savings bank account first.`;
  if (q.includes('dividend') || q.includes('earn') || q.includes('money'))
    return `You've earned ₹${SIGNALS.total_dividends.toLocaleString('en-IN')} in data dividends so far. Every time a lender accesses your anonymised profile with your consent, a share of that value is sent to your wallet via smart contract on Polygon — automatically, with a transaction hash you can verify.`;
  if (q.includes('vouch') || q.includes('peer'))
    return `You have ${SIGNALS.vouch_count} verified peer vouches. Each vouch from a worker with a score above 700 adds ~10 points. You need 3 more to reach the maximum vouch signal. Share your Worker ID (${MOCK_WORKER.id}) with trusted colleagues from the Vouching tab.`;
  return `Your TrustScore is ${SIGNALS.score} (Good band). I can help you with:\n• Understanding why your score is what it is\n• Finding the fastest ways to improve it\n• Checking your loan eligibility\n• Matching you with government schemes\n• Understanding your data dividends\n\nWhat would you like to explore?`;
}

// ---------------------------------------------------------------------------
// Quick action chips
// ---------------------------------------------------------------------------
const QUICK_ACTIONS = [
  { label: 'Why is my score 742?', icon: '🔍' },
  { label: 'How can I improve?', icon: '📈' },
  { label: 'Am I eligible for a loan?', icon: '💰' },
  { label: 'What schemes do I qualify for?', icon: '🏛️' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(
    MOCK_CHAT_HISTORY.map(m => ({ ...m, id: m.id }))
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate network latency
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const reply = getAIReply(text);
    const aiMsg: Message = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <AppShell title="AI Assistant" subtitle="Ask anything about your TrustScore, loans, or schemes">
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header card */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(0,184,255,0.06) 100%)',
            border: '1px solid rgba(108,99,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#6C63FF,#00b8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(108,99,255,0.35)' }}>
            <Bot size={26} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>NAMASTE AI Assistant</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>
              Explains your score in plain language · Suggests improvement steps · Matches you with loans & schemes
            </p>
          </div>
          <motion.div
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF9C' }} />
            <span style={{ color: '#00FF9C', fontSize: '0.72rem', fontWeight: 600 }}>Online</span>
          </motion.div>
        </motion.div>

        {/* Chat window */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 480,
            overflow: 'hidden',
          }}
        >
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: msg.role === 'assistant'
                      ? 'linear-gradient(135deg,#6C63FF,#00b8ff)'
                      : 'linear-gradient(135deg,#00b8ff,#2ef2a5)',
                    boxShadow: msg.role === 'assistant'
                      ? '0 4px 12px rgba(108,99,255,0.3)'
                      : '0 4px 12px rgba(0,184,255,0.25)',
                  }}>
                    {msg.role === 'assistant'
                      ? <Bot size={16} color="#fff" />
                      : <User size={16} color="#06101b" />}
                  </div>

                  {/* Bubble */}
                  <div style={{ maxWidth: '78%' }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      background: msg.role === 'user'
                        ? 'rgba(108,99,255,0.18)'
                        : 'rgba(255,255,255,0.04)',
                      border: msg.role === 'user'
                        ? '1px solid rgba(108,99,255,0.3)'
                        : '1px solid rgba(255,255,255,0.07)',
                      fontSize: '0.85rem',
                      lineHeight: 1.65,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-line',
                    }}>
                      {msg.text}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#00b8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="#fff" />
                  </div>
                  <div style={{ padding: '14px 18px', borderRadius: '4px 16px 16px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        style={{ width: 7, height: 7, borderRadius: '50%', background: '#6C63FF' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(108,99,255,0.1)', display: 'flex', gap: 12, background: 'rgba(0,0,0,0.15)' }}>
            <input
              className="input-glass"
              style={{ flex: 1, fontSize: '0.85rem', padding: '12px 16px' }}
              placeholder="Ask about your score, loans, schemes..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isTyping && sendMessage(input)}
              disabled={isTyping}
            />
            <motion.button
              className="btn-primary"
              style={{ padding: '12px 20px', flexShrink: 0 }}
              onClick={() => sendMessage(input)}
              disabled={isTyping || !input.trim()}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>

        {/* Quick action chips */}
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 10 }}>QUICK QUESTIONS</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {QUICK_ACTIONS.map(qa => (
              <motion.button
                key={qa.label}
                style={{
                  background: 'rgba(108,99,255,0.08)',
                  border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: 20,
                  padding: '8px 16px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
                whileHover={{ background: 'rgba(108,99,255,0.18)', borderColor: 'rgba(108,99,255,0.4)', color: '#fff' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => sendMessage(qa.label)}
                disabled={isTyping}
              >
                <span>{qa.icon}</span> {qa.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div className="glass-card p-4" style={{ borderStyle: 'dashed', borderColor: 'rgba(0,255,156,0.2)', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={14} color="#00FF9C" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            All conversations are processed locally. No chat history or personal data is sent to external servers.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
