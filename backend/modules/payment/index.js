const paymentRouter = require("./routes");

const paymentModule = {
  init: (app) => {
    app.use("/api/v1", paymentRouter);
    console.log("[module]: payment module loaded");
  },
};

module.exports = paymentModule;
