const { Currency } = require('../../models/sequelize');

const getCurrencies = async () => {
  const currencies = await Currency.findAll();

  return currencies.map((currency) => ({
    code: currency.code,
    name_vi: currency.name_vi,
    name_en: currency.name_en,
    flag: currency.flag,
  }));
};

module.exports = {
  getCurrencies,
};
