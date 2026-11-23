const catchAsyncError = require("../../../middlewares/catchAsyncError");
const ErrorHandler = require("../../../utils/errorHandler");
const getStripe = require("../../../utils/stripe");

// Process Payment
exports.createPayment = catchAsyncError(async (req, res, next) => {
  const amount = Number(req.body.amount);

  if (!Number.isInteger(amount) || amount <= 0) {
    return next(new ErrorHandler("Invalid payment amount.", 400));
  }

  const myPayment = await getStripe().paymentIntents.create({
    amount,
    currency: "inr",
    receipt_email: req.user.email,
    metadata: {
      company: "NixLab Shop",
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
