const Sequelize = require('sequelize');
const db = require('../config').db;

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

const User = sequelize.define('users', {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
});

module.exports = User;
