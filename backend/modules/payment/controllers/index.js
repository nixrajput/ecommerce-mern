const catchAsyncError = require("../../../middlewares/catchAsyncError");
const stripe = require("stripe")(
  "sk_test_51JCiUfSDU2GWp7bizlzSkQUVwQItdQGSBP5zg1kbdnZBB8VS5XDZ5kCVgXcW4lbbWjGvLK99vi3kmjR9AZLC7nBF00YaiymMQH"
);

// Process Payment
exports.createPayment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    receipt_email: req.body.email,
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
