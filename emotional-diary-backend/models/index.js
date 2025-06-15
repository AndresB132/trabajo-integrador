const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Importa primero User
const User = require('./User')(sequelize, Sequelize.DataTypes);
const DailyEntry = require('./DailyEntry')(sequelize, Sequelize.DataTypes);

// Relaciones
User.hasMany(DailyEntry, { foreignKey: 'userId' });
DailyEntry.belongsTo(User, { foreignKey: 'userId' });

// Sincroniza en orden
sequelize.sync({ force: false }) // Cambia a true SOLO para desarrollo (borra todo)
  .then(() => {
    console.log("✅ Tablas sincronizadas correctamente");
  })
  .catch(err => {
    console.error("❌ Error al sincronizar tablas:", err.message);
  });

module.exports = {
  User,
  DailyEntry
};