const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest
    ? 'sqlite::memory:' // Base de datos en memoria solo para pruebas
    : process.env.DATABASE_URL || 'postgres://postgres:Jkanime123@localhost:5432/emotional_diary',
  {
    logging: false, // Desactiva los logs de SQL
  }
);

module.exports = sequelize;
