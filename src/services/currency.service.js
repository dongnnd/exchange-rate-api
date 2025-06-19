const Currency = require('../models/currency.model');

/**
 * Create a currency
 * @param {Object} currencyBody
 * @returns {Promise<Currency>}
 */
const createCurrency = async (currencyBody) => {
  return Currency.create(currencyBody);
};

/**
 * Get currency by id
 * @param {ObjectId} id
 * @returns {Promise<Currency>}
 */
const getCurrencyById = async (id) => {
  return Currency.findById(id);
};

/**
 * Get currency by code
 * @param {string} code
 * @returns {Promise<Currency>}
 */
const getCurrencyByCode = async (code) => {
  return Currency.findOne({ code: code.toUpperCase() });
};

/**
 * Get all currencies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllCurrencies = async (filter, options) => {
  const currencies = await Currency.paginate(filter, options);
  return currencies;
};

/**
 * Update currency by id
 * @param {ObjectId} currencyId
 * @param {Object} updateBody
 * @returns {Promise<Currency>}
 */
const updateCurrencyById = async (currencyId, updateBody) => {
  const currency = await getCurrencyById(currencyId);
  if (!currency) {
    throw new Error('Currency not found');
  }
  Object.assign(currency, updateBody);
  await currency.save();
  return currency;
};

/**
 * Delete currency by id
 * @param {ObjectId} currencyId
 * @returns {Promise<Currency>}
 */
const deleteCurrencyById = async (currencyId) => {
  const currency = await getCurrencyById(currencyId);
  if (!currency) {
    throw new Error('Currency not found');
  }
  await currency.remove();
  return currency;
};

module.exports = {
  createCurrency,
  getCurrencyById,
  getCurrencyByCode,
  getAllCurrencies,
  updateCurrencyById,
  deleteCurrencyById,
};
