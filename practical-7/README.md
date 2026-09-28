# Practical 7: Authentication and Middleware Pipeline

**Subject**: ITUE301 - Advanced Web Development Frameworks  
**Student**: Tirth Patel (24DCS089)  
**Branch**: CSE, DEPSTAR  

---

## 🎯 Objective
To implement JWT-based user authentication, password hashing using bcrypt, server-side input validation, and user-scoped data access within an Express middleware pipeline.

---

## 🏗️ Architecture & Authentication Pipeline

```
[Unauthenticated Request]
POST /api/auth/register ──► [validateRegister] ──► [Bcrypt Hash] ──► Save User ──► Issue JWT
POST /api/auth/login    ──► [validateLogin]    ──► [Bcrypt Compare] ──► Issue JWT

[Protected Request: GET/POST/PUT/DELETE /api/tasks or GET /api/auth/me]
Client Request (Headers: { Authorization: "Bearer <token>" })
       │
       ▼
 [Request Logger Middleware]
       │
       ▼
 [CORS & Body Parser]
       │
       ▼
 [Auth Middleware (protect)] ──► Checks Authorization header
       │                     ──► Verifies JWT via jwt.verify()
       │                     ──► Rejects 401 if missing/invalid/expired
       │                     ──► Sets req.user = decoded
       ▼
 [Input Validation Middleware (validateTask)]
       │
       ▼
 [Task Controller] ──► Queries/Modifies Tasks scoped to req.user.id
       │
       ▼
 [MongoDB Database (`awdf_practical7`)]
```

---

## 🔐 Security Features

1. **Bcrypt Password Hashing**: Passwords are salted (10 rounds) and hashed prior to persistence; never stored as plain text.
2. **JWT Token Signing**: Authenticated users receive a signed token embedding their user identity and an expiration period (24 hours).
3. **Route Guard Middleware**: All task endpoints and `/api/auth/me` are guarded, rejecting unauthenticated or expired requests with `401 Unauthorized`.
4. **Data Isolation**: Tasks are associated with `user: ObjectId`, ensuring users only ever query, update, or delete their own data.
5. **Input Validation**: Rejects invalid emails, short passwords (<6 chars), and malformed payloads before database interaction.

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Automated Test Suite
```bash
npm test
# or: node test_auth.js
```

### 3. Start Backend Server
```bash
npm run dev     # Starts on http://localhost:5000
```

### 4. Start Frontend Client
```bash
cd ../frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

---

## 📡 REST API Specifications

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new user account |
| `POST` | `/api/auth/login` | No | Login and obtain JWT token |
| `GET` | `/api/auth/me` | **Yes (Bearer)** | Get current authenticated user profile |
| `GET` | `/api/tasks` | **Yes (Bearer)** | Retrieve tasks belonging to authenticated user |
| `POST` | `/api/tasks` | **Yes (Bearer)** | Create task scoped to user |
| `PUT` | `/api/tasks/:id` | **Yes (Bearer)** | Update task owned by user |
| `DELETE` | `/api/tasks/:id` | **Yes (Bearer)** | Delete task owned by user |
