const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Intenal Server Error";

  // Wrong MongoDB Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    err = new ErrorHandler(err.message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Email is already in use, please try again with another email.`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Token is invalid, please login again.`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expire error
  if (err.name === "TokenExpiredError") {
    const message = `Token is expired, please login again.`;
    err = new ErrorHandler(message, 400);
  }

  const isProduction =
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";

  if (err.statusCode >= 500) {
    console.error(err);
  }

  res.status(err.statusCode).json({
    success: false,
    message:
      isProduction && err.statusCode >= 500
        ? "Internal Server Error"
        : err.message,
  });
};
