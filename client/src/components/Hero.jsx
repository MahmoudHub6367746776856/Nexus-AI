import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero({ showToast, apiBase, onWaitlistSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        const submittedEmail = email.trim();
        setEmail('');
        showToast('You’ve been added to the waitlist. We’ll notify you when Nexus AI launches.');
        onWaitlistSuccess?.(submittedEmail);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Something went wrong. Try again.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-4"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            Nexus
          </motion.span>{' '}
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            AI
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12"
        >
          Intelligent cloud infrastructure. Monitor, scale, and optimize your systems with AI-powered insights.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="flex-1 px-5 py-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-60"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Joining...' : 'Join Waitlist'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
