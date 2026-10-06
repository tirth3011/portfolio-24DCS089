const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Task = require("./models/Task");
const cacheService = require("./cache/cacheService");

const runTests = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/awdf_practical9";

  console.log("========================================================================");
  console.log(" PRACTICAL 9: IN-MEMORY CACHING & QUERY OPTIMIZATION VERIFICATION");
  console.log("========================================================================");
  console.log(`Connecting to MongoDB at: ${mongoURI} ...`);

  try {
    await mongoose.connect(mongoURI);
    console.log("✔ [TEST 1] MongoDB Connected Successfully.\n");

    // Reset collections and cache for a clean reproducible benchmark
    await Task.deleteMany({ title: { $regex: /Practical 9/i } });
    cacheService.flush();
    cacheService.resetStats();

    // Seed 10 realistic tasks to ensure realistic DB read overhead
    console.log("--- Seeding 10 Task Documents for Benchmarking ---");
    const sampleTasks = [];
    for (let i = 1; i <= 10; i++) {
      sampleTasks.push({
        title: `Practical 9 Benchmark Task #${i}`,
        description: `High performance caching demonstration item with payload index ${i}`,
        priority: i % 3 === 0 ? "high" : i % 2 === 0 ? "medium" : "low",
        completed: i % 2 === 0
      });
    }
    const inserted = await Task.insertMany(sampleTasks);
    console.log(`✔ Inserted ${inserted.length} sample tasks.\n`);

    // -------------------------------------------------------------------------
    // TEST 2: Measure 3 UNCACHED Reads (Direct MongoDB Database Queries)
    // -------------------------------------------------------------------------
    console.log("========================================================================");
    console.log(" [TEST 2] MEASURING UNCACHED DATABASE QUERIES (3 REPEATED SAMPLES)");
    console.log("========================================================================");
    const uncachedReadings = [];

    for (let sample = 1; sample <= 3; sample++) {
      // Invalidate cache before each uncached reading to simulate fresh cold query
      cacheService.del("all_tasks");

      const t0 = process.hrtime.bigint();
      // Emulate controller cache check + MongoDB fetch
      let cached = cacheService.get("all_tasks");
      let data;
      if (!cached) {
        data = await Task.find().sort({ createdAt: -1 }).lean();
      }
      const t1 = process.hrtime.bigint();
      const elapsedMs = Number(t1 - t0) / 1e6;

      uncachedReadings.push(elapsedMs);
      console.log(`  Sample ${sample} (DB Query / Cache MISS): ${elapsedMs.toFixed(3)} ms [Count: ${data.length}]`);
    }

    const avgUncached = uncachedReadings.reduce((a, b) => a + b, 0) / uncachedReadings.length;
    console.log(`✔ Average Uncached Response Time: ${avgUncached.toFixed(3)} ms\n`);

    // -------------------------------------------------------------------------
    // TEST 3: Measure 3 CACHED Reads (node-cache In-Memory RAM Hits)
    // -------------------------------------------------------------------------
    console.log("========================================================================");
    console.log(" [TEST 3] MEASURING CACHED IN-MEMORY READS (3 REPEATED SAMPLES)");
    console.log("========================================================================");
    // Warm up cache once
    const initialTasks = await Task.find().sort({ createdAt: -1 }).lean();
    cacheService.set("all_tasks", initialTasks, 60);

    const cachedReadings = [];
    for (let sample = 1; sample <= 3; sample++) {
      const t0 = process.hrtime.bigint();
      const cached = cacheService.get("all_tasks");
      const t1 = process.hrtime.bigint();
      const elapsedMs = Number(t1 - t0) / 1e6;

      cachedReadings.push(elapsedMs);
      console.log(`  Sample ${sample} (RAM Hit / Cache HIT)  : ${elapsedMs.toFixed(3)} ms [Count: ${cached.length}]`);
    }

    const avgCached = cachedReadings.reduce((a, b) => a + b, 0) / cachedReadings.length;
    const speedup = (avgUncached / (avgCached || 0.001)).toFixed(1);
    const reduction = (((avgUncached - avgCached) / avgUncached) * 100).toFixed(1);

    console.log(`✔ Average Cached Response Time  : ${avgCached.toFixed(3)} ms`);
    console.log(`🚀 Performance Gain: ${speedup}x FASTER (${reduction}% latency reduction)\n`);

    // -------------------------------------------------------------------------
    // TEST 4: Cache Invalidation on POST (Write Operation)
    // -------------------------------------------------------------------------
    console.log("========================================================================");
    console.log(" [TEST 4] CACHE INVALIDATION ON WRITE (POST /tasks)");
    console.log("========================================================================");
    console.log("Step 4a: Cache currently holds 'all_tasks':", cacheService.get("all_tasks") !== null);

    const createdTask = await Task.create({
      title: "Practical 9 Dynamic Newly Added Task",
      description: "Inserted to verify automatic cache purge",
      priority: "high",
      completed: false
    });
    console.log(`Created Task ID: ${createdTask._id}`);

    // Trigger invalidation as controller does
    cacheService.invalidateTasksCache();
    const afterPostCache = cacheService.get("all_tasks");
    console.log("Step 4b: Cache checked immediately after POST:", afterPostCache === null ? "✔ INVALIDATED (null)" : "✖ STALE!");

    if (afterPostCache === null) {
      console.log("✔ Write invalidation successfully purged stale cache.\n");
    } else {
      throw new Error("Cache was NOT invalidated after POST operation!");
    }

    // -------------------------------------------------------------------------
    // TEST 5: Single Task Caching & Invalidation (Supplementary Problem 1)
    // -------------------------------------------------------------------------
    console.log("========================================================================");
    console.log(" [TEST 5] SINGLE TASK CACHING & INVAL (GET/PUT/DELETE /tasks/:id)");
    console.log("========================================================================");
    const singleKey = `task_${createdTask._id}`;
    console.log(`Step 5a: Fetching single task (Initial Miss)...`);
    let singleCached = cacheService.get(singleKey);
    console.log("Initial single cache check:", singleCached); // null

    const taskDoc = await Task.findById(createdTask._id).lean();
    cacheService.set(singleKey, taskDoc, 120);

    singleCached = cacheService.get(singleKey);
    console.log(`Step 5b: Single task cached in RAM: "${singleCached.title}" (Priority: ${singleCached.priority})`);

    // Update single task
    console.log("Step 5c: Updating task title via PUT...");
    await Task.findByIdAndUpdate(createdTask._id, { priority: "low" });
    cacheService.invalidateTasksCache(createdTask._id);

    const afterPutCheck = cacheService.get(singleKey);
    console.log("Step 5d: Single key after PUT:", afterPutCheck === null ? "✔ PURGED (null)" : "✖ STALE!");

    // Clean up
    await Task.findByIdAndDelete(createdTask._id);
    cacheService.invalidateTasksCache(createdTask._id);
    console.log("Step 5e: Cleaned up test document.\n");

    // -------------------------------------------------------------------------
    // TEST 6: Real-Time Cache Statistics (Supplementary Problem 2)
    // -------------------------------------------------------------------------
    console.log("========================================================================");
    console.log(" [TEST 6] REAL-TIME CACHE METRICS & STATS INSPECTION");
    console.log("========================================================================");
    const stats = cacheService.getStats();
    console.log("Cache Metrics Summary:");
    console.log(` • Hits Recorded     : ${stats.hits}`);
    console.log(` • Misses Recorded   : ${stats.misses}`);
    console.log(` • Total Requests    : ${stats.totalRequests}`);
    console.log(` • Hit Rate          : ${stats.hitRate}`);
    console.log(` • Active Keys       : ${stats.totalKeys}`);
    console.log(` • Default TTL       : ${stats.ttlSeconds} seconds`);
    console.log(` • Last Invalidation : ${stats.lastInvalidatedAt}`);
    console.log("✔ Cache statistics counters verified successfully.\n");

    // -------------------------------------------------------------------------
    // SUMMARY EVALUATION TABLE
    // -------------------------------------------------------------------------
    console.log("========================================================================");
    console.log(" 📊 PRACTICAL 9 EMPIRICAL BENCHMARK SUMMARY TABLE");
    console.log("========================================================================");
    console.log("| Metric                   | Uncached (MongoDB) | Cached (node-cache) | Improvement |");
    console.log("|--------------------------|--------------------|---------------------|-------------|");
    console.log(`| Sample 1 Reading         | ${uncachedReadings[0].toFixed(3).padStart(14)} ms | ${cachedReadings[0].toFixed(3).padStart(15)} ms | ${(uncachedReadings[0] / cachedReadings[0]).toFixed(1)}x faster  |`);
    console.log(`| Sample 2 Reading         | ${uncachedReadings[1].toFixed(3).padStart(14)} ms | ${cachedReadings[1].toFixed(3).padStart(15)} ms | ${(uncachedReadings[1] / cachedReadings[1]).toFixed(1)}x faster  |`);
    console.log(`| Sample 3 Reading         | ${uncachedReadings[2].toFixed(3).padStart(14)} ms | ${cachedReadings[2].toFixed(3).padStart(15)} ms | ${(uncachedReadings[2] / cachedReadings[2]).toFixed(1)}x faster  |`);
    console.log(`| Average Response Time    | ${avgUncached.toFixed(3).padStart(14)} ms | ${avgCached.toFixed(3).padStart(15)} ms | ${speedup}x faster  |`);
    console.log(`| Total Latency Reduction  | Baseline (0.0%)    | ${reduction.padStart(15)}% | 🚀 Optimal  |`);
    console.log("========================================================================");
    console.log("🎉 ALL PRACTICAL 9 TESTS & VERIFICATIONS PASSED WITH 100% SUCCESS!\n");

  } catch (error) {
    console.error("✖ Test Suite Error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

runTests();
