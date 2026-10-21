document.addEventListener("DOMContentLoaded", () => {
  const valHostname = document.getElementById("valHostname");
  const valNetwork = document.getElementById("valNetwork");
  const valMongo = document.getElementById("valMongo");
  const valVolume = document.getElementById("valVolume");
  const valNode = document.getElementById("valNode");
  const valMem = document.getElementById("valMem");
  const valUptime = document.getElementById("valUptime");
  const taskList = document.getElementById("taskList");
  const taskForm = document.getElementById("taskForm");
  const btnRefresh = document.getElementById("btnRefresh");

  async function fetchTelemetry() {
    try {
      const res = await fetch("/api/tasks/docker/status");
      const data = await res.json();
      if (data.success) {
        valHostname.textContent = data.container.hostname;
        valNode.textContent = data.container.nodeVersion;
        valMem.textContent = `${data.container.memoryHeapMb} MB`;
        valUptime.textContent = `${data.container.uptimeSeconds}s`;
        valNetwork.textContent = data.orchestration.network;
        valMongo.textContent = data.orchestration.mongoService + (data.orchestration.mongoConnected ? " (Active)" : " (Standby)");
        valVolume.textContent = data.orchestration.volumeMount;
      }
    } catch (err) {
      console.warn("Telemetry fetch error:", err);
    }
  }

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      taskList.innerHTML = "";
      if (data.data && data.data.length > 0) {
        data.data.forEach(task => {
          const item = document.createElement("div");
          item.className = "task-item";
          item.innerHTML = `
            <div>
              <div class="task-item-title">${task.title}</div>
              <div class="task-item-meta">Host: ${task.containerHost || 'container'} • Priority: ${task.priority.toUpperCase()}</div>
            </div>
            <button class="btn" style="background:#e63946;color:#fff;padding:4px 8px;font-size:0.75rem;" onclick="deleteTask('${task._id}')">Delete</button>
          `;
          taskList.appendChild(item);
        });
      } else {
        taskList.innerHTML = "<div style='color:var(--text-muted);font-size:0.85rem;padding:8px;'>No tasks found in volume.</div>";
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  window.deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const priority = document.getElementById("taskPriority").value;

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority })
      });
      document.getElementById("taskTitle").value = "";
      fetchTasks();
    } catch (err) {
      console.error("Task creation failed:", err);
    }
  });

  btnRefresh.addEventListener("click", () => {
    fetchTelemetry();
    fetchTasks();
  });

  fetchTelemetry();
  fetchTasks();
  setInterval(fetchTelemetry, 5000);
});
