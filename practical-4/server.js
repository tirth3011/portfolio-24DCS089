const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Logging Middleware - applied globally before parsing JSON
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware to enforce JSON content headers for modification requests (POST/PUT)
app.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }
  }
  next();
});

// JSON Parser Middleware
app.use(express.json());

// In-Memory Database
let tasks = [
  { id: 1, title: 'Complete AWDF Practicals', description: 'Restructure the portfolio and build API endpoints', completed: false },
  { id: 2, title: 'Configure GitHub Actions', description: 'Set up automated CI pipeline', completed: true },
  { id: 3, title: 'Review Express Middleware', description: 'Deep dive into standard Express request pipelines', completed: false }
];
let nextId = 4;

// --- CRUD Routes ---

// A. Get All Tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// B. Get Single Task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }
  
  res.status(200).json(task);
});

// C. Create a Task (POST)
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    completed: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// D. Update a Task (PUT)
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }
  
  const { title, description, completed } = req.body;
  
  // Merge and update values
  if (title !== undefined) {
    if (title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    tasks[taskIndex].title = title.trim();
  }
  
  if (description !== undefined) {
    tasks[taskIndex].description = description.trim();
  }
  
  if (completed !== undefined) {
    tasks[taskIndex].completed = !!completed;
  }
  
  res.status(200).json(tasks[taskIndex]);
});

// E. Delete a Task (DELETE)
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
});

// 404 Route Handler - matches anything that was not caught by defined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint route not found' });
});

// 2. Global Error Handling Middleware - defined last
app.use((err, req, res, next) => {
  console.error('SERVER EXCEPTION CAUGHT:', err.stack);
  res.status(500).json({ error: 'An unexpected internal server error occurred' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Task Manager API Server running on port ${PORT}`);
});
