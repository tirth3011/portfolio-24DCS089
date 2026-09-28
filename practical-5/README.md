# Practical 5: MongoDB Integration and Schema Design with Mongoose

**Subject**: ITUE301 - Advanced Web Development Frameworks  
**Student**: Tirth Patel (24DCS089)  
**Branch**: CSE, DEPSTAR  

---

## 🎯 Objective
To connect a MongoDB database to an Express server and enforce data validation through Mongoose schemas and middleware.

---

## 🏗️ Architecture & Pipeline

```
Client (Postman / Browser)
         │
         ▼
[Express Server (Port 5000)]
         │
  ├── [CORS & JSON Body Parser]
  ├── [Request Logger Middleware]
  ├── [Routes: /api/tasks]
  │         │
  │         ▼
  │   [Task Controller]
  │         │
  │         ▼
  │   [Mongoose Schema & Validation Layer]
  │   (Pre-save trim hook, required constraints, enum check)
  │         │
  │         ▼
  │   [MongoDB Database (`awdf_practical5`)]
  │         └── tasks collection
  │
  └── [Global Error Handler Middleware]
      (Converts ValidationErrors & CastErrors into structured JSON)
```

---

## 📋 Task Schema Definition

| Field | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | `String` | Required, minlength: 3, trimmed | - | Task title |
| `description` | `String` | Optional, trimmed | `""` | Additional notes |
| `completed` | `Boolean` | Optional | `false` | Completion status |
| `priority` | `String` | Enum: `['low', 'medium', 'high']` | `'medium'` | Urgency level |
| `createdAt` | `Date` | Date | `Date.now` | Creation timestamp |

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` file from `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/awdf_practical5
NODE_ENV=development
```

### 3. Run Automated Validation Test Suite
```bash
npm test
# or: node test_db.js
```

### 4. Run the Express Server
```bash
# Production mode:
npm start

# Development mode (live reload):
npm run dev
```

---

## 📡 REST API Specifications (`/api/tasks`)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Retrieve all tasks (supports `?completed=true&priority=high`) | `200 OK` |
| `GET` | `/api/tasks/:id` | Retrieve a single task by MongoDB ObjectId | `200 OK` / `404 Not Found` |
| `POST` | `/api/tasks` | Create a new task with schema validation | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/tasks/:id` | Update task details by ID | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/tasks/:id` | Delete a task document by ID | `200 OK` / `404 Not Found` |

---

## 🧪 Verification via cURL / Postman

```bash
# 1. Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Implement MongoDB validation","priority":"high"}'

# 2. Get all tasks
curl http://localhost:5000/api/tasks

# 3. Test Validation Failure (missing required title)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"Missing title"}'
```
