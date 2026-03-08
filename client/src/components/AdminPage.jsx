import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const API_BASE = '';
const ADMIN_KEY = 'nexus-admin';

function useAdminAuth() {
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    if (key === ADMIN_KEY) {
      try {
        localStorage.setItem('nexus_admin_key', key);
      } catch (e) {}
      setAuthorized(true);
      return;
    }
    try {
      const stored = localStorage.getItem('nexus_admin_key');
      setAuthorized(stored === ADMIN_KEY);
    } catch {
      setAuthorized(false);
    }
  }, []);
  return authorized;
}

export default function AdminPage() {
  const authorized = useAdminAuth();
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWaitlist = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ key: ADMIN_KEY });
    fetch(`${API_BASE}/api/admin/waitlist?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setWaitlist(data.waitlist || []);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load');
        setWaitlist([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (authorized) fetchWaitlist();
  }, [authorized, fetchWaitlist]);

  const handleDelete = (index) => {
    const params = new URLSearchParams({ key: ADMIN_KEY });
    fetch(`${API_BASE}/api/admin/waitlist/${index}?${params}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        fetchWaitlist();
      })
      .catch(() => setError('Delete failed'));
  };

  if (!authorized) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center px-6"
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <h2 className="font-display font-bold text-xl text-white mb-2">Access Denied</h2>
          <p className="text-white/80 text-sm">
            Use <code className="bg-black/30 px-2 py-1 rounded text-cyan-300">/admin?key=nexus-admin</code> to access this page.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-28 pb-24 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-3xl text-white mb-6">Waitlist Admin</h1>
        {error && (
          <div className="backdrop-blur-md bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-2 text-red-200 text-sm mb-4">
            {error}
          </div>
        )}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
          {loading ? (
            <div className="p-8 text-center text-white/80">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-6 py-4 text-white/90 font-semibold">#</th>
                    <th className="px-6 py-4 text-white/90 font-semibold">Email</th>
                    <th className="px-6 py-4 text-white/90 font-semibold">Joined</th>
                    <th className="px-6 py-4 text-white/90 font-semibold w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((entry, index) => (
                    <motion.tr
                      key={`${entry.email}-${entry.timestamp}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/10"
                    >
                      <td className="px-6 py-3 text-white/80">{index + 1}</td>
                      <td className="px-6 py-3 text-white font-medium">{entry.email}</td>
                      <td className="px-6 py-3 text-white/70 text-sm">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}
                      </td>
                      <td className="px-6 py-3">
                        <motion.button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/30 border border-red-400/50 text-red-200 text-sm font-medium hover:bg-red-500/50 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && waitlist.length === 0 && !error && (
            <div className="p-8 text-center text-white/70">No users yet.</div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
