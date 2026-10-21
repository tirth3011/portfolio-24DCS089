document.addEventListener("DOMContentLoaded", () => {
  const taskTitle = document.getElementById("taskTitle");
  const btnGenerateAi = document.getElementById("btnGenerateAi");
  const aiBtnSpinner = document.getElementById("aiBtnSpinner");
  const suggestionBox = document.getElementById("suggestionBox");
  const aiDescOutput = document.getElementById("aiDescOutput");
  const aiPriorityOutput = document.getElementById("aiPriorityOutput");
  const aiHoursOutput = document.getElementById("aiHoursOutput");
  const aiTagsOutput = document.getElementById("aiTagsOutput");
  const suggestionProvider = document.getElementById("suggestionProvider");
  const aiDisclaimerText = document.getElementById("aiDisclaimerText");
  const btnAcceptSuggestion = document.getElementById("btnAcceptSuggestion");
  const taskList = document.getElementById("taskList");

  let currentTags = [];
  let currentProvider = "AI Assistant";

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
            <div class="task-item-title">
              <span>${task.title}</span>
              ${task.isAiGenerated ? '<span class="badge" style="background:rgba(157,78,221,0.2);color:#c77dff;font-size:0.65rem;">✨ AI ASSISTED</span>' : ''}
              <span class="badge" style="background:rgba(0,210,255,0.15);color:#00d2ff;font-size:0.65rem;margin-left:auto;">${task.priority.toUpperCase()}</span>
            </div>
            <div class="task-item-desc">${task.description}</div>
            <div style="display:flex;gap:12px;margin-top:8px;font-size:0.75rem;color:#8b9bb4;">
              <span>⏱ ${task.estimatedHours || 2}h est.</span>
              <span>🏷 ${(task.tags || []).join(', ')}</span>
              <span>👤 ${task.assignedUser}</span>
            </div>
          `;
          taskList.appendChild(item);
        });
      } else {
        taskList.innerHTML = "<div style='color:#8b9bb4;font-size:0.85rem;'>No tasks created yet.</div>";
      }
    } catch (err) {
      console.warn("Fetch tasks failed:", err);
    }
  }

  btnGenerateAi.addEventListener("click", async () => {
    const title = taskTitle.value.trim();
    if (!title) {
      alert("Please enter a task title first!");
      return;
    }

    btnGenerateAi.disabled = true;
    aiBtnSpinner.style.display = "inline";

    try {
      const res = await fetch("/api/ai/suggest-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      const data = await res.json();

      if (data.success && data.suggestion) {
        aiDescOutput.value = data.suggestion.description;
        aiPriorityOutput.value = data.suggestion.priority;
        aiHoursOutput.value = data.suggestion.estimatedHours;
        currentTags = data.suggestion.tags || ["feature"];
        currentProvider = data.provider;

        suggestionProvider.textContent = `🤖 Provider: ${data.provider} ${data.fallback ? '(Graceful Fallback)' : '(Live)'}`;
        aiDisclaimerText.textContent = data.disclaimer || "⚠️ AI-generated suggestion. Please review before saving.";

        aiTagsOutput.innerHTML = "";
        currentTags.forEach(tag => {
          const pill = document.createElement("span");
          pill.className = "tag-pill";
          pill.textContent = `#${tag}`;
          aiTagsOutput.appendChild(pill);
        });

        suggestionBox.style.display = "block";
      } else if (res.status === 429) {
        alert(data.message || "Rate limit reached. Please wait a moment.");
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      alert("Error generating suggestion. Check server logs.");
    } finally {
      btnGenerateAi.disabled = false;
      aiBtnSpinner.style.display = "none";
    }
  });

  btnAcceptSuggestion.addEventListener("click", async () => {
    const title = taskTitle.value.trim();
    const description = aiDescOutput.value.trim();
    const priority = aiPriorityOutput.value;
    const estimatedHours = parseInt(aiHoursOutput.value, 10) || 2;

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          estimatedHours,
          tags: currentTags,
          isAiGenerated: true,
          aiProvider: currentProvider
        })
      });

      suggestionBox.style.display = "none";
      fetchTasks();
    } catch (err) {
      console.error("Save task failed:", err);
    }
  });

  fetchTasks();
});
