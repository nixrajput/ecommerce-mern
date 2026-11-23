const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("../helpers/connectDB");
const { runApp, closeApp } = require("../app");
const initModules = require("../initModules");
const errorMiddleware = require("../middlewares/error");
const ApiFeatures = require("../utils/apiFeatures");
const Product = require("../modules/product/models/productModel");
const User = require("../modules/user/models/userModel");
const { isAuthenticatedUser } = require("../middlewares/auth");
const { readImages } = require("../modules/product/controllers");
const { readCartItems, priceOrder } = require("../modules/order/controllers");

let server;
let baseUrl;

before(async () => {
  const app = runApp();
  initModules(app);
  closeApp(app);
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test("sanitizeFilter is on for every query", () => {
  assert.equal(mongoose.get("sanitizeFilter"), true);
});

test("product filter keeps only category and numeric ranges", () => {
  const query = new ApiFeatures(Product.find(), {
    keyword: "a.*b",
    category: "Laptop",
    "price[gte]": "10",
    "price[lte]": "abc",
    "ratings[gte]": "4",
    "price[$where]": "1",
    $where: "sleep(1000)",
    user: "x",
    page: "-3",
  })
    .search()
    .filter()
    .pagination(4).query;

  const filter = query.getFilter();
  assert.deepEqual(Object.keys(filter).sort(), ["category", "name", "price", "ratings"]);
  assert.equal(filter.name.$regex, "a\\.\\*b");
  assert.deepEqual(JSON.parse(JSON.stringify(filter.price)), { $gte: 10 });
  assert.deepEqual(JSON.parse(JSON.stringify(filter.ratings)), { $gte: 4 });
  assert.equal(query.getOptions().skip, 0);
});

test("product filter ignores non-string query values", () => {
  const filter = new ApiFeatures(Product.find(), {
    keyword: { $ne: null },
    category: ["a", "b"],
  })
    .search()
    .filter().query.getFilter();

  assert.deepEqual(filter, {});
});

test("login rejects operator objects before any query", async () => {
  const res = await fetch(`${baseUrl}/api/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: { $ne: null }, password: "x" }),
  });

  assert.equal(res.status, 401);
});

test("auth routes allow 10 requests per window", async () => {
  const statuses = [];

  for (let i = 0; i < 11; i++) {
    const res = await fetch(`${baseUrl}/api/v1/password/forgot`, { method: "POST" });
    statuses.push(res.status);
  }

  assert.equal(statuses.at(-1), 429);
});

test("responses carry security headers and no wildcard CORS", async () => {
  const res = await fetch(`${baseUrl}/health`, {
    headers: { Origin: "https://evil.example" },
  });

  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-security-policy"), /script-src 'self' https:\/\/js\.stripe\.com/);
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("access-control-allow-origin"), null);
});

test("production errors hide internal messages", () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  const originalError = console.error;
  console.error = () => {};

  let body;
  const res = { status: () => res, json: (data) => (body = data) };

  try {
    errorMiddleware(new Error("connect ECONNREFUSED 10.0.0.5:27017"), {}, res);
  } finally {
    process.env.NODE_ENV = previous;
    console.error = originalError;
  }

  assert.equal(body.message, "Internal Server Error");
});

test("image lists are capped at 10 strings", () => {
  assert.deepEqual(readImages("a"), ["a"]);
  assert.equal(readImages(undefined), undefined);
  assert.equal(readImages({ length: 1e9 }), null);
  assert.equal(readImages(Array(11).fill("a")), null);
  assert.equal(readImages([1]), null);
});

test("order items need a product id and a positive integer quantity", () => {
  const id = new mongoose.Types.ObjectId().toString();

  assert.deepEqual(readCartItems([{ product: id, quantity: 2 }]), [{ product: id, quantity: 2 }]);
  assert.equal(readCartItems([]), null);
  assert.equal(readCartItems([{ product: id, quantity: 0 }]), null);
  assert.equal(readCartItems([{ product: id, quantity: 1.5 }]), null);
  assert.equal(readCartItems([{ product: { $ne: null }, quantity: 1 }]), null);
  assert.equal(readCartItems(Array(51).fill({ product: id, quantity: 1 })), null);
});

test("order totals come from database prices, not the request", () => {
  const product = { _id: new mongoose.Types.ObjectId(), name: "Phone", price: 500, images: [{ url: "u" }] };
  const totals = priceOrder([{ product: product._id.toString(), quantity: 3, price: 1 }], [product]);

  assert.equal(totals.itemsPrice, 1500);
  assert.equal(totals.shippingPrice, 0);
  assert.equal(totals.taxPrice, 270);
  assert.equal(totals.totalPrice, 1770);
  assert.equal(totals.orderItems[0].price, 500);
});

test("tokens issued before a password change are rejected", async () => {
  process.env.JWT_SECRET = "zz-dummy-test-secret";
  const findById = User.findById;
  const changedAt = Math.floor(Date.now() / 1000);
  User.findById = async () => ({ role: "user", passwordChangedAt: new Date(changedAt * 1000) });

  const authenticate = (iat) =>
    new Promise((resolve) => {
      const token = jwt.sign({ id: "x", iat, exp: changedAt + 3600 }, process.env.JWT_SECRET);
      const req = { headers: { authorization: `Bearer ${token}` } };
      isAuthenticatedUser(req, {}, (err) => resolve(err));
    });

  try {
    assert.equal((await authenticate(changedAt - 60)).statusCode, 401);
    assert.equal(await authenticate(changedAt + 1), undefined);
  } finally {
    User.findById = findById;
  }
});

test("tokens without an expiry are rejected", async () => {
  process.env.JWT_SECRET = "zz-dummy-test-secret";
  const findById = User.findById;
  User.findById = async () => ({ role: "user" });

  try {
    const token = jwt.sign({ id: "x" }, process.env.JWT_SECRET);
    const err = await new Promise((resolve) =>
      isAuthenticatedUser({ headers: { authorization: `Bearer ${token}` } }, {}, resolve)
    );
    assert.equal(err.statusCode, 401);
  } finally {
    User.findById = findById;
  }
});

test("generateToken returns an expiring token and stores nothing", () => {
  process.env.JWT_SECRET = "zz-dummy-test-secret";
  const user = new User({ name: "zz-dummy", email: "zz-dummy@example.test", password: "x" });
  const token = user.generateToken();

  assert.equal(typeof jwt.decode(token).exp, "number");
  assert.equal(user.get("token"), undefined);
  assert.equal(user.isModified(), true);
  assert.deepEqual(user.modifiedPaths().filter((p) => /token|expiresAt/.test(p)), []);
});

test("bodies over 100 KB get 413 outside the image routes", async () => {
  const big = JSON.stringify({ comment: "x".repeat(200 * 1024) });
  const res = await fetch(`${baseUrl}/api/v1/review`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: big,
  });

  assert.equal(res.status, 413);
});

test("image routes accept bodies up to 11 MB", async () => {
  const body = JSON.stringify({ images: ["x".repeat(1024 * 1024)] });
  const res = await fetch(`${baseUrl}/api/v1/admin/product/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  assert.equal(res.status, 400, "reaches the auth check instead of failing on size");
  const tooBig = await fetch(`${baseUrl}/api/v1/admin/product/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images: ["x".repeat(12 * 1024 * 1024)] }),
  });
  assert.equal(tooBig.status, 413);
});
