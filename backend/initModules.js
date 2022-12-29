const userModule = require("./modules/user");
const productModule = require("./modules/product");
const orderModule = require("./modules/order");
const paymentModule = require("./modules/payment");

module.exports = (app) => {
  userModule.init(app);
  productModule.init(app);
  orderModule.init(app);
  paymentModule.init(app);
};
