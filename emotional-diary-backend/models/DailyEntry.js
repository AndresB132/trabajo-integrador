module.exports = (sequelize, DataTypes) => {
  const DailyEntry = sequelize.define('DailyEntry', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    emotion_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activities: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Asegúrate de que la tabla de usuarios se llame 'users'
        key: 'id',
      },
      onDelete: 'CASCADE', // Elimina entradas si el usuario se elimina
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'daily_entries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return DailyEntry;
};
