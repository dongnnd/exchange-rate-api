const axios = require('axios');
const logger = require('../config/logger');
const { Currency, ExchangeRate } = require('../models/sequelize');

/**
 * Crawl exchange rates from multiple sources
 */
class CrawlerService {
  /**
   * Bulk upsert exchange rates efficiently
   */
  static async bulkUpsertExchangeRates(exchangeRatesData) {
    try {
      const results = await Promise.all(
        exchangeRatesData.map(async (data) => {
          try {
            const [exchangeRate, created] = await ExchangeRate.upsert(data, {
              fields: ['from_currency_id', 'to_currency_id', 'source', 'rate', 'timestamp', 'isActive'],
              returning: true,
            });
            return { exchangeRate, created };
          } catch (error) {
            logger.error(`Error upserting exchange rate for ${data.from_currency_id} -> ${data.to_currency_id}:`, error);
            return null;
          }
        })
      );

      return results.filter((result) => result !== null);
    } catch (error) {
      logger.error('Error in bulk upsert:', error);
      throw error;
    }
  }

  /**
   * Crawl single exchange rate
   */
  static async crawlSingleRate(baseCurrency) {
    try {
      const response = await axios.get(`https://api.exchangerate.fun/latest?base=${baseCurrency.code.toUpperCase()}`);
      const { rates, timestamp } = response.data;
      const timesUpdate = new Date(timestamp * 1000);

      if (!rates || Object.keys(rates).length === 0) {
        logger.error(`No rates found for ${baseCurrency.code}`);
        return null;
      }

      // Tạo mảng data để insert đồng loạt
      const exchangeRatesData = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const [currencyCode, rateValue] of Object.entries(rates)) {
        // eslint-disable-next-line no-await-in-loop
        const toCurrency = await Currency.findOne({ where: { code: currencyCode.toUpperCase() } });
        if (!toCurrency) {
          logger.warn(`Currency not found: ${currencyCode}`);
          // eslint-disable-next-line no-continue
          continue;
        }

        exchangeRatesData.push({
          from_currency_id: baseCurrency.id,
          to_currency_id: toCurrency.id,
          source: 'exchangerate-api',
          rate: rateValue,
          timestamp: timesUpdate,
          isActive: true,
        });
      }

      // Insert đồng loạt tất cả data
      if (exchangeRatesData.length > 0) {
        try {
          // Sử dụng method bulkUpsertExchangeRates để xử lý upsert hiệu quả
          const results = await this.bulkUpsertExchangeRates(exchangeRatesData);

          logger.info(`Successfully upserted ${results.length} exchange rates for ${baseCurrency.code}`);
          return results;
        } catch (error) {
          logger.error(`Error upserting exchange rates for ${baseCurrency.code}:`, error);
          throw error;
        }
      } else {
        logger.warn(`No valid exchange rates to insert for ${baseCurrency.code}`);
        return [];
      }
    } catch (error) {
      logger.error(`Error crawling single rate ${baseCurrency.code}:`, error);
      throw error;
    }
  }

  /**
   * Crawl priority currencies first (most commonly used)
   */
  static async crawlAllCurrencies() {
    const priorityCurrencies = await Currency.findAll({
      where: {
        isActive: true,
      },
    });
    const results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const currency of priorityCurrencies) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.crawlSingleRate(currency);
        results.push(result);
        // Small delay between requests
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        logger.error(`Error crawling priority currency ${currency.code}:`, error);
      }
    }

    logger.info(`Crawled ${results.length} priority currencies`);

    return results;
  }
}

module.exports = CrawlerService;
