const productRouter = require("./routes");

const productModule = {
  init: (app) => {
    app.use("/api/v1", productRouter);
    console.log("[module]: product module loaded");
  },
};

module.exports = productModule;
