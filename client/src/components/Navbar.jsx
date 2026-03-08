import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <motion.span
            className="font-display font-bold text-xl text-white tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            Nexus AI
          </motion.span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
            Features
          </a>
          <a href="/#dashboard" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
            Dashboard
          </a>
          <a href="/#stats" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
            Stats
          </a>
          <Link to="/admin">
            <span className="text-white/90 hover:text-white text-sm font-medium transition-colors">Admin</span>
          </Link>
        </div>
        <Link to="/#waitlist">
          <motion.span
            className="inline-block px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Waitlist
          </motion.span>
        </Link>
      </div>
    </motion.nav>
  );
}
