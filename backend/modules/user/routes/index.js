const express = require("express");
const { rateLimit } = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfileDetails,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getCustomUserDetails,
  deleteUser,
  updateUserDetails,
} = require("../controllers");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

const router = express.Router();

// Each instance keeps its own counters, so these routes share one budget per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later." },
});

// Routes
router.route("/register").post(authLimiter, registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/password/forgot").post(authLimiter, forgotPassword);
router.route("/password/reset/:token").put(authLimiter, resetPassword);
router
  .route("/password/update")
  .put(authLimiter, isAuthenticatedUser, updatePassword);
router.route("/logout").get(logoutUser);
router.route("/user/me").get(isAuthenticatedUser, getProfileDetails);
router.route("/user/me/update").put(isAuthenticatedUser, updateUserProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getCustomUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserDetails)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
