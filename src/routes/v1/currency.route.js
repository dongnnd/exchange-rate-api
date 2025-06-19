const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const currencyValidation = require('../../validations/currency.validation');
const currencyController = require('../../controllers/currency.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageCurrencies'), validate(currencyValidation.createCurrency), currencyController.createCurrency)
  .get(validate(currencyValidation.getCurrencies), currencyController.getCurrencies);

router
  .route('/:currencyId')
  .get(auth('getCurrencies'), validate(currencyValidation.getCurrency), currencyController.getCurrency)
  .patch(auth('manageCurrencies'), validate(currencyValidation.updateCurrency), currencyController.updateCurrency)
  .delete(auth('manageCurrencies'), validate(currencyValidation.deleteCurrency), currencyController.deleteCurrency);

module.exports = router;
