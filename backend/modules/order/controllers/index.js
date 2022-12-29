const Order = require("../models/orderModel");
const Product = require("../../product/models/productModel");
const ErrorHandler = require("../../../utils/errorHandler");
const catchAsyncError = require("../../../middlewares/catchAsyncError");

// Create New Order
exports.createNewOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Order created successfully.",
    result: order,
  });
});

// Get Custom Order
exports.getCustomOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  res.status(200).json({
    success: true,
    result: order,
  });
});

// Get Logged In User Order
exports.getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    results: orders,
  });
});

// Get All Orders -- Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  const orderCount = await Order.countDocuments();

  let totalAmount = 0.0;

  orders.forEach((doc) => {
    totalAmount += doc.totalPrice;
  });

  res.status(200).json({
    success: true,
    count: orderCount,
    totalAmount,
    results: orders,
  });
});

// Update Order -- Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order already delivered.", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (doc) => {
      await updateStock(doc.product, doc.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated.",
  });
});

async function updateStock(id, qty) {
  const product = await Product.findById(id);

  product.stock -= qty;

  await product.save();
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully.",
  });
});
