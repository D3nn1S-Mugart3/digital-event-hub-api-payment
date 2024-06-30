const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bgivundzrylpnlvsapmh", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
