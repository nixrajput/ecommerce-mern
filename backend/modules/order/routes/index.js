const express = require("express");
const {
  createNewOrder,
  getCustomOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

const router = express.Router();

// Routes
router.route("/order/new").post(isAuthenticatedUser, createNewOrder);
router.route("/order/:id").get(isAuthenticatedUser, getCustomOrder);
router.route("/orders/me").get(isAuthenticatedUser, getMyOrders);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
