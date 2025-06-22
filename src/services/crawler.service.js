const axios = require('axios');
const { Op } = require('sequelize');
const logger = require('../config/logger');
const { Currency, ExchangeRate } = require('../models/sequelize');

// eslint-disable-next-line no-unused-vars
const usePostgres = process.env.USE_POSTGRES === 'true';

/**
 * Crawl exchange rates from multiple sources
 */
class CrawlerService {
  /**
   * Upsert currency (insert if not exists, update if exists)
   */
  static async upsertCurrency({ code, name, symbol }) {
    const [currency] = await Currency.findOrCreate({
      where: { code: code.toUpperCase() },
      defaults: { code: code.toUpperCase(), name, symbol, isActive: true },
    });
    return currency;
  }

  /**
   * Upsert exchange rate (insert if not exists, update if exists)
   */
  static async upsertExchangeRate({ fromCurrency, toCurrency, rate, source, timestamp }) {
    const [exchangeRate] = await ExchangeRate.findOrCreate({
      where: {
        fromCurrencyId: fromCurrency,
        toCurrencyId: toCurrency,
        source,
      },
      defaults: {
        fromCurrencyId: fromCurrency,
        toCurrencyId: toCurrency,
        rate,
        source,
        timestamp,
        isActive: true,
      },
    });
    return exchangeRate;
  }

