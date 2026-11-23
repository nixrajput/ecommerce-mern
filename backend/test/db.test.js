const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server-core");

// Stub Stripe before the controllers load it. retrieve() waits until two calls arrive,
// so both order requests pass the exists() check before either one inserts.
const stripePath = require.resolve("../utils/stripe");
let waiting = [];
const intents = {};
require.cache[stripePath] = {
  id: stripePath,
  filename: stripePath,
  loaded: true,
  exports: () => ({
    paymentIntents: {
      retrieve: (id) =>
        new Promise((resolve) => {
          waiting.push(() => resolve(intents[id]));
          if (waiting.length === 2) {
            waiting.forEach((release) => release());
            waiting = [];
          }
        }),
    },
  }),
};

const connectDatabase = require("../helpers/connectDB");
const { runApp, closeApp } = require("../app");
const initModules = require("../initModules");
const User = require("../modules/user/models/userModel");
const Product = require("../modules/product/models/productModel");
const Order = require("../modules/order/models/orderModel");

let mongo;
let server;
let base;

const call = async (method, url, body, token) => {
  const res = await fetch(base + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
};

before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.DB_URI = mongo.getUri();
  process.env.DB_NAME = "zz-dummy-test";
  process.env.JWT_SECRET = "zz-dummy-test-secret";
  await connectDatabase();
  await Order.init();

  const app = runApp();
  initModules(app);
  closeApp(app);
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(async () => {
  server.close();
  await mongoose.disconnect();
  await mongo.stop();
});

test("login issues a fresh token and stores none", async () => {
  await User.create({ name: "zz-dummy-alice", email: "zz-dummy-alice@example.test", password: "alice-pass-1" });
  const login = () => call("POST", "/login", { email: "zz-dummy-alice@example.test", password: "alice-pass-1" });

  const first = await login();
  assert.equal(first.status, 200);
  assert.equal(first.body.result.token, undefined);
  assert.equal(typeof first.body.expiresAt, "number");

  const raw = await User.collection.findOne({ email: "zz-dummy-alice@example.test" });
  assert.equal(raw.token, undefined);
  assert.equal(raw.expiresAt, undefined);

  const me = await call("GET", "/user/me", null, first.body.token);
  assert.equal(me.status, 200);
  assert.equal(me.body.result.email, "zz-dummy-alice@example.test");
});

test("user JSON hides tokens that older versions stored", async () => {
  await User.collection.insertOne({
    name: "zz-dummy-legacy",
    email: "zz-dummy-legacy@example.test",
    password: "x",
    role: "user",
    token: "legacy.jwt.value",
    expiresAt: "9999999999",
  });
  const legacy = await User.findOne({ email: "zz-dummy-legacy@example.test" });
  const json = JSON.parse(JSON.stringify(legacy));

  assert.equal(json.token, undefined);
  assert.equal(json.expiresAt, undefined);
  assert.equal(json.password, undefined);
});

test("two concurrent orders with one payment create one order", async () => {
  const user = await User.create({ name: "zz-dummy-bob", email: "zz-dummy-bob@example.test", password: "bob-pass-12" });
  const token = user.generateToken();
  const product = await Product.create({
    name: "zz-dummy-phone",
    price: 500,
    category: "Mobile Phone",
    stock: 10,
    user: user._id,
    images: [{ public_id: "p", url: "https://example.test/p.png" }],
  });
  intents.pi_race = {
    id: "pi_race",
    status: "succeeded",
    currency: "inr",
    amount: 59000,
    metadata: { user: user._id.toString() },
  };

  const body = {
    shippingInfo: { address: "a", city: "c", state: "s", country: "IN", pinCode: 1, phoneNo: 1 },
    orderItems: [{ product: product._id.toString(), quantity: 1 }],
    paymentInfo: { id: "pi_race" },
  };
  const results = await Promise.all([
    call("POST", "/order/new", body, token),
    call("POST", "/order/new", body, token),
  ]);

  assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
  assert.equal(results.find((r) => r.status === 400).body.message, "This payment is already used.");
  assert.equal(await Order.countDocuments({ "paymentInfo.id": "pi_race" }), 1);
});
