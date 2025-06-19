const Joi = require('joi');

const getLatestRate = {
  params: Joi.object().keys({
    fromCurrency: Joi.string().required().uppercase().trim(),
    toCurrency: Joi.string().required().uppercase().trim(),
  }),
};

const getRateHistory = {
  params: Joi.object().keys({
    fromCurrency: Joi.string().required().uppercase().trim(),
    toCurrency: Joi.string().required().uppercase().trim(),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(1000).default(100),
  }),
};

const convertAmount = {
  params: Joi.object().keys({
    fromCurrency: Joi.string().required().uppercase().trim(),
    toCurrency: Joi.string().required().uppercase().trim(),
  }),
  body: Joi.object().keys({
    amount: Joi.number().positive().required(),
  }),
};

const getRatesBySource = {
  params: Joi.object().keys({
    source: Joi.string().required().trim(),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(1000).default(50),
  }),
};

const getAverageRate = {
  params: Joi.object().keys({
    fromCurrency: Joi.string().required().uppercase().trim(),
    toCurrency: Joi.string().required().uppercase().trim(),
  }),
  query: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  }),
};

const getTopCurrencies = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

module.exports = {
  getLatestRate,
  getRateHistory,
  convertAmount,
  getRatesBySource,
  getAverageRate,
  getTopCurrencies,
};
