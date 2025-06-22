const exchangeRateService = require('./postgres/exchangeRate.service');

class DatabaseAdapter {
  static async getLatestRate(fromCurrency, toCurrency) {
    return exchangeRateService.getLatestRate(fromCurrency, toCurrency);
  }

  static async getRateHistory(fromCurrency, toCurrency, limit) {
    return exchangeRateService.getRateHistory(fromCurrency, toCurrency, limit);
  }

  static async convertAmount(fromCurrency, toCurrency, amount) {
    return exchangeRateService.convertAmount(fromCurrency, toCurrency, amount);
  }

  static async createExchangeRate(exchangeRateBody) {
    return exchangeRateService.createExchangeRate(exchangeRateBody);
  }

  static async updateExchangeRateById(exchangeRateId, updateBody) {
    return exchangeRateService.updateExchangeRateById(exchangeRateId, updateBody);
  }

  static async deleteExchangeRateById(exchangeRateId) {
    return exchangeRateService.deleteExchangeRateById(exchangeRateId);
  }

  static async queryExchangeRates(filter, options) {
    return exchangeRateService.queryExchangeRates(filter, options);
  }
}

module.exports = DatabaseAdapter;
