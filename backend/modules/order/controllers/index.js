const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../../product/models/productModel");
const ErrorHandler = require("../../../utils/errorHandler");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const getStripe = require("../../../utils/stripe");

const MAX_ORDER_ITEMS = 50;

// Returns the cart items when each has a product id and a positive integer quantity, else null.
const readCartItems = (items) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ORDER_ITEMS) {
    return null;
  }

  const valid = items.every(
    (item) =>
      typeof item?.product === "string" &&
      mongoose.isValidObjectId(item.product) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
  );

  return valid ? items : null;
};

// Prices the order from database prices. Keep in sync with frontend checkout/order-summary.
const priceOrder = (cartItems, products) => {
  const productsById = new Map(products.map((doc) => [doc._id.toString(), doc]));

  const orderItems = cartItems.map(({ product, quantity }) => {
    const doc = productsById.get(product);

    return {
      product: doc._id,
      name: doc.name,
      price: doc.price,
      image: doc.images[0]?.url,
      quantity,
    };
  });

  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = itemsPrice * 0.18;
  const totalPrice = itemsPrice + taxPrice;

  return { orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice };
};

exports.readCartItems = readCartItems;
exports.priceOrder = priceOrder;

// Create New Order
exports.createNewOrder = catchAsyncError(async (req, res, next) => {
  const { shippingInfo, paymentInfo } = req.body;
  const cartItems = readCartItems(req.body.orderItems);

  if (!cartItems) {
    return next(
      new ErrorHandler(
        `Send 1 to ${MAX_ORDER_ITEMS} order items, each with a product and a quantity.`,
        400
      )
    );
  }

  if (typeof paymentInfo?.id !== "string" || !paymentInfo.id) {
    return next(new ErrorHandler("Payment information is missing.", 400));
  }

  const productIds = [...new Set(cartItems.map((item) => item.product))];
  const products = await Product.find({
    _id: mongoose.trusted({ $in: productIds }),
  });

  if (products.length !== productIds.length) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const totals = priceOrder(cartItems, products);

  if (await Order.exists({ "paymentInfo.id": paymentInfo.id })) {
    return next(new ErrorHandler("This payment is already used.", 400));
  }

  // The client only reports the payment. Stripe confirms it was paid, in full, for this total.
  const paymentIntent = await getStripe().paymentIntents.retrieve(paymentInfo.id);

  if (
    paymentIntent.status !== "succeeded" ||
    paymentIntent.currency !== "inr" ||
    paymentIntent.amount !== Math.round(totals.totalPrice * 100)
  ) {
    return next(
      new ErrorHandler("Payment does not match the order total.", 400)
    );
  }

  const order = await Order.create({
    shippingInfo,
    ...totals,
    paymentInfo: { id: paymentIntent.id, status: paymentIntent.status },
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

  // Owners and admins only. Others get 404, so order ids cannot be probed.
  if (
    !order ||
    (req.user.role !== "admin" &&
      order.user?._id.toString() !== req.user._id.toString())
  ) {
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
    for (const doc of order.orderItems) {
      await updateStock(doc.product, doc.quantity);
    }
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

  if (!product) return;

  product.stock -= qty;

  await product.save();
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully.",
  });
});
