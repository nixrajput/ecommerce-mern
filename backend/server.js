const cloudinary = require("cloudinary");
const connectDatabase = require("./helpers/connectDB");
const { runApp, closeApp } = require("./app");
const initModules = require("./initModules");

const app = runApp();

(async () => {
  // Config
  if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "prod") {
    require("dotenv").config({
      path: "backend/config/config.env",
    });
  }

  // Cloudinary Setup
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Connecting to DB
  await connectDatabase();

  // Init Modules
  initModules(app);

  // Error Handler
  closeApp(app);

  const port = process.env.PORT || 4000;
  const server = app.listen(port, (err) => {
    if (err) {
      console.log(`[server] could not start http server on port: ${port}`);
      return;
    }
    console.log(`[server] running on port: ${port}`);
  });

  // Handling Uncaught Exception
  process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`[server] shutting down due to Uncaught Exception`);

    server.close(() => {
      process.exit(1);
    });
  });

  // Unhandled Promise Rejection
  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`[server] shutting down due to Unhandled Promise Rejection`);

    server.close(() => {
      process.exit(1);
    });
  });
})();
