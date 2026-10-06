const NodeCache = require("node-cache");

// Initialize NodeCache instance with default TTL from env or 60 seconds
const defaultTTL = parseInt(process.env.CACHE_TTL_SECONDS, 10) || 60;
const cache = new NodeCache({
  stdTTL: defaultTTL,
  checkperiod: 120,
  useClones: false // performance optimization: avoid unnecessary deep clones in memory
});

// Cache performance and debugging metrics
const metrics = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0,
  flushes: 0,
  lastInvalidatedAt: null,
  history: []
};

// Log event listeners for visibility
cache.on("set", (key, value) => {
  metrics.sets += 1;
});

cache.on("del", (key, value) => {
  metrics.deletes += 1;
});

cache.on("expired", (key, value) => {
  metrics.history.push({ event: "expired", key, at: new Date().toISOString() });
  if (metrics.history.length > 50) metrics.history.shift();
});

const cacheService = {
  // Underlying NodeCache instance
  instance: cache,

  /**
   * Retrieve cached value by key
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const value = cache.get(key);
    if (value !== undefined) {
      metrics.hits += 1;
      return value;
    }
    metrics.misses += 1;
    return null;
  },

  /**
   * Store value into in-memory cache
   * @param {string} key
   * @param {any} value
   * @param {number} ttl - Optional TTL in seconds
   */
  set(key, value, ttl = defaultTTL) {
    return cache.set(key, value, ttl);
  },

  /**
   * Invalidate/Delete specific cache key
   * @param {string} key
   */
  del(key) {
    metrics.lastInvalidatedAt = new Date().toISOString();
    metrics.history.push({ event: "del", key, at: metrics.lastInvalidatedAt });
    if (metrics.history.length > 50) metrics.history.shift();
    return cache.del(key);
  },

  /**
   * Invalidate multiple keys matching a pattern / prefix
   * Useful for clearing "all_tasks" and any filtered task queries
   */
  delPattern(pattern) {
    const keys = cache.keys();
    const matched = keys.filter((k) => k.startsWith(pattern) || k.includes(pattern));
    if (matched.length > 0) {
      metrics.lastInvalidatedAt = new Date().toISOString();
      metrics.history.push({ event: "del_pattern", pattern, matched, at: metrics.lastInvalidatedAt });
      if (metrics.history.length > 50) metrics.history.shift();
      return cache.del(matched);
    }
    return 0;
  },

  /**
   * Invalidate all task-related cache entries on mutation (POST, PUT, DELETE)
   */
  invalidateTasksCache(singleId = null) {
    this.delPattern("all_tasks");
    this.delPattern("tasks_list");
    if (singleId) {
      this.del(`task_${singleId}`);
    }
  },

  /**
   * Flush all cache entries
   */
  flush() {
    metrics.flushes += 1;
    metrics.lastInvalidatedAt = new Date().toISOString();
    return cache.flushAll();
  },

  /**
   * Get real-time cache statistics and performance counters
   */
  getStats() {
    const totalRequests = metrics.hits + metrics.misses;
    const hitRatePercent = totalRequests > 0 ? ((metrics.hits / totalRequests) * 100).toFixed(2) : "0.00";

    return {
      keys: cache.keys(),
      totalKeys: cache.keys().length,
      ttlSeconds: defaultTTL,
      hits: metrics.hits,
      misses: metrics.misses,
      totalRequests,
      hitRate: `${hitRatePercent}%`,
      sets: metrics.sets,
      deletes: metrics.deletes,
      flushes: metrics.flushes,
      lastInvalidatedAt: metrics.lastInvalidatedAt,
      stats: cache.getStats()
    };
  },

  /**
   * Reset stats counters for clean benchmark runs
   */
  resetStats() {
    metrics.hits = 0;
    metrics.misses = 0;
    metrics.sets = 0;
    metrics.deletes = 0;
    metrics.flushes = 0;
    metrics.lastInvalidatedAt = null;
    metrics.history = [];
  }
};

module.exports = cacheService;
