# Advanced Web Development Framework (AWDF) Practical Portfolio

This repository contains the practical lab submissions for the AWDF course, structured as independent, self-contained sub-projects.

---

## 📂 Practical Directory Index

### 1. [Practical 1: React Component Architecture](./practical-1)
- **Goal**: Set up a static student portfolio using Vite and modular, reusable React components (`Header`, `About`, `Skills`, `Footer`).
- **Concepts**: Props data transmission, JSX rendering, CSS design custom properties.
- **Run**: `cd practical-1 && npm install && npm run dev`

### 2. [Practical 2: Routing & State Management](./practical-2)
- **Goal**: Add multi-page navigation and dynamic state to the portfolio.
- **Concepts**: React Router integration (`BrowserRouter`, `Routes`, `Link`), theme configuration toggling (dark/light), character count monitoring on controlled form inputs.
- **Run**: `cd practical-2 && npm install && npm run dev`

### 3. [Practical 3: API Integration & Data Rendering](./practical-3)
- **Goal**: Fetch dynamic repository information from the GitHub REST API.
- **Concepts**: Hooks (`useEffect` for mounting requests, `useState` for async states), loading spinner, search query lists filter, failure/retry states handling.
- **Run**: `cd practical-3 && npm install && npm run dev`

### 4. [Practical 4: Express Task Manager Backend](./practical-4)
- **Goal**: Construct a RESTful Express server to support CRUD operations.
- **Concepts**: Pipeline middlewares (logging, content headers), global error catching exceptions handler, 404 response routing, mock database operations.
- **Run**: `cd practical-4/backend && npm install && npm run dev`

### 5. [Practical 5: MongoDB Integration & Schema Design with Mongoose](./practical-5)
- **Goal**: Connect MongoDB database to an Express server and enforce data validation through Mongoose schemas.
- **Concepts**: Mongoose connection pooling, schema types, required constraints, priority enums, pre-save hooks (automatic whitespace trim), structured JSON error handling, automated validation test suite.
- **Run**: `cd practical-5/backend && npm install && npm test`

### 6. [Practical 6: Full Stack Integration (React + Node + MongoDB)](./practical-6)
- **Goal**: Wire the React frontend to the Node/Express/MongoDB backend into a complete, working full-stack application with state synchronization.
- **Concepts**: CORS configuration, centralized API client, optimistic UI updates, delete confirmation dialogs, toast notification alerts, live HTTP activity logging.
- **Run**:
  - Backend: `cd practical-6/backend && npm install && npm run dev`
  - Frontend: `cd practical-6/frontend && npm install && npm run dev`

### 7. [Practical 7: Authentication & Middleware Pipeline](./practical-7)
- **Goal**: Implement JWT-based user authentication, bcrypt password hashing, and server-side input validation pipeline.
- **Concepts**: 10-round salted bcrypt hashes, JWT signing and verification, route guard middleware, request input validation, multi-tenant user data isolation, protected React routing.
- **Run**:
  - Backend: `cd practical-7/backend && npm install && npm test`
  - Frontend: `cd practical-7/frontend && npm install && npm run dev`

---

## 🛠️ Global Requirements & Technologies
- **Node.js** v18+
- **npm** v9+
- **Vite** & **React 18+** (Frontend)
- **Express.js** (Backend)
- **MongoDB** & **Mongoose ODM** (Database)
- **JSON Web Token (JWT)** & **Bcrypt.js** (Authentication)

---

## 🧑‍💻 Student Information
- **Name**: Tirth Patel
- **ID**: 24DCS089
- **Subject**: ITUE301 - Advanced Web Development Framework (AWDF)
- **Branch**: Computer Science & Engineering (DEPSTAR)
