const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const exchangeRateValidation = require('../../validations/exchangeRate.validation');
const exchangeRateController = require('../../controllers/exchangeRate.controller');

const router = express.Router();

// Public routes (no authentication required)
router
  .route('/latest/:fromCurrency/:toCurrency')
  .get(validate(exchangeRateValidation.getLatestRate), exchangeRateController.getLatestRate);

router
  .route('/history/:fromCurrency/:toCurrency')
  .get(validate(exchangeRateValidation.getRateHistory), exchangeRateController.getRateHistory);

router
  .route('/convert/:fromCurrency/:toCurrency')
  .post(validate(exchangeRateValidation.convertAmount), exchangeRateController.convertAmount);

router
  .route('/source/:source')
  .get(validate(exchangeRateValidation.getRatesBySource), exchangeRateController.getRatesBySource);

router
  .route('/average/:fromCurrency/:toCurrency')
  .get(validate(exchangeRateValidation.getAverageRate), exchangeRateController.getAverageRate);

router
  .route('/top-currencies')
  .get(validate(exchangeRateValidation.getTopCurrencies), exchangeRateController.getTopCurrencies);

// Admin routes (require authentication)
router.route('/crawl/all').post(auth('manageExchangeRates'), exchangeRateController.runCrawlers);

router.route('/crawl/exchangerate-api').post(auth('manageExchangeRates'), exchangeRateController.crawlFromExchangeRateAPI);

router.route('/crawl/fixer-api').post(auth('manageExchangeRates'), exchangeRateController.crawlFromFixerAPI);

router.route('/crawl/vietnamese-banks').post(auth('manageExchangeRates'), exchangeRateController.crawlFromVietnameseBanks);

// New smart crawling routes
router.route('/crawl/priority').post(auth('manageExchangeRates'), exchangeRateController.crawlPriorityCurrencies);

router.route('/crawl/batches').post(auth('manageExchangeRates'), exchangeRateController.crawlInBatches);

router.route('/crawl/smart').post(auth('manageExchangeRates'), exchangeRateController.smartCrawl);

router
  .route('/crawl/single/:fromCurrency/:toCurrency')
  .post(auth('manageExchangeRates'), exchangeRateController.crawlSingleRate);

// CRUD routes for exchange rates
router
  .route('/')
  .post(
    auth('manageExchangeRates'),
    validate(exchangeRateValidation.createExchangeRate),
    exchangeRateController.createExchangeRate
  )
  .get(validate(exchangeRateValidation.getExchangeRates), exchangeRateController.getExchangeRates);

router
  .route('/:exchangeRateId')
  .get(validate(exchangeRateValidation.getExchangeRate), exchangeRateController.getExchangeRate)
  .patch(
    auth('manageExchangeRates'),
    validate(exchangeRateValidation.updateExchangeRate),
    exchangeRateController.updateExchangeRate
  )
  .delete(
    auth('manageExchangeRates'),
    validate(exchangeRateValidation.deleteExchangeRate),
    exchangeRateController.deleteExchangeRate
  );

module.exports = router;
