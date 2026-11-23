const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const errorMiddleware = require("./middlewares/error");

exports.runApp = () => {
  const app = express();

  // Proxy hops in front of the app (default 1), so rate limits key on the client IP. Never `true`: clients could spoof it.
  app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 1));

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "https://js.stripe.com", "https://*.js.stripe.com"],
          "frame-src": ["https://js.stripe.com", "https://*.js.stripe.com", "https://hooks.stripe.com"],
          "connect-src": ["'self'", "https://api.stripe.com"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
        },
      },
    })
  );

  // The frontend calls the API from the same origin. CORS_ORIGIN is a comma-separated allowlist for other origins.
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : false;

  app.use(
    cors({
      origin: corsOrigins,
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credentials: true,
      exposedHeaders: ["x-auth-token"],
    })
  );
  // Only these routes take base64 images. Up to 10 images of 1 MiB (busboy's default field size, about
  // 750 KB raw) plus text fields fit in 11 MiB. Every other route keeps the 100 KB default.
  app.use(
    ["/api/v1/admin/product", "/api/v1/user/me/update"],
    express.json({ limit: "11mb" }),
    fileUpload({ limits: { fieldSize: 1024 * 1024, fields: 20, files: 0 } })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Express 5 leaves req.body undefined when no parser ran. The controllers destructure it.
  app.use((req, res, next) => {
    req.body ??= {};
    next();
  });

  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 1000,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    })
  );

  // API Health Route
  app.route("/health").get(function (req, res) {
    res.status(200).json({
      success: true,
      message: "Server is up and running...",
    });
  });

  // SETTING STATIC WEB PATH

  var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html', 'css', 'js', 'ico', 'jpg', 'jpeg', 'png', 'svg'],
    index: ['index.html'],
    maxAge: '1m',
    redirect: false
  }

  app.use(express.static(path.join(__dirname, "../frontend/build"), options));

  return app;
};

exports.closeApp = (app) => {
  // SPA fallback goes after the API routes, so it does not shadow GET /api/*.
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
    app.get("/{*splat}", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    });
  }

  // Middleware for Errors
  app.use(errorMiddleware);
};
