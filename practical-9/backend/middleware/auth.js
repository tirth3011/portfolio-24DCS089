const jwt = require("jsonwebtoken");

// Authentication Middleware
// Verifies JWT token supplied in Authorization header as Bearer <token>
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route (token missing)"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id and email
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Not authorized (token is invalid or expired)"
    });
  }
};

module.exports = { protect };
