const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((val) => val.message);
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "An account with this email address already exists.";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token authorization.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired. Please login again.";
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(errors && { errors })
  });
};

module.exports = errorHandler;
