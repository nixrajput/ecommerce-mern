const express = require("express");
const { isAuthenticatedUser } = require("../../../middlewares/auth");
const {
  sendStripeApiKey,
  createPayment,
} = require("../controllers");

const router = express.Router();

// Routes
router.route("/payment/create").post(isAuthenticatedUser, createPayment);
router.route("/stripe/key").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
