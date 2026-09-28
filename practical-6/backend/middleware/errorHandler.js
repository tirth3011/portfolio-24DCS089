const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((val) => val.message);
  }

  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with id of '${err.value}'`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(errors && { errors })
  });
};

module.exports = errorHandler;
