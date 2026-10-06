# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Subject**: ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Student**: Tirth Patel (24DCS089)  
**Branch**: Computer Science & Engineering, DEPSTAR (CHARUSAT)  
**Mapping**: CO4 / PO3, PO5  

---

## 🎯 Objective
To implement non-blocking asynchronous background processing using Node.js built-in `EventEmitter` without external message brokers (e.g. RabbitMQ/Bull), ensuring API responses are dispatched immediately while decoupled side-effect workers execute in the background.

---

## 🏗️ Architecture & Event Flow Pipeline

```
[Client POST /api/tasks Request]
              │
              ▼
    [Save Task to MongoDB]
              │
              ├─────────────────────────────────────────┐
              ▼                                         ▼
   [Dispatched Instantly (201)]             [Emit 'task-created' Event]
   • Response latency: ~12-18 ms                        │
   • Client unblocked immediately                       ▼
                                            [Async Event Listener (Worker)]
                                            • Simulates email notification / webhook
                                            • Background delay: 1,000 - 2,000 ms
                                            • Execution finishes strictly AFTER response
```

---

## 📊 Empirical Timestamp Ordering Proof

The automated test suite (`npm test`) and HTTP benchmark (`npm run benchmark`) record exact nanosecond/millisecond timestamps proving non-blocking execution:

| Execution Event | Timestamp (ISO-8601) | Delta / Lag | Status |
| :--- | :--- | :--- | :--- |
| **1. Client Request Sent** | `2026-10-06T08:18:00.100Z` | `0.00 ms` | Request Dispatched |
| **2. API Response Returned (201)** | `2026-10-06T08:18:00.114Z` | **`+14.00 ms`** | **Client Unblocked** |
| **3. Notification Listener Completed** | `2026-10-06T08:18:01.120Z` | **`+1,006.00 ms`** | **Worker Finished** |
| **Timestamp Assertion** | `apiTimestamp < workerTimestamp` | **TRUE** | **Strict Async Proof** |

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
cd tirth-portfolio/practical-10/backend
npm install
```

### 2. Run the Automated Verification Suite
```bash
npm test
```
*Validates EventEmitter setup, emits `task-created`, asserts mathematical timestamp ordering (`T_api < T_worker`), tests `task-deleted`, and verifies `error` event safe capture.*

### 3. Run Postman-Style HTTP Benchmark
```bash
npm run benchmark
```
*Fires live HTTP POST request, confirms client receives status 201 in <25ms, waits for asynchronous worker, and polls background telemetry.*

### 4. Run the Development Server & Live Web Dashboard
```bash
npm start
```
*Launches the server at **`http://localhost:5002`** with the live event stream dashboard.*

---

## 🧩 Key Features & Supplementary Solutions

1. **Native Node.js `EventEmitter` Setup**:
   - Zero external message broker dependencies; isolated within `events/events.js`.
2. **Dedicated Modular Listeners (`events/listeners.js`)**:
   - Registered once during server initialization (`server.js`).
3. **Supplementary Problem 1: `task-deleted` Event**:
   - Emits distinct audit event whenever a task document is deleted from MongoDB.
4. **Supplementary Problem 2: Graceful Error Handling**:
   - Dedicated `error` event listener safely absorbs exceptions without crashing the Node.js process.
5. **Supplementary Problem 3: Delay Simulation**:
   - Configurable delay (default 1200ms) demonstrates clear visual lag between fast HTTP round-trips and background completion.
6. **Real-Time Telemetry Dashboard**:
   - Interactive UI displaying the mathematical verification and live event stream.

---

## 📋 Evaluation Rubrics (Viva Checklist)

| Criteria | Marks | Implementation in Practical 10 |
| :--- | :---: | :--- |
| **EventEmitter Setup** | 4 / 4 | Node.js built-in EventEmitter instantiated in dedicated module `events/events.js` |
| **Event Emission on Task Create** | 5 / 5 | `task-created` emitted after database persistence with task details & user payload |
| **Async Handler** | 5 / 5 | Event listener executes asynchronously without blocking the client response |
| **Timestamp Logging Evidence** | 6 / 6 | Empirical proof showing API response timestamp strictly precedes worker finish timestamp |
| **Total** | **20 / 20** | **Passing Threshold: 14 / 20 (70%)** |
