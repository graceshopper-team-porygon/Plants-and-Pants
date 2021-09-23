const Sequelize = require("sequelize");
const db = require("../db");

const Order = db.define("order", {
  status: {
    type: Sequelize.ENUM("Complete", "In Progress", "Delivered"),
  },
  total: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Order;
