const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../modules/user/models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    if (!token) {
      return next(new ErrorHandler("Please login to account.", 400));
    }

    const userData = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = await User.findById(userData.id);

    if (!req.user) {
      return next(new ErrorHandler("Please login to account.", 401));
    }

    const changedAt = req.user.passwordChangedAt?.getTime();

    if (changedAt && userData.iat < Math.floor(changedAt / 1000)) {
      return next(
        new ErrorHandler("Password changed, please login again.", 401)
      );
    }

    next();
  } else {
    return next(new ErrorHandler("Token not found in header.", 400));
  }
});

// AUthorize Roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Access denied to admin area.`, 403));
    }

    next();
  };
};
