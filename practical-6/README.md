# Practical 6: Full Stack Integration (React + Node + MongoDB)

**Subject**: ITUE301 - Advanced Web Development Frameworks  
**Student**: Tirth Patel (24DCS089)  
**Branch**: CSE, DEPSTAR  

---

## 🎯 Objective
To wire the React frontend to the Node/Express/MongoDB backend into a fully functional full-stack application with real-time state synchronization, optimistic UI updates, delete confirmations, and feedback notifications.

---

## 🏗️ Architecture & Full-Stack Data Flow

```
React Frontend (localhost:5173)
       │
       │ Axios HTTP Requests
       │ (GET, POST, PUT, DELETE)
       ▼
Express API Server (localhost:5000)
       │
       ├── CORS Middleware (permits requests from frontend)
       ├── Express JSON parser
       ├── Request Logger
       ├── Task Router (/api/tasks)
       │        │
       │        ▼
       │   Task Controller
       │        │
       │        ▼
       │   Mongoose ODM (models/Task.js)
       │        │
       │        ▼
       └── MongoDB Database (`awdf_practical6`)
                └── tasks collection
```

---

## 🚀 Setup & Execution

Two terminals are required to run both services concurrently:

### Terminal 1 — Backend (API on Port 5000)
```bash
cd backend
npm install
npm run dev     # Starts nodemon on http://localhost:5000
```

### Terminal 2 — Frontend (React on Port 5173)
```bash
cd frontend
npm install
npm run dev     # Launches Vite dev server on http://localhost:5173
```

---

## ✨ Full-Stack Features Implemented

1. **Live State Synchronization**:
   - Creating, updating, or deleting tasks directly modifies MongoDB documents and immediately synchronizes React UI state without manual page refresh.
2. **Optimistic UI Updates**:
   - Status toggling (pending ↔ completed) immediately updates the card visuals while dispatching the background PUT request.
3. **Delete Confirmation Dialog**:
   - Prevents accidental data deletion with a dedicated modal warning prompt before executing the `DELETE` API call.
4. **Toast Notification System**:
   - Non-intrusive floating toasts notify user upon successful creation, update, deletion, or network errors.
5. **Dynamic Search & Filters**:
   - Filter by status (`All`, `Pending`, `Completed`), filter by priority (`All`, `High`, `Medium`, `Low`), and live keyword search.
6. **Live HTTP Activity Stream**:
   - Inspects outgoing HTTP traffic (`METHOD`, `URL`, `STATUS`, `LATENCY`) directly in the UI.

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch tasks list with optional status/priority/search query |
| `GET` | `/api/tasks/:id` | Fetch task by MongoDB ID |
| `POST` | `/api/tasks` | Create task in MongoDB |
| `PUT` | `/api/tasks/:id` | Update task details or toggle completion |
| `DELETE` | `/api/tasks/:id` | Delete task from database |
