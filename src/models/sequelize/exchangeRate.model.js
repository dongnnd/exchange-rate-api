const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ExchangeRate = sequelize.define(
  'ExchangeRate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from_currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'currencies',
        key: 'id',
      },
    },
    to_currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'currencies',
        key: 'id',
      },
    },
    rate: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
  },
  {
    tableName: 'exchange_rates',
    indexes: [
      {
        unique: true,
        fields: ['from_currency_id', 'to_currency_id'],
        name: 'exchange_rates_from_to_unique',
      },
      {
        fields: ['from_currency_id', 'to_currency_id', 'timestamp'],
        name: 'exchange_rates_from_to_timestamp_idx',
      },
      {
        fields: ['source', 'timestamp'],
        name: 'exchange_rates_source_timestamp_idx',
      },
    ],
  }
);

module.exports = ExchangeRate;
