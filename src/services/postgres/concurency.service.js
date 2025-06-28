const { Currency } = require('../../models/sequelize');

const getCurrencies = async () => {
  const currencies = await Currency.findAll();

  return currencies.map((currency) => ({
    code: currency.code,
    flag: currency.flag,
  }));
};

module.exports = {
  getCurrencies,
};
