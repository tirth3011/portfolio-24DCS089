// Server-side Input Validation Pipeline Middleware

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

exports.validateRegister = (req, res, next) => {
  const { name, email, password } = req.body || {};
  const errors = [];

  // Rule 1: Name validation
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name is required and must be at least 2 characters long");
  }

  // Rule 2: Email format validation
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  // Rule 3: Password length constraint
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password is required and must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Registration Validation Failed",
      errors
    });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("Valid email address is required for login");
  }

  if (!password || typeof password !== "string") {
    errors.push("Password is required for login");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Login Validation Failed",
      errors
    });
  }

  next();
};

exports.validateTask = (req, res, next) => {
  const { title, priority } = req.body || {};
  const errors = [];

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    errors.push("Task title is required and must have at least 2 characters");
  }

  if (priority && !["low", "medium", "high"].includes(priority.toLowerCase())) {
    errors.push("Priority must be one of: low, medium, high");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Task Validation Failed",
      errors
    });
  }

  next();
};
