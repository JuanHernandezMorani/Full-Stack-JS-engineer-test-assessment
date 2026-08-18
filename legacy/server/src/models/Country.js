const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('country', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
      }
  },
  {
    timestamps: false
  });
};