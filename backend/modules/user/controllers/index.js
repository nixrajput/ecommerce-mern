const ErrorHandler = require("../../../utils/errorHandler");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../../../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    return next(new ErrorHandler("Please enter a name.", 400));
  }

  if (!email) {
    return next(new ErrorHandler("Please enter an email address.", 400));
  }

  if (!password) {
    return next(new ErrorHandler("Please enter a password.", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.generateToken();
  await user.save();
  const decodedData = jwt.decode(token);
  const expiresAt = decodedData.exp;

  const message = `Hello ${user.name},
    \nWe're glad you're here! Check out our product collection and enjoy shopping.
    \n\nThank you for joining with us.
    \n\nThank You,\nNixLab Technologies Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Welcome to NixLab Shop`,
      message: message,
    });
  } catch (err) {
    console.log(err.message);
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    token: token,
    expiresAt: expiresAt,
    result: user,
  });
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Email and Password validation
  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter email and password to login.", 401)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  let token = user.token;
  let expiresAt = user.expiresAt;

  if (token) {
    if (expiresAt < new Date().getTime() / 1000) {
      token = user.generateToken();
      await user.save();
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      expiresAt = decodedData.exp;
    }
  } else {
    token = user.generateToken();
    await user.save();
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    expiresAt = decodedData.exp;
  }

  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    token: token,
    expiresAt: expiresAt,
    result: user,
  });
});

// Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User logged out sucessfully.",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(
      new ErrorHandler(
        "Please enter your email associated with the account.",
        400
      )
    );
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Get ResetPasswordToken
  const resetToken = user.generatePasswordResetToken();

  await user.save();

  let resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/password/reset/${resetToken}`;

  if (process.env.NODE_ENV !== "PRODUCTION") {
    resetPasswordUrl = `http://localhost:3000/auth/password/reset/${resetToken}`;
  }

  const message = `Hello ${user.name},
    \nYour password reset link is :- \n\n ${resetPasswordUrl}.
    \nIf you have not requested this email then, please ignore it.
    \n\nThank You,\nNixLab Technologies Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: `NixLab Shop Password Recovery`,
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new ErrorHandler(err.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword) {
    return next(new ErrorHandler("Please enter new password.", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("Please enter new password again.", 400));
  }

  // Creating Token Hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or expired.", 400));
  }

  if (newP4 !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not matched.", 400));
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});

// Get User Details
exports.getProfileDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    result: user,
  });
});

// Update Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword) {
    return next(new ErrorHandler("Please enter old password.", 400));
  }

  if (!newPassword) {
    return next(new ErrorHandler("Please enter new password.", 400));
  }

  if (!confirmPassword) {
    return next(new ErrorHandler("Please enter new password again.", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Both passwords do not matched.", 400));
  }

  user.password = newPassword;

  user.generateToken();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});

// Update User Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const { name, avatar, dob, gender } = req.body;

  const user = await User.findById(req.user.id);

  if (name) {
    user.name = name;
  }

  if (dob) {
    user.dob = dob;
  }

  if (gender) {
    user.gender = gender;
  }

  if (avatar) {
    if (user.avatar && user.avatar.public_id) {
      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);
    }

    const cloudUpload = await cloudinary.v2.uploader.upload(avatar, {
      folder: "ecommerce/avatars",
    });

    user.avatar = {
      public_id: cloudUpload.public_id,
      url: cloudUpload.secure_url,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User profile updated.",
  });
});

// Get All Users -- Admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  const usersCount = await User.countDocuments();

  res.status(200).json({
    success: true,
    count: usersCount,
    results: users,
  });
});

// Get Custom User Details -- Admin
exports.getCustomUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    result: user,
  });
});

// Update User Role -- Admin
exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const { name, email, dob, gender, role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  if (dob) {
    user.dob = dob;
  }

  if (gender) {
    user.gender = gender;
  }

  if (role) {
    user.role = String(role).toLowerCase();
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User details updated.",
  });
});

// Delete User -- Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  if (user.avatar && user.avatar.public_id) {
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});
