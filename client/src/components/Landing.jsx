import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './Hero';
import WelcomePage from './WelcomePage';
import Features from './Features';
import Footer from './Footer';
import Toast from './Toast';

const API_BASE = '';

export default function Landing() {
  const [toast, setToast] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [welcomeEmail, setWelcomeEmail] = useState(null);

  const fetchStats = useCallback(() => {
    fetch(`${API_BASE}/api/stats`)
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.totalUsers))
      .catch(() => setTotalUsers(0));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const onWaitlistSuccess = useCallback((email) => {
    if (email) setWelcomeEmail(email);
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <main>
        <AnimatePresence mode="wait">
          {welcomeEmail ? (
            <WelcomePage key="welcome" email={welcomeEmail} apiBase={API_BASE} />
          ) : (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero showToast={showToast} apiBase={API_BASE} onWaitlistSuccess={onWaitlistSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
        <Features totalUsers={totalUsers} />
      </main>
      <Footer />
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </>
  );
}
