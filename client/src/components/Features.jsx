import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const MIN_METRIC = 60;
const MAX_METRIC = 95;
const FLUCTUATION = 2;
const METRICS_CACHE_KEY = 'nexus_metrics_cache';
const CRITICAL_THRESHOLD = 90;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fluctuate(prev) {
  const delta = (Math.random() - 0.5) * 2 * FLUCTUATION;
  return clamp(prev + delta, MIN_METRIC, MAX_METRIC);
}

function loadCachedMetrics() {
  try {
    const raw = localStorage.getItem(METRICS_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.metrics && data?.chartHistory) return data;
  } catch (e) {}
  return null;
}

function saveCachedMetrics(metrics, chartHistory) {
  try {
    localStorage.setItem(METRICS_CACHE_KEY, JSON.stringify({ metrics, chartHistory }));
  } catch (e) {}
}

const defaultMetrics = { cpu: 72, memory: 78, networkIO: 68 };
const defaultHistory = {
  cpu: [72, 70, 74, 71, 76, 73, 75, 72, 74],
  memory: [78, 76, 79, 77, 80, 78, 79, 77, 78],
  networkIO: [68, 66, 70, 67, 71, 69, 70, 68, 69],
};

export default function Features({ totalUsers }) {
  const cached = loadCachedMetrics();
  const [metrics, setMetrics] = useState(cached?.metrics ?? defaultMetrics);
  const [chartHistory, setChartHistory] = useState(cached?.chartHistory ?? defaultHistory);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const next = {
          cpu: fluctuate(prev.cpu),
          memory: fluctuate(prev.memory),
          networkIO: fluctuate(prev.networkIO),
        };
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setChartHistory((prev) => ({
      cpu: [...prev.cpu.slice(1), metrics.cpu],
      memory: [...prev.memory.slice(1), metrics.memory],
      networkIO: [...prev.networkIO.slice(1), metrics.networkIO],
    }));
  }, [metrics]);

  useEffect(() => {
    saveCachedMetrics(metrics, chartHistory);
  }, [metrics, chartHistory]);

  const isCritical = metrics.cpu > CRITICAL_THRESHOLD || metrics.memory > CRITICAL_THRESHOLD || metrics.networkIO > CRITICAL_THRESHOLD;

  const chartConfigs = useMemo(
    () => [
      { key: 'cpu', label: 'CPU Usage', history: chartHistory.cpu, color: 'bg-cyan-500/50' },
      { key: 'memory', label: 'Memory', history: chartHistory.memory, color: 'bg-blue-500/50' },
      { key: 'networkIO', label: 'Network I/O', history: chartHistory.networkIO, color: 'bg-cyan-400/50' },
    ],
    [chartHistory]
  );

  return (
    <section id="features" className="px-6 pb-24">
      {/* Dashboard */}
      <motion.div
        id="dashboard"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-24"
      >
        <motion.div
          className={`backdrop-blur-md bg-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border-2 ${
            isCritical ? 'border-red-500/80' : 'border border-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-white">Cloud Monitoring Dashboard</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isCritical ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className="text-white/90 text-sm font-medium">{isCritical ? 'High load' : 'Live'}</span>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chartConfigs.map((config, i) => (
              <motion.div
                key={config.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 h-40 flex flex-col transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white/90 text-sm font-medium mb-2">{config.label}</div>
                <div className="flex-1 flex items-end gap-1">
                  {config.history.map((h, j) => (
                    <motion.div
                      key={`${config.key}-${j}`}
                      layout
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 24,
                      }}
                      className={`flex-1 rounded-t min-h-[6px] ${config.color}`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className={`text-center transition-transform duration-300 ${metrics.cpu > CRITICAL_THRESHOLD ? 'rounded-lg border border-red-500/60 bg-red-500/10' : ''}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-white/80 text-xs uppercase tracking-wider font-medium">CPU Usage</div>
              <motion.div
                key={metrics.cpu}
                initial={{ opacity: 0.7, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`font-bold text-lg ${metrics.cpu > CRITICAL_THRESHOLD ? 'text-red-400' : 'text-white'}`}
              >
                {Math.round(metrics.cpu)}%
              </motion.div>
            </motion.div>
            <motion.div
              className={`text-center transition-transform duration-300 ${metrics.memory > CRITICAL_THRESHOLD ? 'rounded-lg border border-red-500/60 bg-red-500/10' : ''}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-white/80 text-xs uppercase tracking-wider font-medium">Memory</div>
              <motion.div
                key={metrics.memory}
                initial={{ opacity: 0.7, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`font-bold text-lg ${metrics.memory > CRITICAL_THRESHOLD ? 'text-red-400' : 'text-white'}`}
              >
                {Math.round(metrics.memory)}%
              </motion.div>
            </motion.div>
            <motion.div
              className={`text-center transition-transform duration-300 ${metrics.networkIO > CRITICAL_THRESHOLD ? 'rounded-lg border border-red-500/60 bg-red-500/10' : ''}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-white/80 text-xs uppercase tracking-wider font-medium">Network I/O</div>
              <motion.div
                key={metrics.networkIO}
                initial={{ opacity: 0.7, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`font-bold text-lg ${metrics.networkIO > CRITICAL_THRESHOLD ? 'text-red-400' : 'text-white'}`}
              >
                {Math.round(metrics.networkIO)}%
              </motion.div>
            </motion.div>
            <motion.div className="text-center transition-transform duration-300" whileHover={{ scale: 1.05 }}>
              <div className="text-white/80 text-xs uppercase tracking-wider font-medium">Disk</div>
              <div className="text-white font-bold text-lg">{Math.round((metrics.cpu + metrics.memory) / 2)}%</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        id="stats"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white text-center mb-8">
            Live System Nodes
          </h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center transition-transform duration-300 hover:scale-105">
              <motion.div
                key={totalUsers}
                initial={{ opacity: 0.8, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl md:text-5xl font-display font-bold text-cyan-400"
              >
                {totalUsers !== null ? totalUsers : '—'}
              </motion.div>
              <div className="text-white/90 text-sm mt-1 font-medium">Total Users</div>
            </div>
            <div className="text-center transition-transform duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-display font-bold text-white">99.9%</div>
              <div className="text-white/90 text-sm mt-1 font-medium">Uptime</div>
            </div>
            <div className="text-center transition-transform duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-display font-bold text-white">&lt;50ms</div>
              <div className="text-white/90 text-sm mt-1 font-medium">Latency</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
