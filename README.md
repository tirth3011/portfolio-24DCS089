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

### 8. [Practical 8: Performance Optimization & Lazy Loading in React](./practical-8)
- **Goal**: Optimize frontend bundle size and initial load performance using route-based code splitting and dynamic imports.
- **Concepts**: `React.lazy()` asynchronous component loading, `<Suspense>` boundary fallbacks, anti-flicker delay timers, component-level heavy chart lazy loading, Vite Rollup manualChunks configuration, empirical bundle size reduction (49.5% smaller initial download).
- **Run**:
  - Dev Server: `cd practical-8 && npm install && npm run dev` (Port 5175)
  - Benchmark: `cd practical-8 && npm run benchmark`

### 9. [Practical 9: In-Memory Caching and Query Optimization](./practical-9)
- **Goal**: Implement server-side in-memory caching to eliminate redundant database reads, measure empirical latency reduction, and maintain deterministic cache invalidation on write mutations.
- **Concepts**: `node-cache` process-local memory caching, `all_tasks` collection caching with 60s TTL, single-task item caching (`task_<id>`), deterministic invalidation hooks on `POST`, `PUT`, `DELETE`, real-time cache statistics telemetry (`hits`, `misses`, hit ratio), automated latency comparison (206x speedup, 99.5% latency reduction), interactive browser dashboard.
- **Run**:
  - Test Suite: `cd practical-9/backend && npm install && npm test`
  - HTTP Benchmark: `cd practical-9/backend && npm run benchmark`
  - Server & Dashboard: `cd practical-9/backend && npm start` (Port 5001)

### 10. [Practical 10: Asynchronous Processing with Event-Driven Architecture](./practical-10)
- **Goal**: Implement non-blocking background processing using Node.js native `EventEmitter` without external dependencies to deliver instant API responses while decoupled side-effect workers execute in the background.
- **Concepts**: Node.js built-in `EventEmitter` singleton, decoupled `events.js` and `listeners.js` modules, `task-created` asynchronous dispatch, instant 201 Created response dispatch prior to background execution, `task-deleted` and `task-updated` auxiliary events, dedicated `error` event listener preventing server crashes, empirical timestamp verification proof (`T_api < T_worker`), interactive event telemetry stream.
- **Run**:
  - Test Suite: `cd practical-10/backend && npm install && npm test`
  - HTTP Benchmark: `cd practical-10/backend && npm run benchmark`
  - Server & Dashboard: `cd practical-10/backend && npm start` (Port 5002)

### 11. [Practical 11: Containerization with Docker & Docker Compose](./practical-11)
- **Goal**: Package and orchestrate a multi-tier full-stack web application (React frontend, Node.js/Express backend, MongoDB database) into isolated, portable Docker containers using Docker Compose.
- **Concepts**: Multi-stage Dockerfile build for React Vite frontend (`node:18-alpine` build + preview server), Node.js Alpine runtime backend container, official MongoDB 6.0 image, isolated user-defined bridge network (`app-network`), persistent named volume (`mongo-data`), `.dockerignore` context pruning, single-command orchestration (`docker-compose up --build`).
- **Run**:
  - Full Compose Stack: `cd practical-11 && docker-compose up --build`
  - Verification & Self-Test: `cd practical-11 && node test_docker.js`
  - Backend Telemetry: `http://localhost:5011`
  - Frontend Application: `http://localhost:5178`

### 12. [Practical 12: CI/CD Pipeline with GitHub Actions](./practical-12)
- **Goal**: Automate code verification, automated testing, and build pipelines using GitHub Actions workflows with continuous status reporting and branch protection checks.
- **Concepts**: GitHub Actions workflow syntax (`.github/workflows/ci.yml`), matrix testing strategy, multi-stage pipeline execution (checkout, dependency caching, linting, test suite execution, build artifact generation), demonstration of deliberate pipeline failure (Red X on broken validation) vs fixed green pass (Green checkmark), README workflow status badges.
- **Run**:
  - Automated Unit Tests: `cd practical-12/backend && npm test`
  - Pipeline Simulation Runner: `cd practical-12/backend && npm run test:pipeline`
  - Live Dashboard & Failure Toggle: `cd practical-12/backend && npm start` (Port 5012)
  - Frontend Visual Pipeline: `cd practical-12/frontend && npm run dev` (Port 5179)

### 13. [Practical 13: AI API Integration into Web Application](./practical-13)
- **Goal**: Integrate external AI capabilities (Google Gemini / OpenAI REST APIs) into a full-stack web application via a secure, resilient backend proxy with intelligent fallback mechanisms.
- **Concepts**: Backend-only API proxy isolating secret keys via `.env`, multi-pattern PII and credential sanitization regex engine before prompt dispatch, sliding-window IP rate limiting, graceful degradation fallback heuristic engine ensuring 100% application uptime during upstream API outages, editable UI suggestion drawer, Responsible AI disclaimer.
- **Run**:
  - Resilience & Sanitizer Test Suite: `cd practical-13/backend && npm test`
  - Backend AI Studio & Proxy: `cd practical-13/backend && npm start` (Port 5013)
  - Frontend AI Task Synthesizer: `cd practical-13/frontend && npm run dev` (Port 5180)

---

## 🛠️ Global Requirements & Technologies
- **Node.js** v18+
- **npm** v9+
- **Vite** & **React 18+** (Frontend)
- **Express.js** (Backend)
- **MongoDB** & **Mongoose ODM** (Database)
- **JSON Web Token (JWT)** & **Bcrypt.js** (Authentication)
- **node-cache** (In-Memory RAM Caching)
- **Node.js native EventEmitter** (Event-Driven Background Processing)
- **Docker** & **Docker Compose** (Multi-Container Virtualization & Orchestration)
- **GitHub Actions** (Continuous Integration & Automated Testing Pipeline)
- **Google Gemini API / AI Services** (Generative AI Task Intelligence)

---

## 🧑‍💻 Student Information
- **Name**: Tirth Patel
- **ID**: 24DCS089
- **Subject**: ITUE301 - Advanced Web Development Framework (AWDF)
- **Branch**: Computer Science & Engineering (DEPSTAR)

