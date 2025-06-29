const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Currency = sequelize.define(
  'Currency',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 3],
      },
    },
    name_vi: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      comment: 'Vietnamese name of the currency',
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      comment: 'English name of the currency',
    },
    symbol: {
      type: DataTypes.STRING(5),
      allowNull: false,
      trim: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
    flag: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },
  },
  {
    tableName: 'currencies',
    indexes: [
      {
        unique: true,
        fields: ['code'],
      },
    ],
  }
);

module.exports = Currency;
