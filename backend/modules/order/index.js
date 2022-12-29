const orderRouter = require("./routes");

const orderModule = {
  init: (app) => {
    app.use("/api/v1", orderRouter);
    console.log("[module]: order module loaded");
  },
};

module.exports = orderModule;
