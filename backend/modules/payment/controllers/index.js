const catchAsyncError = require("../../../middlewares/catchAsyncError");
const getStripe = require("../../../utils/stripe");
const { priceCart } = require("../../order/controllers");

// Process Payment
exports.createPayment = catchAsyncError(async (req, res, next) => {
  // The amount comes from database prices, never from the request.
  const { totals, error } = await priceCart(req.body.orderItems);

  if (error) {
    return next(error);
  }

  const myPayment = await getStripe().paymentIntents.create({
    amount: Math.round(totals.totalPrice * 100),
    currency: "inr",
    receipt_email: req.user.email,
    metadata: {
      company: "NixLab Shop",
      user: req.user._id.toString(),
    },
  });

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

// Get Stripe API Key
exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    key: process.env.STRIPE_API_KEY,
  });
});
