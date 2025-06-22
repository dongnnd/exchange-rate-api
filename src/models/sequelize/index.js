const User = require('./user.model');
const Currency = require('./currency.model');
const ExchangeRate = require('./exchangeRate.model');

// Define associations
ExchangeRate.belongsTo(Currency, { as: 'from_currency', foreignKey: 'from_currency_id' });
ExchangeRate.belongsTo(Currency, { as: 'to_currency', foreignKey: 'to_currency_id' });

Currency.hasMany(ExchangeRate, { as: 'from_rates', foreignKey: 'from_currency_id' });
Currency.hasMany(ExchangeRate, { as: 'to_rates', foreignKey: 'to_currency_id' });

module.exports = {
  User,
  Currency,
  ExchangeRate,
};
