const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('flag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: false
  });
};