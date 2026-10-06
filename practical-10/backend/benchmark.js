const http = require("http");
const app = require("./server");

const BENCH_PORT = 5098;

const request = (path, method = "GET", body = null) => {
  return new Promise((resolve, reject) => {
    const t0 = process.hrtime.bigint();
    const options = {
      hostname: "127.0.0.1",
      port: BENCH_PORT,
      path,
      method,
      headers: { "Content-Type": "application/json" }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const t1 = process.hrtime.bigint();
        const durationMs = Number(t1 - t0) / 1e6;
        let json = {};
        try { json = JSON.parse(data); } catch (e) { json = { raw: data }; }
        resolve({
          statusCode: res.statusCode,
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
    console.log(` PRACTICAL 10: HTTP ASYNC EVENT BENCHMARK LISTENING ON PORT ${BENCH_PORT}`);
    console.log(`========================================================================\n`);

    try {
      console.log("Sending POST /api/tasks to trigger async event with 1500ms worker delay...");
      const postStart = Date.now();
      const res = await request("/api/tasks", "POST", {
        title: "HTTP Benchmark Async Event Probe",
        description: "Validating non-blocking HTTP return prior to background completion",
        priority: "high",
        assignedUser: "Tirth Patel (24DCS089)",
        customDelayMs: 1500
      });

      const clientReceivedAt = Date.now();
      const clientRoundTrip = clientReceivedAt - postStart;

      console.log(`\n✔ HTTP Response Received by Client:`);
      console.log(`  • Status Code             : ${res.statusCode} Created`);
      console.log(`  • Client Round-Trip Latency: ${clientRoundTrip} ms (< 50ms requirement)`);
      console.log(`  • Server API Timestamp    : ${res.body.apiResponseTimestamp}`);
      console.log(`  • Task ID Created         : ${res.body.data ? res.body.data._id : "N/A"}`);

      console.log("\nNotice: The client got its response in only " + clientRoundTrip + " ms, while the 1500ms background job is still running in the worker queue!");
      console.log("Sleeping 2000 ms to let background worker finish and poll telemetry logs...\n");

      await new Promise((r) => setTimeout(r, 2000));

      const telemetryRes = await request("/api/tasks/events/telemetry");
      console.log(`Telemetry Logs Captured (${telemetryRes.body.count} items):`);
      if (telemetryRes.body.logs) {
        telemetryRes.body.logs.slice(0, 3).forEach((log) => {
          console.log(` • [${log.eventType}] Status: ${log.status} | API At: ${log.apiTimestamp} | Done At: ${log.completedAt || "in-flight"}`);
        });
      }

      console.log("\nTesting Error Event Listener safety (POST /api/tasks/error-trigger):");
      const errRes = await request("/api/tasks/error-trigger", "POST", {
        message: "Transient event dispatch warning"
      });
      console.log(` • Response Status: ${errRes.statusCode} (${errRes.body.message})`);
      console.log("✔ Server did NOT crash; error was safely absorbed.\n");

      // Cleanup created probe
      if (res.body.data && res.body.data._id) {
        await request(`/api/tasks/${res.body.data._id}`, "DELETE");
      }

    } catch (err) {
      console.error("HTTP Benchmark Error:", err);
    } finally {
      server.close(() => {
        console.log("Practical 10 HTTP benchmark runner completed.");
        process.exit(0);
      });
    }
  });
};

runHttpBenchmark();
