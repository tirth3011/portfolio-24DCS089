document.addEventListener("DOMContentLoaded", () => {
  const btnFetchNormal = document.getElementById("btnFetchNormal");
  const btnFetchForceBypass = document.getElementById("btnFetchForceBypass");
  const btnFetchSingle = document.getElementById("btnFetchSingle");
  const btnRefreshStats = document.getElementById("btnRefreshStats");
  const btnCreateTask = document.getElementById("btnCreateTask");
  const btnClearCache = document.getElementById("btnClearCache");
  const btnRunBenchmark = document.getElementById("btnRunBenchmark");
  const btnClearLog = document.getElementById("btnClearLog");
  const inputNewTask = document.getElementById("inputNewTask");

  const metricHits = document.getElementById("metricHits");
  const metricMisses = document.getElementById("metricMisses");
  const metricHitRate = document.getElementById("metricHitRate");
  const metricKeys = document.getElementById("metricKeys");
  const metricLastLatency = document.getElementById("metricLastLatency");
  const metricLastSource = document.getElementById("metricLastSource");

  const badgeCacheStatus = document.getElementById("badgeCacheStatus");
  const txtHttpStatus = document.getElementById("txtHttpStatus");
  const txtXCache = document.getElementById("txtXCache");
  const txtRespTime = document.getElementById("txtRespTime");
  const txtSource = document.getElementById("txtSource");
  const jsonViewer = document.getElementById("jsonViewer");

  const benchmarkResultsBox = document.getElementById("benchmarkResultsBox");
  const benchmarkSummaryText = document.getElementById("benchmarkSummaryText");
  const barUncached = document.getElementById("barUncached");
  const barUncachedVal = document.getElementById("barUncachedVal");
  const barCached = document.getElementById("barCached");
  const barCachedVal = document.getElementById("barCachedVal");

  let firstTaskId = null;

  const updateStats = async () => {
    try {
      const res = await fetch("/api/tasks/cache/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        metricHits.textContent = data.stats.hits;
        metricMisses.textContent = data.stats.misses;
        metricHitRate.textContent = data.stats.hitRate;
        metricKeys.textContent = data.stats.totalKeys;
      }
    } catch (e) {
      console.error("Stats refresh error:", e);
    }
  };

  const handleResponse = (status, xCache, durationMs, body) => {
    txtHttpStatus.textContent = status;
    txtXCache.textContent = xCache || "N/A";
    txtRespTime.textContent = `${durationMs.toFixed(2)} ms`;
    txtSource.textContent = body.source || (body.cacheInvalidated ? "Purged Cache" : "API Response");

    metricLastLatency.textContent = `${durationMs.toFixed(2)} ms`;
    metricLastSource.textContent = xCache === "HIT" ? "node-cache (RAM)" : "MongoDB (Disk)";

    if (xCache === "HIT") {
      badgeCacheStatus.textContent = "CACHE HIT (RAM)";
      badgeCacheStatus.className = "status-pill status-hit";
    } else if (xCache === "MISS") {
      badgeCacheStatus.textContent = "CACHE MISS (DB)";
      badgeCacheStatus.className = "status-pill status-miss";
    } else {
      badgeCacheStatus.textContent = "MUTATION / INVALIDATE";
      badgeCacheStatus.className = "status-pill status-idle";
    }

    jsonViewer.textContent = JSON.stringify(body, null, 2);
    updateStats();
  };

  const executeApi = async (url, options = {}) => {
    const t0 = performance.now();
    try {
      const res = await fetch(url, options);
      const t1 = performance.now();
      const durationMs = t1 - t0;
      const xCache = res.headers.get("X-Cache");
      const body = await res.json();

      if (body.data && Array.isArray(body.data) && body.data.length > 0) {
        firstTaskId = body.data[0]._id;
      }

      handleResponse(res.status, xCache, durationMs, body);
    } catch (err) {
      jsonViewer.textContent = `Error: ${err.message}`;
    }
  };

  // Button actions
  btnFetchNormal.addEventListener("click", () => executeApi("/api/tasks"));
  btnFetchForceBypass.addEventListener("click", () => executeApi("/api/tasks?noCache=true"));
  btnRefreshStats.addEventListener("click", updateStats);

  btnFetchSingle.addEventListener("click", () => {
    if (!firstTaskId) {
      alert("Please fetch all tasks first to acquire an active task ID!");
      return;
    }
    executeApi(`/api/tasks/${firstTaskId}`);
  });

  btnCreateTask.addEventListener("click", () => {
    const title = inputNewTask.value.trim();
    if (!title) return alert("Please enter a title");
    executeApi("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority: "high", description: "Created from live test console" })
    });
  });

  btnClearCache.addEventListener("click", () => {
    executeApi("/api/tasks/cache/clear", { method: "DELETE" });
  });

  btnClearLog.addEventListener("click", () => {
    jsonViewer.textContent = "Log cleared.";
  });

  btnRunBenchmark.addEventListener("click", async () => {
    benchmarkResultsBox.style.display = "block";
    benchmarkSummaryText.innerHTML = "<em>Executing automated benchmark... Please wait.</em>";

    try {
      const res = await fetch("/api/tasks/benchmark/compare");
      const data = await res.json();

      if (data.success && data.comparison) {
        const c = data.comparison;
        benchmarkSummaryText.innerHTML = `
          <strong>Result:</strong> Caching is <strong>${c.speedupMultiplier}</strong> with an average latency drop of 
          <strong>${c.latencyReductionPercent}</strong>!
        `;

        barUncachedVal.textContent = `${c.avgUncachedMs.toFixed(2)} ms`;
        barCachedVal.textContent = `${c.avgCachedMs.toFixed(2)} ms`;

        const maxVal = Math.max(c.avgUncachedMs, 1);
        barUncached.style.width = "100%";
        const cachedPct = Math.max(Math.min((c.avgCachedMs / maxVal) * 100, 100), 4);
        barCached.style.width = `${cachedPct}%`;

        jsonViewer.textContent = JSON.stringify(data, null, 2);
        updateStats();
      }
    } catch (e) {
      benchmarkSummaryText.textContent = `Benchmark Error: ${e.message}`;
    }
  });

  // Initial stats fetch
  updateStats();
});
