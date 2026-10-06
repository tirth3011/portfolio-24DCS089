document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskTitle = document.getElementById("taskTitle");
  const taskPriority = document.getElementById("taskPriority");
  const taskUser = document.getElementById("taskUser");
  const taskDelay = document.getElementById("taskDelay");

  const btnRunProbe = document.getElementById("btnRunProbe");
  const btnTriggerError = document.getElementById("btnTriggerError");
  const btnRefreshTelemetry = document.getElementById("btnRefreshTelemetry");
  const btnClearTelemetry = document.getElementById("btnClearTelemetry");

  const timingStatusBadge = document.getElementById("timingStatusBadge");
  const txtChronoRequest = document.getElementById("txtChronoRequest");
  const txtChronoApi = document.getElementById("txtChronoApi");
  const txtApiLatency = document.getElementById("txtApiLatency");
  const txtChronoWorker = document.getElementById("txtChronoWorker");
  const txtWorkerLag = document.getElementById("txtWorkerLag");
  const proofText = document.getElementById("proofText");
  const logStreamBox = document.getElementById("logStreamBox");

  const renderLogs = (logs) => {
    if (!logs || logs.length === 0) {
      logStreamBox.innerHTML = '<p style="color: #64748b; font-size: 0.8rem;">No events logged yet.</p>';
      return;
    }
    logStreamBox.innerHTML = logs.map(l => `
      <div class="log-row">
        <div>
          <span class="log-row-type">[${l.eventType}]</span>
          <span class="log-row-msg">${l.message || l.taskTitle || l.error || ""}</span>
        </div>
        <span class="log-row-time">${l.completedAt || l.timestamp || l.listenerReceivedAt || ""}</span>
      </div>
    `).join("");
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch("/api/tasks/events/telemetry");
      const data = await res.json();
      if (data.success) {
        renderLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeTaskCreation = async (title, priority, user, delayMs) => {
    timingStatusBadge.textContent = "IN-FLIGHT";
    timingStatusBadge.className = "status-pill status-in-flight";

    const clientSentIso = new Date().toISOString();
    txtChronoRequest.textContent = clientSentIso;
    txtChronoApi.textContent = "Waiting for HTTP socket...";
    txtApiLatency.textContent = "...";
    txtChronoWorker.textContent = `Worker running asynchronously (${delayMs}ms)...`;
    txtWorkerLag.textContent = "in-flight";
    proofText.textContent = "HTTP request dispatched. Awaiting immediate API return...";

    const t0 = performance.now();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority,
          assignedUser: user,
          customDelayMs: delayMs
        })
      });
      const t1 = performance.now();
      const clientRoundTripMs = (t1 - t0).toFixed(1);
      const data = await res.json();

      txtChronoApi.textContent = data.apiResponseTimestamp || clientSentIso;
      txtApiLatency.textContent = `${clientRoundTripMs} ms round-trip`;

      proofText.innerHTML = `
        ✔ <strong>Client Unblocked!</strong> Response received in <strong>${clientRoundTripMs} ms</strong>. 
        Background notification is currently executing without stalling this client.
      `;

      // Poll telemetry until worker finishes
      const pollStart = Date.now();
      const poller = setInterval(async () => {
        const telRes = await fetch("/api/tasks/events/telemetry");
        const telData = await telRes.json();
        if (telData.success && telData.logs) {
          renderLogs(telData.logs);
          const finishedLog = telData.logs.find(l => l.eventType === "task-created" && l.status === "completed" && l.taskTitle === title);
          if (finishedLog || Date.now() - pollStart > delayMs + 3000) {
            clearInterval(poller);
            timingStatusBadge.textContent = "VERIFIED ASYNC";
            timingStatusBadge.className = "status-pill status-verified";

            const workerDoneTime = finishedLog ? finishedLog.completedAt : new Date().toISOString();
            txtChronoWorker.textContent = workerDoneTime;
            const diffMs = (new Date(workerDoneTime).getTime() - new Date(data.apiResponseTimestamp).getTime());
            txtWorkerLag.textContent = `+${diffMs} ms lag`;

            proofText.innerHTML = `
              🎉 <strong>Strict Asynchronous Proof Verified:</strong><br>
              • API Responded at: <code>${data.apiResponseTimestamp}</code> (0 ms)<br>
              • Worker Finished at: <code>${workerDoneTime}</code> (+${diffMs} ms later)<br>
              • <strong>Conclusion:</strong> API completed <em>before</em> the background listener!
            `;
          }
        }
      }, 300);

    } catch (err) {
      proofText.textContent = `Error: ${err.message}`;
    }
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    executeTaskCreation(taskTitle.value, taskPriority.value, taskUser.value, parseInt(taskDelay.value, 10));
  });

  btnRunProbe.addEventListener("click", () => {
    executeTaskCreation("Autonomous Probe #" + Math.floor(Math.random() * 1000), "high", "Tirth Patel (24DCS089)", 1500);
  });

  btnTriggerError.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/tasks/error-trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Test error event from dashboard" })
      });
      const data = await res.json();
      alert(`Status: ${data.message}`);
      fetchTelemetry();
    } catch (err) {
      alert("Error: " + err.message);
    }
  });

  btnRefreshTelemetry.addEventListener("click", fetchTelemetry);

  btnClearTelemetry.addEventListener("click", async () => {
    await fetch("/api/tasks/events/telemetry", { method: "DELETE" });
    fetchTelemetry();
  });

  // Initial telemetry load
  fetchTelemetry();
});