  /**
   * Crawl from Exchange Rate API
   */
  // eslint-disable-next-line class-methods-use-this
  async crawlFromExchangeRateAPI() {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      // eslint-disable-next-line camelcase
      const { rates, time_last_updated } = response.data;
      // eslint-disable-next-line camelcase
      const timestamp = new Date(time_last_updated * 1000);

      const results = [];

      const rateEntries = Object.entries(rates);
      const processedRates = await Promise.all(
        rateEntries.map(async ([currencyCode, rate]) => {
          // Ensure currency exists in database
          let currency = await Currency.findOne({ where: { code: currencyCode } });
          if (!currency) {
            currency = await Currency.create({
              code: currencyCode,
              name: currencyCode,
              symbol: currencyCode,
            });
          }

          // Get USD currency
          let usdCurrency = await Currency.findOne({ where: { code: 'USD' } });
          if (!usdCurrency) {
            usdCurrency = await Currency.create({
              code: 'USD',
              name: 'US Dollar',
              symbol: '$',
            });
          }

          // Save exchange rate
          const exchangeRate = await ExchangeRate.create({
            fromCurrencyId: usdCurrency.id,
            toCurrencyId: currency.id,
            rate,
            source: 'exchangerate-api',
            timestamp,
          });

          return exchangeRate;
        })
      );

      results.push(...processedRates);

      logger.info(`Crawled ${results.length} exchange rates from Exchange Rate API`);
      return results;
    } catch (error) {
      logger.error('Error crawling from Exchange Rate API:', error);
      throw error;
    }
  }

  /**
   * Crawl from Fixer.io API
   */
  // eslint-disable-next-line class-methods-use-this
  async crawlFromFixerAPI() {
    // TODO: Implement Fixer API crawling
    return [];
  }

  /**
   * Crawl from Vietnamese banks (VND rates)
   */
  // eslint-disable-next-line class-methods-use-this
  async crawlFromVietnameseBanks() {
    try {
      // Note: Fixer.io requires API key for production
      const response = await axios.get('http://data.fixer.io/api/latest?access_key=YOUR_API_KEY&base=EUR');
      const { rates, timestamp: apiTimestamp } = response.data;
      const timestamp = new Date(apiTimestamp * 1000);

      const results = [];

      const rateEntries = Object.entries(rates);
      const processedRates = await Promise.all(
        rateEntries.map(async ([currencyCode, rate]) => {
          // Ensure currency exists
          let currency = await Currency.findOne({ where: { code: currencyCode } });
          if (!currency) {
            currency = await Currency.create({
              code: currencyCode,
              name: currencyCode,
              symbol: currencyCode,
            });
          }

          // Get EUR currency
          let eurCurrency = await Currency.findOne({ where: { code: 'EUR' } });
          if (!eurCurrency) {
            eurCurrency = await Currency.create({
              code: 'EUR',
              name: 'Euro',
              symbol: '€',
            });
          }

          // Save exchange rate
          const exchangeRate = await ExchangeRate.create({
            fromCurrencyId: eurCurrency.id,
            toCurrencyId: currency.id,
            rate,
            source: 'fixer-api',
            timestamp,
          });

          return exchangeRate;
        })
      );

      results.push(...processedRates);

      logger.info(`Crawled ${results.length} exchange rates from Fixer API`);
      return results;
    } catch (error) {
      logger.error('Error crawling from Fixer API:', error);
      throw error;
    }
  }

  /**
   * Crawl from Vietnamese banks (VND rates)
   */
  static async crawlFromVietcombank() {
    try {
      // Example: Crawl from Vietcombank
      const response = await axios.get('https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx');

      // Parse XML response and extract rates
      // This is a simplified example - you'll need to implement XML parsing
      const rates = this.parseVietcombankXML(response.data);

      const results = [];

      const processedRates = await Promise.all(
        rates.map(async (rate) => {
          // Ensure currencies exist
          let fromCurrency = await Currency.findOne({ where: { code: rate.fromCurrency } });
          if (!fromCurrency) {
            fromCurrency = await Currency.create({
              code: rate.fromCurrency,
              name: rate.fromCurrency,
              symbol: rate.fromCurrency,
            });
          }

          let toCurrency = await Currency.findOne({ where: { code: rate.toCurrency } });
          if (!toCurrency) {
            toCurrency = await Currency.create({
              code: rate.toCurrency,
              name: rate.toCurrency,
              symbol: rate.toCurrency,
            });
          }

          // Save exchange rate
          const exchangeRate = await ExchangeRate.create({
            fromCurrencyId: fromCurrency.id,
            toCurrencyId: toCurrency.id,
            rate: rate.rate,
            source: 'vietcombank',
            timestamp: new Date(),
          });

          return exchangeRate;
        })
      );

      results.push(...processedRates);

      logger.info(`Crawled ${results.length} exchange rates from Vietnamese banks`);
      return results;
    } catch (error) {
      logger.error('Error crawling from Vietnamese banks:', error);
      throw error;
    }
  }

  /**
   * Parse Vietcombank XML response
   */
  static parseVietcombankXML(xmlData) {
    try {
      // Simple XML parsing using regex (for basic structure)
      // For production, consider using a proper XML parser like xml2js
      const rates = [];
      // Extract DateTime
      const dateTimeMatch = xmlData.match(/<DateTime>(.*?)<\/DateTime>/);
      const timestamp = dateTimeMatch ? new Date(dateTimeMatch[1]) : new Date();
      // Extract all Exrate elements
      const exrateRegex =
        /<Exrate\s+CurrencyCode="([^"]+)"\s+CurrencyName="([^"]+)"\s+Buy="([^"]*)"\s+Transfer="([^"]*)"\s+Sell="([^"]*)"\s*\/>/g;
      let match;
      // eslint-disable-next-line no-cond-assign
      while ((match = exrateRegex.exec(xmlData)) !== null) {
        const [, currencyCode, currencyName, buy, transfer, sell] = match;
        rates.push({
          currencyCode: currencyCode.trim(),
          currencyName: currencyName.trim(),
          buy: buy.trim(),
          transfer: transfer.trim(),
          sell: sell.trim(),
          timestamp,
        });
      }
      logger.info(`Parsed ${rates.length} exchange rates from Vietcombank XML`);
      return rates;
    } catch (error) {
      logger.error('Error parsing Vietcombank XML:', error);
      throw error;
    }
  }

  /**
   * Run all crawlers
   */
  async runAllCrawlers() {
    try {
      logger.info('Starting all crawlers...');

      const results = await Promise.allSettled([
        this.crawlFromExchangeRateAPI(),
        // this.crawlFromFixerAPI(),
        // this.crawlFromVietnameseBanks(),
      ]);

      const successful = results.filter((result) => result.status === 'fulfilled');
      const failed = results.filter((result) => result.status === 'rejected');

      logger.info(`Crawling completed. Successful: ${successful.length}, Failed: ${failed.length}`);

      return {
        successful: successful.map((result) => result.value),
        failed: failed.map((result) => result.reason),
      };
    } catch (error) {
      logger.error('Error running crawlers:', error);
      throw error;
    }
  }

  /**
   * Crawl exchange rates in batches to avoid spam
   */
  static async crawlInBatches(baseCurrency = 'USD', batchSize = 10, delayMs = 1000) {
    try {
      // Get all active currencies except base currency
      const currencies = await Currency.findAll({
        where: {
          isActive: true,
          code: { $ne: baseCurrency.toUpperCase() },
        },
      });

      const batches = [];
      for (let i = 0; i < currencies.length; i += batchSize) {
        batches.push(currencies.slice(i, i + batchSize));
      }

      const results = [];
      for (let i = 0; i < batches.length; i += 1) {
        const batch = batches[i];
        logger.info(`Processing batch ${i + 1}/${batches.length} with ${batch.length} currencies`);
        // eslint-disable-next-line no-await-in-loop
        const batchResults = await Promise.all(
          batch.map(async (currency) => {
            try {
              return await this.crawlSingleRate(baseCurrency, currency.code);
            } catch (error) {
              logger.error(`Error crawling rate for ${currency.code}:`, error);
              return null;
            }
          })
        );

        results.push(...batchResults.filter((result) => result !== null));

        // Add delay between batches to avoid spam
        if (i < batches.length - 1) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }

      logger.info(`Completed crawling ${results.length} exchange rates in ${batches.length} batches`);
      return results;
    } catch (error) {
      logger.error('Error in batch crawling:', error);
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
          // Sử dụng bulkCreate với updateOnDuplicate để thực hiện upsert
          const result = await ExchangeRate.bulkCreate(exchangeRatesData, {
            updateOnDuplicate: ['rate', 'source', 'timestamp', 'isActive', 'updated_at'],
            fields: ['from_currency_id', 'to_currency_id', 'source', 'rate', 'timestamp', 'isActive'],
            // Chỉ định conflict fields dựa trên unique constraint
            conflictFields: ['from_currency_id', 'to_currency_id'],
          });

          logger.info(`Successfully bulk upserted ${result.length} exchange rates for ${baseCurrency.code}`);
          return result;
        } catch (error) {
          logger.error(`Error bulk upserting exchange rates for ${baseCurrency.code}:`, error);
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
   * Smart crawl - only crawl rates that are older than specified time
   */
  static async smartCrawl(baseCurrency = 'USD', maxAgeMinutes = 30) {
    try {
      const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);

      // Get currencies that need updating using Sequelize
      const currenciesToUpdate = await Currency.findAll({
        where: {
          isActive: true,
          code: { [Op.ne]: baseCurrency.toUpperCase() },
        },
        include: [
          {
            model: ExchangeRate,
            as: 'toRates',
            where: {
              timestamp: { [Op.lt]: cutoffTime },
            },
            required: false,
          },
        ],
        limit: 20, // Limit to 20 currencies per run
      });

      if (currenciesToUpdate.length === 0) {
        logger.info('All exchange rates are up to date');
        return [];
      }

      logger.info(`Found ${currenciesToUpdate.length} currencies that need updating`);

      const results = await Promise.all(
        currenciesToUpdate.map(async (currency) => {
          try {
            return await this.crawlSingleRate(currency);
          } catch (error) {
            logger.error(`Error updating rate for ${currency.code}:`, error);
            return null;
          }
        })
      );

      return results.filter((result) => result !== null);
    } catch (error) {
      logger.error('Error in smart crawl:', error);
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
