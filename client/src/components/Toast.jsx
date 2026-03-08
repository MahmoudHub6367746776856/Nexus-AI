import { motion } from 'framer-motion';

export default function Toast({ message, type = 'success' }) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 py-4 shadow-xl"
      >
        <p className="text-white font-medium">{message}</p>
      </motion.div>
  );
}
