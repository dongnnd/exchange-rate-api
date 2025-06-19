const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCurrency = {
  body: Joi.object().keys({
    code: Joi.string().required().uppercase().trim(),
    name: Joi.string().required().trim(),
    symbol: Joi.string().trim(),
    isActive: Joi.boolean(),
  }),
};

const getCurrencies = {
  query: Joi.object().keys({
    code: Joi.string().uppercase().trim(),
    name: Joi.string().trim(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCurrency = {
  params: Joi.object().keys({
    currencyId: Joi.string().custom(objectId),
  }),
};

const updateCurrency = {
  params: Joi.object().keys({
    currencyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      code: Joi.string().uppercase().trim(),
      name: Joi.string().trim(),
      symbol: Joi.string().trim(),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteCurrency = {
  params: Joi.object().keys({
    currencyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCurrency,
  getCurrencies,
  getCurrency,
  updateCurrency,
  deleteCurrency,
};
