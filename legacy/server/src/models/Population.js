const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('population', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
  {
    timestamps: false
  });
};