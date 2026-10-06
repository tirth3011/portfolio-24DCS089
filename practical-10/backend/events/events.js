const EventEmitter = require("events");

/**
 * TaskEvents Custom Event Emitter Class
 * Built-in Node.js EventEmitter without external dependencies
 */
class TaskEvents extends EventEmitter {
  constructor() {
    super();
    this.eventLogs = [];
    this.maxStoredLogs = 100;
  }

  /**
   * Helper to append telemetry log for verification and dashboard inspection
   */
  recordLog(entry) {
    const formatted = {
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.eventLogs.unshift(formatted);
    if (this.eventLogs.length > this.maxStoredLogs) {
      this.eventLogs.pop();
    }
    return formatted;
  }

  getLogs() {
    return [...this.eventLogs];
  }

  clearLogs() {
    this.eventLogs = [];
  }
}

const taskEvents = new TaskEvents();

// Increase listener limit for high concurrency
taskEvents.setMaxListeners(25);

module.exports = taskEvents;
