const httpStatus = require('http-status');
const { ExchangeRate, Currency } = require('../../models/sequelize');
const ApiError = require('../../utils/ApiError');

/**
 * Get latest exchange rate
 */
const getLatestRate = async (fromCurrencyCode, toCurrencyCode) => {
  const fromCurrency = await Currency.findOne({ where: { code: fromCurrencyCode.toUpperCase() } });
  const toCurrency = await Currency.findOne({ where: { code: toCurrencyCode.toUpperCase() } });

  if (!fromCurrency || !toCurrency) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
  }

  const exchangeRate = await ExchangeRate.findOne({
    where: {
      fromCurrencyId: fromCurrency.id,
      toCurrencyId: toCurrency.id,
      isActive: true,
    },
    include: [
      { model: Currency, as: 'fromCurrency' },
      { model: Currency, as: 'toCurrency' },
    ],
    order: [['timestamp', 'DESC']],
  });

  if (!exchangeRate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange rate not found');
  }

  return exchangeRate;
};

/**
 * Get exchange rate history
 */
const getRateHistory = async (fromCurrencyCode, toCurrencyCode, limit = 10) => {
  const fromCurrency = await Currency.findOne({ where: { code: fromCurrencyCode.toUpperCase() } });
  const toCurrency = await Currency.findOne({ where: { code: toCurrencyCode.toUpperCase() } });

  if (!fromCurrency || !toCurrency) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
  }

  const exchangeRates = await ExchangeRate.findAll({
    where: {
      fromCurrencyId: fromCurrency.id,
      toCurrencyId: toCurrency.id,
      isActive: true,
    },
    include: [
      { model: Currency, as: 'fromCurrency' },
      { model: Currency, as: 'toCurrency' },
    ],
    order: [['timestamp', 'DESC']],
    limit: parseInt(limit, 10),
  });

  return exchangeRates;
};

/**
 * Convert amount between currencies
 */
const convertAmount = async (fromCurrencyCode, toCurrencyCode, amount) => {
  const exchangeRate = await getLatestRate(fromCurrencyCode, toCurrencyCode);

  return {
    fromCurrency: exchangeRate.fromCurrency,
    toCurrency: exchangeRate.toCurrency,
    originalAmount: parseFloat(amount),
    convertedAmount: parseFloat(amount) * parseFloat(exchangeRate.rate),
    rate: parseFloat(exchangeRate.rate),
    timestamp: exchangeRate.timestamp,
    source: exchangeRate.source,
  };
};

/**
 * Create new exchange rate
 */
const createExchangeRate = async (exchangeRateBody) => {
  const fromCurrency = await Currency.findOne({ where: { code: exchangeRateBody.fromCurrency.toUpperCase() } });
  const toCurrency = await Currency.findOne({ where: { code: exchangeRateBody.toCurrency.toUpperCase() } });

  if (!fromCurrency || !toCurrency) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
  }

  const exchangeRate = await ExchangeRate.create({
    fromCurrencyId: fromCurrency.id,
    toCurrencyId: toCurrency.id,
    rate: exchangeRateBody.rate,
    source: exchangeRateBody.source,
    timestamp: exchangeRateBody.timestamp || new Date(),
    isActive: true,
  });

  return exchangeRate;
};

/**
 * Update exchange rate by ID
 */
const updateExchangeRateById = async (exchangeRateId, updateBody) => {
  const exchangeRate = await ExchangeRate.findByPk(exchangeRateId);
  if (!exchangeRate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange rate not found');
  }

  Object.assign(exchangeRate, updateBody);
  await exchangeRate.save();
  return exchangeRate;
};

/**
 * Delete exchange rate by ID
 */
const deleteExchangeRateById = async (exchangeRateId) => {
  const exchangeRate = await ExchangeRate.findByPk(exchangeRateId);
  if (!exchangeRate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange rate not found');
  }
  await exchangeRate.destroy();
};

/**
 * Query exchange rates
 */
const queryExchangeRates = async (filter, options) => {
  const { limit, page, sortBy, sortOrder } = options;

  const whereClause = {};
  if (filter.source) whereClause.source = filter.source;
  if (filter.isActive !== undefined) whereClause.isActive = filter.isActive;

  const exchangeRates = await ExchangeRate.findAndCountAll({
    where: whereClause,
    include: [
      { model: Currency, as: 'fromCurrency' },
      { model: Currency, as: 'toCurrency' },
    ],
    order: sortBy && sortOrder ? [[sortBy, sortOrder]] : [['createdAt', 'DESC']],
    limit,
    offset: (page - 1) * limit,
  });

  return {
    results: exchangeRates.rows,
    page,
    limit,
    totalPages: Math.ceil(exchangeRates.count / limit),
    totalResults: exchangeRates.count,
  };
};

module.exports = {
  getLatestRate,
  getRateHistory,
  convertAmount,
  createExchangeRate,
  updateExchangeRateById,
  deleteExchangeRateById,
  queryExchangeRates,
};
