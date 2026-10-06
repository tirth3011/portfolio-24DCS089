const http = require("http");
const app = require("./server");

// Port for benchmark test runner
const BENCH_PORT = 5099;

const request = (path, method = "GET", body = null) => {
  return new Promise((resolve, reject) => {
    const t0 = process.hrtime.bigint();
    const options = {
      hostname: "127.0.0.1",
      port: BENCH_PORT,
      path,
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const t1 = process.hrtime.bigint();
        const durationMs = Number(t1 - t0) / 1e6;
        let json = {};
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = { raw: data };
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          durationMs,
          body: json
        });
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const runHttpBenchmark = async () => {
  const server = app.listen(BENCH_PORT, async () => {
    console.log(`========================================================================`);
    console.log(` HTTP BENCHMARK RUNNER LISTENING ON PORT ${BENCH_PORT}`);
    console.log(` Simulating Postman / Thunder Client Request Performance Measurement`);
    console.log(`========================================================================\n`);

    try {
      // 1. Flush cache to start clean
      await request("/api/tasks/cache/clear", "DELETE");

      // 2. Cold Uncached Requests
      console.log("Measuring Uncached HTTP GET /api/tasks (Cache Miss / MongoDB Fetch):");
      const uncachedTimes = [];
      for (let i = 1; i <= 3; i++) {
        // Clear cache before each to force DB read
        await request("/api/tasks/cache/clear", "DELETE");
        const res = await request("/api/tasks");
        uncachedTimes.push(res.durationMs);
        console.log(`  [Uncached Sample ${i}] Status: ${res.statusCode} | Time: ${res.durationMs.toFixed(2)} ms | X-Cache: ${res.headers["x-cache"]}`);
      }

      // 3. Warm Cached Requests
      console.log("\nMeasuring Cached HTTP GET /api/tasks (Cache Hit / node-cache RAM):");
      // Prime the cache
      await request("/api/tasks");
      const cachedTimes = [];
      for (let i = 1; i <= 3; i++) {
        const res = await request("/api/tasks");
        cachedTimes.push(res.durationMs);
        console.log(`  [Cached Sample ${i}]   Status: ${res.statusCode} | Time: ${res.durationMs.toFixed(2)} ms | X-Cache: ${res.headers["x-cache"]}`);
      }

      const avgUncached = uncachedTimes.reduce((a, b) => a + b, 0) / uncachedTimes.length;
      const avgCached = cachedTimes.reduce((a, b) => a + b, 0) / cachedTimes.length;
      const speedup = (avgUncached / (avgCached || 0.01)).toFixed(1);

      console.log(`\n========================================================================`);
      console.log(` 🚀 POSTMAN-STYLE HTTP BENCHMARK RESULTS`);
      console.log(`========================================================================`);
      console.log(` • Average Uncached HTTP Round-Trip: ${avgUncached.toFixed(2)} ms`);
      console.log(` • Average Cached HTTP Round-Trip  : ${avgCached.toFixed(2)} ms`);
      console.log(` • HTTP Response Speedup           : ${speedup}x FASTER via In-Memory Cache`);
      console.log(`========================================================================\n`);

      // 4. Invalidation Test via POST
      console.log("Testing Cache Invalidation on HTTP POST /api/tasks:");
      const postRes = await request("/api/tasks", "POST", {
        title: "Benchmark Invalidation Probe",
        priority: "high"
      });
      console.log(`  POST Status: ${postRes.statusCode} | Cache Invalidation Flag: ${postRes.body.cacheInvalidated}`);

      const followUpGet = await request("/api/tasks");
      console.log(`  Immediate Follow-Up GET: X-Cache Header is '${followUpGet.headers["x-cache"]}' (Expected: MISS)`);

      if (followUpGet.headers["x-cache"] === "MISS") {
        console.log("  ✔ Invalidation verified: Stale data was prevented successfully!\n");
      }

      // Cleanup created probe
      if (postRes.body.data && postRes.body.data._id) {
        await request(`/api/tasks/${postRes.body.data._id}`, "DELETE");
      }

    } catch (err) {
      console.error("Benchmark error:", err);
    } finally {
      server.close(() => {
        console.log("Benchmark server closed.");
        process.exit(0);
      });
    }
  });
};

runHttpBenchmark();
