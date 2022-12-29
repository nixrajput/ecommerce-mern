const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");

exports.runApp = () => {
  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credentials: true,
      exposedHeaders: ["x-auth-token"],
    })
  );
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(fileUpload());

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

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    });
  }

  return app;
};

exports.closeApp = (app) => {
  // Middleware for Errors
  app.use(errorMiddleware);
};
