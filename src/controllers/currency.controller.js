const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { currencyService } = require('../services');

const getCurrencies = catchAsync(async (req, res) => {
  const currencies = await currencyService.getCurrencies();
  res.status(httpStatus.OK).send(currencies);
});

const getCurrency = catchAsync(async (req, res) => {
  const currency = await currencyService.getCurrencyById(req.params.currencyId);
  res.status(httpStatus.OK).send(currency);
});

const createCurrency = catchAsync(async (req, res) => {
  const currency = await currencyService.createCurrency(req.body);
  res.status(httpStatus.CREATED).send(currency);
});

const updateCurrency = catchAsync(async (req, res) => {
  const currency = await currencyService.updateCurrencyById(req.params.currencyId, req.body);
  res.status(httpStatus.OK).send(currency);
});

const deleteCurrency = catchAsync(async (req, res) => {
  await currencyService.deleteCurrencyById(req.params.currencyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getCurrencies,
  getCurrency,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};
