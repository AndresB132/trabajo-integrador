// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:Jkanime123@localhost:5432/emotional_diary', {
  logging: false,
});

module.exports = sequelize;