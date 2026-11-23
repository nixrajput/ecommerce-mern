const Product = require("../models/productModel");
const ErrorHandler = require("../../../utils/errorHandler");
const catchAsyncError = require("../../../middlewares/catchAsyncError");
const ApiFeatures = require("../../../utils/apiFeatures");
const cloudinary = require("cloudinary");

const MAX_IMAGES = 10;
const PRODUCT_FIELDS = ["name", "description", "price", "category", "stock"];

// Copies only the editable product fields, so a request cannot set ratings, reviews or user.
const pickProductFields = (body) => {
  const fields = {};

  for (const key of PRODUCT_FIELDS) {
    if (body[key] !== undefined) fields[key] = body[key];
  }

  return fields;
};

// Returns the uploaded images as an array of strings, undefined when absent, or null when invalid.
const readImages = (value) => {
  if (value === undefined) return undefined;

  const images = typeof value === "string" ? [value] : value;

  if (
    !Array.isArray(images) ||
    images.length > MAX_IMAGES ||
    !images.every((image) => typeof image === "string")
  ) {
    return null;
  }

  return images;
};

exports.readImages = readImages;

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const images = readImages(req.body.images);

  if (images === null) {
    return next(
      new ErrorHandler(`Send up to ${MAX_IMAGES} images as strings.`, 400)
    );
  }

  const imagesLink = [];

  for (let i = 0; i < (images?.length ?? 0); i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  const product = await Product.create({
    ...pickProductFields(req.body),
    images: imagesLink,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    result: product,
  });
});

// Get All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 4;
  const productCount = await Product.countDocuments();

  let products = await new ApiFeatures(Product.find(), req.query)
    .search()
    .filter().query;

  const filteredProductsCount = products.length;

  products = await new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage).query;

  res.status(200).json({
    success: true,
    count: productCount,
    resultPerPage,
    filteredProductsCount,
    results: products,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  const productCount = products.length;

  res.status(200).json({
    success: true,
    count: productCount,
    results: products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    result: product,
  });
});

// Update Product -- Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const images = readImages(req.body.images);
  const update = pickProductFields(req.body);

  if (images === null) {
    return next(
      new ErrorHandler(`Send up to ${MAX_IMAGES} images as strings.`, 400)
    );
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    update.images = imagesLink;
  }

  product = await Product.findByIdAndUpdate(req.params.id, update, {
    returnDocument: "after",
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    result: product,
  });
});

// Delete Product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

// Create or Update Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { comment, productId } = req.body;
  const rating = Number(req.body.rating);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return next(new ErrorHandler("Rating must be between 1 and 5.", 400));
  }

  if (typeof comment !== "string" || !comment.trim()) {
    return next(new ErrorHandler("Please enter a comment.", 400));
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const isReviewed = product.reviews.find(
    (doc) => doc.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((doc) => {
      if (doc.user.toString() === req.user._id.toString())
        (doc.rating = rating), (doc.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let total = 0;

  product.reviews.forEach((doc) => {
    total += doc.rating;
  });

  product.ratings = total / product.reviews.length;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Review saved successfully.",
  });
});

// Get All Reviews of a Product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    count: product.reviews.length,
    results: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const review = product.reviews.find(
    (doc) => doc._id.toString() === String(req.query.id)
  );

  if (!review) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  if (
    req.user.role !== "admin" &&
    review.user.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("You can delete only your own review.", 403));
  }

  const reviews = product.reviews.filter(
    (doc) => doc._id.toString() !== String(req.query.id)
  );

  let total = 0;

  reviews.forEach((doc) => {
    total += doc.rating;
  });

  let ratings;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = total / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully.",
  });
});
