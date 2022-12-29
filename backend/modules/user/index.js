const userRouter = require("./routes");

const userModule = {
  init: (app) => {
    app.use("/api/v1", userRouter);
    console.log("[module]: user module loaded");
  },
};

module.exports = userModule;
