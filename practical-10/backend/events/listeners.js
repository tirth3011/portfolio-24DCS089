const taskEvents = require("./events");

const DEFAULT_DELAY_MS = parseInt(process.env.ASYNC_DELAY_MS, 10) || 1000;

/**
 * Register all event listeners for the Task Management background processing system
 */
const registerTaskListeners = () => {
  // 1. Primary Event: 'task-created'
  // When a task is created, dispatch an asynchronous notification to simulated third-party services
  taskEvents.on("task-created", (payload) => {
    const receivedAt = new Date().toISOString();
    const { task, apiResponseTimestamp, user = "System / Tirth Patel (24DCS089)", delayMs = DEFAULT_DELAY_MS } = payload;

    console.log(`------------------------------------------------------------------------`);
    console.log(`[Event: task-created] Event received by listener at : ${receivedAt}`);
    console.log(`[Event: task-created] API Response already returned at: ${apiResponseTimestamp}`);
    console.log(`[Event: task-created] Processing Task: "${task.title}" (Priority: ${task.priority})`);
    console.log(`[Event: task-created] Assigned User: ${user}`);
    console.log(`[Event: task-created] Starting async background notification (${delayMs}ms delay)...`);

    taskEvents.recordLog({
      eventType: "task-created",
      status: "processing",
      taskTitle: task.title,
      taskId: task._id ? task._id.toString() : null,
      apiTimestamp: apiResponseTimestamp,
      listenerReceivedAt: receivedAt,
      user
    });

    // Simulate non-blocking asynchronous work (e.g. Email dispatch, Push notification, Webhook)
    setTimeout(() => {
      const completedAt = new Date().toISOString();
      console.log(`[Notification Worker] ✔ Notification email sent for "${task.title}" at ${completedAt}`);
      console.log(`[Proof of Async] API responded BEFORE worker finished!`);
      console.log(`------------------------------------------------------------------------`);

      taskEvents.recordLog({
        eventType: "task-created",
        status: "completed",
        taskTitle: task.title,
        taskId: task._id ? task._id.toString() : null,
        apiTimestamp: apiResponseTimestamp,
        completedAt,
        durationMs: delayMs,
        message: `Notification email dispatched to ${user}`
      });
    }, delayMs);
  });

  // 2. Supplementary Problem 1: 'task-deleted'
  taskEvents.on("task-deleted", (payload) => {
    const deletedAt = new Date().toISOString();
    const { taskTitle, taskId, apiResponseTimestamp } = payload;

    console.log(`------------------------------------------------------------------------`);
    console.log(`[Notification: task-deleted] Task "${taskTitle}" (ID: ${taskId}) deleted at ${deletedAt}`);
    console.log(`[Notification: task-deleted] API Response was dispatched at ${apiResponseTimestamp}`);
    console.log(`------------------------------------------------------------------------`);

    taskEvents.recordLog({
      eventType: "task-deleted",
      status: "completed",
      taskTitle,
      taskId,
      apiTimestamp: apiResponseTimestamp,
      completedAt: deletedAt,
      message: `Audit log: Task "${taskTitle}" purged from database.`
    });
  });

  // 3. Supplementary Problem: 'task-updated'
  taskEvents.on("task-updated", (payload) => {
    const updatedAt = new Date().toISOString();
    const { task, apiResponseTimestamp } = payload;

    console.log(`[Notification: task-updated] Task "${task.title}" status updated at ${updatedAt}`);

    taskEvents.recordLog({
      eventType: "task-updated",
      status: "completed",
      taskTitle: task.title,
      taskId: task._id ? task._id.toString() : null,
      apiTimestamp: apiResponseTimestamp,
      completedAt: updatedAt,
      message: `Task updated (Completed: ${task.completed}, Priority: ${task.priority})`
    });
  });

  // 4. Supplementary Problem 2: Dedicated 'error' event listener
  // Prevents Node.js process crashes when custom error events are dispatched
  taskEvents.on("error", (err) => {
    const errorTimestamp = new Date().toISOString();
    console.error(`✖ [TaskEvents Error Caught] Handled gracefully at ${errorTimestamp}: ${err.message}`);

    taskEvents.recordLog({
      eventType: "error",
      status: "handled_error",
      error: err.message,
      timestamp: errorTimestamp
    });
  });

  console.log("✔ [EventEmitter] All background listeners registered successfully.");
};

module.exports = registerTaskListeners;
