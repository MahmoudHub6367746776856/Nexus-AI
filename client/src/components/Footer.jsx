import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="backdrop-blur-md bg-white/10 border-t border-white/20 py-8 px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display font-semibold text-white">Nexus AI</span>
        <div className="flex gap-6 text-white/80 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      <p className="text-center text-white/70 text-sm mt-6">
        © {new Date().getFullYear()} Nexus AI. All rights reserved.
      </p>
    </motion.footer>
  );
}
