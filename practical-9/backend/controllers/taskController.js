const Task = require("../models/Task");
const cacheService = require("../cache/cacheService");

/**
 * @desc    Get all tasks (with in-memory caching)
 * @route   GET /api/tasks
 * @access  Public
 */
exports.getAllTasks = async (req, res, next) => {
  const startTime = process.hrtime.bigint();
  try {
    const { completed, priority, noCache } = req.query;
    const filter = {};

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }
    if (priority) {
      filter.priority = priority.toLowerCase();
    }

    // Determine cache key based on query filters
    const querySuffix = Object.keys(filter).length > 0 ? `_${JSON.stringify(filter)}` : "";
    const cacheKey = `all_tasks${querySuffix}`;

    // Step 1: Check cache unless caller explicitly requested bypass (?noCache=true)
    const shouldBypassCache = noCache === "true";
    if (!shouldBypassCache) {
      const cachedData = cacheService.get(cacheKey);
      if (cachedData !== null) {
        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1e6;

        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Response-Time-Ms", durationMs.toFixed(3));

        return res.status(200).json({
          success: true,
          cached: true,
          source: "node-cache (in-memory)",
          cacheKey,
          executionTimeMs: Number(durationMs.toFixed(3)),
          count: cachedData.length,
          data: cachedData
        });
      }
    }

    // Step 2: Cache Miss - Query MongoDB
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    // Step 3: Populate cache for subsequent requests (unless bypass was forced)
    if (!shouldBypassCache) {
      cacheService.set(cacheKey, tasks);
    }

    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1e6;

    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time-Ms", durationMs.toFixed(3));

    return res.status(200).json({
      success: true,
      cached: false,
      source: "MongoDB (disk query)",
      cacheKey,
      executionTimeMs: Number(durationMs.toFixed(3)),
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single task by ID (Supplementary Problem: Individual key caching)
 * @route   GET /api/tasks/:id
 * @access  Public
 */
exports.getTaskById = async (req, res, next) => {
  const startTime = process.hrtime.bigint();
  try {
    const taskId = req.params.id;
    const cacheKey = `task_${taskId}`;

    // Check single-item cache
    const cachedTask = cacheService.get(cacheKey);
    if (cachedTask !== null) {
      const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-Response-Time-Ms", durationMs.toFixed(3));

      return res.status(200).json({
        success: true,
        cached: true,
        source: "node-cache (in-memory)",
        cacheKey,
        executionTimeMs: Number(durationMs.toFixed(3)),
        data: cachedTask
      });
    }

    // Cache Miss - Query database
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${taskId}' not found`
      });
    }

    // Cache single task for 120 seconds
    cacheService.set(cacheKey, task, 120);

    const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time-Ms", durationMs.toFixed(3));

    return res.status(200).json({
      success: true,
      cached: false,
      source: "MongoDB (disk query)",
      cacheKey,
      executionTimeMs: Number(durationMs.toFixed(3)),
      data: task
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new task (Cache Invalidation on Write)
 * @route   POST /api/tasks
 * @access  Public
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, completed } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      completed
    });

    // Invalidate list caches immediately so stale data is never served
    cacheService.invalidateTasksCache();

    res.status(201).json({
      success: true,
      message: "Task created and cache invalidated successfully",
      cacheInvalidated: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update task by ID (Cache Invalidation on Write)
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${req.params.id}' not found`
      });
    }

    // Invalidate both collection cache and specific task item cache
    cacheService.invalidateTasksCache(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task updated and cache invalidated successfully",
      cacheInvalidated: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete task by ID (Cache Invalidation on Write)
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${req.params.id}' not found`
      });
    }

    // Invalidate both collection cache and specific task item cache
    cacheService.invalidateTasksCache(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted and cache invalidated successfully",
      cacheInvalidated: true,
      deletedId: req.params.id
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get real-time cache statistics (Supplementary Problem: Debug endpoint)
 * @route   GET /api/tasks/cache/stats
 * @access  Public
 */
exports.getCacheStats = (req, res) => {
  const stats = cacheService.getStats();
  res.status(200).json({
    success: true,
    stats
  });
};

/**
 * @desc    Clear / Flush in-memory cache manually
 * @route   DELETE /api/tasks/cache/clear
 * @access  Public
 */
exports.clearCache = (req, res) => {
  cacheService.flush();
  res.status(200).json({
    success: true,
    message: "In-memory cache cleared successfully",
    stats: cacheService.getStats()
  });
};

/**
 * @desc    Execute live benchmark comparison (5 uncached vs 5 cached readings)
 * @route   GET /api/tasks/benchmark/compare
 * @access  Public
 */
exports.runBenchmark = async (req, res, next) => {
  try {
    const uncachedReadings = [];
    const cachedReadings = [];

    // Warm up collection if empty
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.create([
        { title: "Sample Task 1", priority: "high", completed: false },
        { title: "Sample Task 2", priority: "medium", completed: true },
        { title: "Sample Task 3", priority: "low", completed: false }
      ]);
    }

    // 1. Take 3 uncached readings (direct MongoDB query)
    for (let i = 1; i <= 3; i++) {
      const t0 = process.hrtime.bigint();
      const docs = await Task.find().lean();
      const t1 = process.hrtime.bigint();
      const latency = Number(t1 - t0) / 1e6;
      uncachedReadings.push({
        sample: i,
        source: "MongoDB (Uncached / Query)",
        latencyMs: Number(latency.toFixed(3)),
        count: docs.length
      });
    }

    // Populate cache for cached readings
    const allTasks = await Task.find().lean();
    cacheService.set("benchmark_tasks", allTasks);

    // 2. Take 3 cached readings (node-cache in-memory hit)
    for (let i = 1; i <= 3; i++) {
      const t0 = process.hrtime.bigint();
      const docs = cacheService.get("benchmark_tasks");
      const t1 = process.hrtime.bigint();
      const latency = Number(t1 - t0) / 1e6;
      cachedReadings.push({
        sample: i,
        source: "node-cache (In-Memory Hit)",
        latencyMs: Number(latency.toFixed(3)),
        count: docs ? docs.length : 0
      });
    }

    const avgUncached = uncachedReadings.reduce((sum, r) => sum + r.latencyMs, 0) / uncachedReadings.length;
    const avgCached = cachedReadings.reduce((sum, r) => sum + r.latencyMs, 0) / cachedReadings.length;
    const speedup = (avgUncached / (avgCached || 0.001)).toFixed(1);
    const reductionPercent = (((avgUncached - avgCached) / avgUncached) * 100).toFixed(1);

    res.status(200).json({
      success: true,
      comparison: {
        uncachedReadings,
        cachedReadings,
        avgUncachedMs: Number(avgUncached.toFixed(3)),
        avgCachedMs: Number(avgCached.toFixed(3)),
        speedupMultiplier: `${speedup}x faster`,
        latencyReductionPercent: `${reductionPercent}% reduction`
      }
    });
  } catch (err) {
    next(err);
  }
};
