# Practical 4: Building a RESTful API with Node.js and Express

## Objective
To design and implement a RESTful backend server with complete CRUD endpoints using an Express middleware pipeline.

## API Architecture
- `Client` (e.g. Postman, cURL)
  - `Logging Middleware` (applied globally)
  - `Content-Type Enforcer` (verifies header for write operations)
  - `Express Router`:
    - `GET /tasks` -> Retrieve all tasks
    - `GET /tasks/:id` -> Retrieve task by ID
    - `POST /tasks` -> Create a new task (validates input, returns 201)
    - `PUT /tasks/:id` -> Update specific task values by ID
    - `DELETE /tasks/:id` -> Delete task by ID
  - `404 Undefined Router Handler` (fallback for invalid routes)
  - `Global Error Handling Middleware` (last in pipeline, catches exceptions)

## How to Run

1. Navigate to this directory:
   ```bash
   cd practical-4
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (runs with nodemon):
   ```bash
   npm run dev
   ```
   Or start normally:
   ```bash
   npm start
   ```
