const { Currency } = require('../../models/sequelize');

const getCurrencies = async () => {
  const currencies = await Currency.findAll();

  const specialCurrencyIcons = ['XAU', 'XPT', 'XPD', 'XDR'];

  return currencies
    .filter((currency) => !specialCurrencyIcons.includes(currency.code))
    .map((currency) => ({
      code: currency.code,
      name_vi: currency.name_vi,
      name_en: currency.name_en,
      flag: currency.flag,
    }));
};

module.exports = {
  getCurrencies,
};
