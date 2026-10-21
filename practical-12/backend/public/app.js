document.addEventListener("DOMContentLoaded", () => {
  const statusIcon = document.getElementById("statusIcon");
  const statusTitle = document.getElementById("statusTitle");
  const statusMeta = document.getElementById("statusMeta");
  const statusBadge = document.getElementById("statusBadge");
  const terminalLogs = document.getElementById("terminalLogs");
  const btnToggleFail = document.getElementById("btnToggleFail");
  const btnReRun = document.getElementById("btnReRun");
  const testStepIcon = document.getElementById("testStepIcon");

  async function fetchStatus() {
    try {
      const res = await fetch("/api/tasks/ci/status");
      const data = await res.json();
      if (data.success) {
        updateUI(data.pipeline);
      }
    } catch (err) {
      console.warn("CI status error:", err);
    }
  }

  function updateUI(p) {
    if (p.status === "success") {
      statusIcon.className = "status-icon status-success";
      statusIcon.textContent = "✔";
      statusTitle.textContent = "Workflow: build-and-test (Passing)";
      statusMeta.textContent = `Commit: ${p.commitSha} (main) • Branch: ${p.branch} • ${p.passedTests}/${p.totalTests} Tests Passing`;
      statusBadge.style.background = "#238636";
      statusBadge.textContent = "passing";
      testStepIcon.textContent = "✔";
      testStepIcon.style.color = "#3fb950";
      terminalLogs.style.color = "#7ee787";
      btnToggleFail.textContent = "⚠️ Trigger Test Failure Demo";
      btnToggleFail.className = "btn btn-toggle";
    } else {
      statusIcon.className = "status-icon status-failure";
      statusIcon.textContent = "✖";
      statusTitle.textContent = "Workflow: build-and-test (Failing)";
      statusMeta.textContent = `Commit: ${p.commitSha} (main) • Step 'Run npm test' exited with code 1`;
      statusBadge.style.background = "#da3633";
      statusBadge.textContent = "failing";
      testStepIcon.textContent = "✖";
      testStepIcon.style.color = "#f85149";
      terminalLogs.style.color = "#f85149";
      btnToggleFail.textContent = "🔄 Fix Test & Restore Pipeline";
      btnToggleFail.className = "btn btn-run";
    }

    terminalLogs.textContent = p.logs.join("\n");
  }

  btnToggleFail.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/tasks/ci/toggle-fail", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        updateUI(data.pipeline);
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  });

  btnReRun.addEventListener("click", () => {
    terminalLogs.textContent = "Re-running CI jobs on GitHub runner...";
    setTimeout(fetchStatus, 800);
  });

  fetchStatus();
});
