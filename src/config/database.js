const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.postgres.url, {
  dialect: 'postgres',
  logging: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: {
    ssl: false,
  },
});

module.exports = sequelize;
