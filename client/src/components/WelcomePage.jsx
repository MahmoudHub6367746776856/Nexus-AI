import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TERMINAL_LOGS = [
  { id: 'conn', text: 'Connection established', delay: 400 },
  { id: 'sync', text: 'Data synced', delay: 1200 },
  { id: 'user', text: 'New user added', delay: 2200 },
];

function generateAccessToken() {
  const segment = () => Math.random().toString(36).slice(2, 10);
  return `nexus_${Date.now().toString(36)}_${segment()}`.toUpperCase();
}

const NEXT_STEPS = [
  {
    title: 'Verify your inbox',
    description: 'Check for a confirmation link to activate your early access.',
    step: 1,
  },
  {
    title: 'Join the community',
    description: 'Connect with other pioneers in our Discord and get product updates.',
    step: 2,
  },
  {
    title: 'Prepare your stack',
    description: 'Review our API docs and integration guides before launch.',
    step: 3,
  },
];

export default function WelcomePage({ email, apiBase }) {
  const [memberCount, setMemberCount] = useState(null);
  const [accessToken] = useState(() => generateAccessToken());
  const [terminalLines, setTerminalLines] = useState([]);

  useEffect(() => {
    fetch(`${apiBase}/api/stats`)
      .then((res) => res.json())
      .then((data) => setMemberCount(data.totalUsers))
      .catch(() => setMemberCount(0));
  }, [apiBase]);

  useEffect(() => {
    const timers = TERMINAL_LOGS.map(({ id, text, delay }) =>
      setTimeout(() => setTerminalLines((prev) => [...prev, { id, text }]), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      id="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 px-6 min-h-[80vh]"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white text-center mb-2"
        >
          Welcome to the Nexus Intelligence,{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {email}
          </span>
        </motion.h1>

        {memberCount !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-white/90 text-lg mb-10"
          >
            You are member <span className="font-bold text-cyan-400">#{memberCount}</span> to join our neural mesh.
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-10 transition-transform duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="font-display font-semibold text-white text-lg mb-4">System Status</h3>
          <div className="space-y-3">
            <div>
              <span className="text-white/70 text-sm block mb-1">Live Access Token</span>
              <code className="block px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-cyan-300 font-mono text-sm break-all">
                {accessToken}
              </code>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/90 font-medium">System Health: Optimal</span>
            </div>
          </div>
        </motion.div>

        <h3 className="font-display font-semibold text-white text-xl mb-4">Next Steps</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {NEXT_STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-5 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-cyan-400 font-display font-bold text-lg mb-2">Step {item.step}</div>
              <h4 className="text-white font-semibold mb-2">{item.title}</h4>
              <p className="text-white/80 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 backdrop-blur-md bg-black/40 border border-white/20 rounded-xl overflow-hidden"
        >
          <div className="px-4 py-2 border-b border-white/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-green-500/80" />
            <span className="text-white/70 text-sm font-mono ml-2">Live Terminal</span>
          </div>
          <div className="p-4 font-mono text-sm min-h-[100px]">
            <AnimatePresence>
              {terminalLines.map((line) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-green-400/90 flex items-center gap-2"
                >
                  <span className="text-white/50">&gt;</span>
                  {line.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
