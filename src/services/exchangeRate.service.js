const ExchangeRate = require('../models/exchangeRate.model');
const Currency = require('../models/currency.model');
const logger = require('../config/logger');

/**
 * Exchange Rate Service
 */
class ExchangeRateService {
  /**
   * Get latest exchange rate between two currencies
   */
  static async getLatestRate(fromCurrencyCode, toCurrencyCode) {
    try {
      const fromCurrency = await Currency.findOne({ code: fromCurrencyCode.toUpperCase() });
      const toCurrency = await Currency.findOne({ code: toCurrencyCode.toUpperCase() });

      if (!fromCurrency || !toCurrency) {
        throw new Error('Currency not found');
      }

      const exchangeRate = await ExchangeRate.findOne({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        isActive: true,
      })
        .sort({ timestamp: -1 })
        .populate('fromCurrency')
        .populate('toCurrency');

      if (!exchangeRate) {
        throw new Error('Exchange rate not found');
      }

      return exchangeRate;
    } catch (error) {
      logger.error('Error getting latest exchange rate:', error);
      throw error;
    }
  }

  /**
   * Get exchange rate history
   */
  static async getRateHistory(fromCurrencyCode, toCurrencyCode, limit = 100) {
    try {
      const fromCurrency = await Currency.findOne({ code: fromCurrencyCode.toUpperCase() });
      const toCurrency = await Currency.findOne({ code: toCurrencyCode.toUpperCase() });

      if (!fromCurrency || !toCurrency) {
        throw new Error('Currency not found');
      }

      const exchangeRates = await ExchangeRate.find({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        isActive: true,
      })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('fromCurrency')
        .populate('toCurrency');

      return exchangeRates;
    } catch (error) {
      logger.error('Error getting exchange rate history:', error);
      throw error;
    }
  }

  /**
   * Convert amount between currencies
   */
  static async convertAmount(fromCurrencyCode, toCurrencyCode, amount) {
    try {
      const exchangeRate = await this.getLatestRate(fromCurrencyCode, toCurrencyCode);
      const convertedAmount = amount * exchangeRate.rate;
      return {
        fromCurrency: exchangeRate.fromCurrency,
        toCurrency: exchangeRate.toCurrency,
        originalAmount: amount,
        convertedAmount,
        rate: exchangeRate.rate,
        timestamp: exchangeRate.timestamp,
        source: exchangeRate.source,
      };
    } catch (error) {
      logger.error('Error converting amount:', error);
      throw error;
    }
  }

  /**
   * Get all available currencies
   */
  static async getAllCurrencies() {
    try {
      const currencies = await Currency.find({ isActive: true }).sort({ code: 1 });
      return currencies;
    } catch (error) {
      logger.error('Error getting all currencies:', error);
      throw error;
    }
  }

  /**
   * Get exchange rates by source
   */
  static async getRatesBySource(source, limit = 50) {
    try {
      const exchangeRates = await ExchangeRate.find({
        source,
        isActive: true,
      })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('fromCurrency')
        .populate('toCurrency');

      return exchangeRates;
    } catch (error) {
      logger.error('Error getting rates by source:', error);
      throw error;
    }
  }

  /**
   * Get average rate for a time period
   */
  static async getAverageRate(fromCurrencyCode, toCurrencyCode, startDate, endDate) {
    try {
      const fromCurrency = await Currency.findOne({ code: fromCurrencyCode.toUpperCase() });
      const toCurrency = await Currency.findOne({ code: toCurrencyCode.toUpperCase() });

      if (!fromCurrency || !toCurrency) {
        throw new Error('Currency not found');
      }

      const rates = await ExchangeRate.find({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        isActive: true,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      if (rates.length === 0) {
        throw new Error('No rates found for the specified period');
      }

      const totalRate = rates.reduce((sum, rate) => sum + rate.rate, 0);
      const averageRate = totalRate / rates.length;

      return {
        fromCurrency,
        toCurrency,
        averageRate,
        totalRates: rates.length,
        startDate,
        endDate,
      };
    } catch (error) {
      logger.error('Error getting average rate:', error);
      throw error;
    }
  }

  /**
   * Get top currencies by volume (most frequently converted)
   */
  static async getTopCurrencies(limit = 10) {
    try {
      const topCurrencies = await ExchangeRate.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$toCurrency',
            count: { $sum: 1 },
            latestRate: { $first: '$rate' },
            latestTimestamp: { $first: '$timestamp' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]);

      // Populate currency details
      const populatedResults = await ExchangeRate.populate(topCurrencies, [{ path: '_id', model: 'Currency' }]);

      return populatedResults;
    } catch (error) {
      logger.error('Error getting top currencies:', error);
      throw error;
    }
  }
}

module.exports = ExchangeRateService;
