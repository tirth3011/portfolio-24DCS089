// Global Error Handler Middleware
// Transforms Mongoose ValidationErrors and CastErrors into structured JSON responses
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // Handle Mongoose CastError (e.g. invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with id of '${err.value}'`;
  }

  // Handle Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(errors && { errors })
  });
};

module.exports = errorHandler;
