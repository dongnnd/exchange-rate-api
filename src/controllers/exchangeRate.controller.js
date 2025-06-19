const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { exchangeRateService, crawlerService } = require('../services');
const CrawlerService = require('../services/crawler.service');

const getLatestRate = catchAsync(async (req, res) => {
  const { fromCurrency, toCurrency } = req.params;
  const exchangeRate = await exchangeRateService.getLatestRate(fromCurrency, toCurrency);
  res.status(httpStatus.OK).send(exchangeRate);
});

const getRateHistory = catchAsync(async (req, res) => {
  const { fromCurrency, toCurrency } = req.params;
  const { limit } = req.query;
  const exchangeRates = await exchangeRateService.getRateHistory(fromCurrency, toCurrency, limit);
  res.status(httpStatus.OK).send(exchangeRates);
});

const convertAmount = catchAsync(async (req, res) => {
  const { fromCurrency, toCurrency } = req.params;
  const { amount } = req.body;
  const result = await exchangeRateService.convertAmount(fromCurrency, toCurrency, amount);
  res.status(httpStatus.OK).send(result);
});

const getRatesBySource = catchAsync(async (req, res) => {
  const { source } = req.params;
  const { limit } = req.query;
  const exchangeRates = await exchangeRateService.getRatesBySource(source, limit);
  res.status(httpStatus.OK).send(exchangeRates);
});

const getAverageRate = catchAsync(async (req, res) => {
  const { fromCurrency, toCurrency } = req.params;
  const { startDate, endDate } = req.query;
  const result = await exchangeRateService.getAverageRate(fromCurrency, toCurrency, startDate, endDate);
  res.status(httpStatus.OK).send(result);
});

const getTopCurrencies = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const topCurrencies = await exchangeRateService.getTopCurrencies(limit);
  res.status(httpStatus.OK).send(topCurrencies);
});

const runCrawlers = catchAsync(async (req, res) => {
  const result = await crawlerService.runAllCrawlers();
  res.status(httpStatus.OK).send(result);
});

const crawlFromExchangeRateAPI = catchAsync(async (req, res) => {
  const result = await crawlerService.crawlFromExchangeRateAPI();
  res.status(httpStatus.OK).send(result);
});

const crawlFromFixerAPI = catchAsync(async (req, res) => {
  const result = await crawlerService.crawlFromFixerAPI();
  res.status(httpStatus.OK).send(result);
});

const crawlFromVietnameseBanks = catchAsync(async (req, res) => {
  const result = await crawlerService.crawlFromVietnameseBanks();
  res.status(httpStatus.OK).send(result);
});

const getExchangeRates = catchAsync(async (req, res) => {
  const result = await exchangeRateService.queryExchangeRates(req.query);
  res.status(httpStatus.OK).json(result);
});

const getExchangeRate = catchAsync(async (req, res) => {
  const exchangeRate = await exchangeRateService.getExchangeRateById(req.params.exchangeRateId);
  res.status(httpStatus.OK).json(exchangeRate);
});

const createExchangeRate = catchAsync(async (req, res) => {
  const exchangeRate = await exchangeRateService.createExchangeRate(req.body);
  res.status(httpStatus.CREATED).json(exchangeRate);
});

const updateExchangeRate = catchAsync(async (req, res) => {
  const exchangeRate = await exchangeRateService.updateExchangeRateById(req.params.exchangeRateId, req.body);
  res.status(httpStatus.OK).json(exchangeRate);
});

const deleteExchangeRate = catchAsync(async (req, res) => {
  await exchangeRateService.deleteExchangeRateById(req.params.exchangeRateId);
  res.status(httpStatus.NO_CONTENT).end();
});

// New endpoints for smart crawling
const crawlPriorityCurrencies = catchAsync(async (req, res) => {
  const results = await CrawlerService.crawlPriorityCurrencies();
  res.status(httpStatus.OK).json({
    message: `Successfully crawled ${results.length} priority currencies`,
    results,
  });
});

const crawlInBatches = catchAsync(async (req, res) => {
  const { baseCurrency = 'USD', batchSize = 10, delayMs = 1000 } = req.body;
  const results = await CrawlerService.crawlInBatches(baseCurrency, batchSize, delayMs);
  res.status(httpStatus.OK).json({
    message: `Successfully crawled ${results.length} exchange rates in batches`,
    results,
  });
});

const smartCrawl = catchAsync(async (req, res) => {
  const { baseCurrency = 'USD', maxAgeMinutes = 30 } = req.body;
  const results = await CrawlerService.smartCrawl(baseCurrency, maxAgeMinutes);
  res.status(httpStatus.OK).json({
    message: `Smart crawl completed. Updated ${results.length} exchange rates`,
    results,
  });
});

const crawlSingleRate = catchAsync(async (req, res) => {
  const { fromCurrency, toCurrency } = req.params;
  const result = await CrawlerService.crawlSingleRate(fromCurrency, toCurrency);
  res.status(httpStatus.OK).json({
    message: `Successfully crawled rate for ${fromCurrency} -> ${toCurrency}`,
    result,
  });
});

module.exports = {
  getLatestRate,
  getRateHistory,
  convertAmount,
  getRatesBySource,
  getAverageRate,
  getTopCurrencies,
  runCrawlers,
  crawlFromExchangeRateAPI,
  crawlFromFixerAPI,
  crawlFromVietnameseBanks,
  getExchangeRates,
  getExchangeRate,
  createExchangeRate,
  updateExchangeRate,
  deleteExchangeRate,
  crawlPriorityCurrencies,
  crawlInBatches,
  smartCrawl,
  crawlSingleRate,
};
