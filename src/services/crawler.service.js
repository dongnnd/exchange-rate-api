const axios = require('axios');
const logger = require('../config/logger');
const ExchangeRate = require('../models/exchangeRate.model');
const Currency = require('../models/currency.model');

/**
 * Crawl exchange rates from multiple sources
 */
class CrawlerService {
  /**
   * Upsert currency (insert if not exists, update if exists)
   */
  static async upsertCurrency({ code, name, symbol }) {
    return Currency.findOneAndUpdate(
      { code: code.toUpperCase() },
      { code: code.toUpperCase(), name, symbol, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  /**
   * Upsert exchange rate (insert if not exists, update if exists)
   */
  static async upsertExchangeRate({ fromCurrency, toCurrency, rate, source, timestamp }) {
    return ExchangeRate.findOneAndUpdate(
      {
        fromCurrency,
        toCurrency,
        source,
        timestamp,
      },
      {
        fromCurrency,
        toCurrency,
        rate,
        source,
        timestamp,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
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
          let currency = await Currency.findOne({ code: currencyCode });
          if (!currency) {
            currency = await Currency.create({
              code: currencyCode,
              name: currencyCode,
              symbol: currencyCode,
            });
          }

          // Get USD currency
          let usdCurrency = await Currency.findOne({ code: 'USD' });
          if (!usdCurrency) {
            usdCurrency = await Currency.create({
              code: 'USD',
              name: 'US Dollar',
              symbol: '$',
            });
          }

          // Save exchange rate
          const exchangeRate = await ExchangeRate.create({
            fromCurrency: usdCurrency._id,
            toCurrency: currency._id,
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
          let currency = await Currency.findOne({ code: currencyCode });
          if (!currency) {
            currency = await Currency.create({
              code: currencyCode,
              name: currencyCode,
              symbol: currencyCode,
            });
          }

          // Get EUR currency
          let eurCurrency = await Currency.findOne({ code: 'EUR' });
          if (!eurCurrency) {
            eurCurrency = await Currency.create({
              code: 'EUR',
              name: 'Euro',
              symbol: '€',
            });
          }

          // Save exchange rate
          const exchangeRate = await ExchangeRate.create({
            fromCurrency: eurCurrency._id,
            toCurrency: currency._id,
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
          let fromCurrency = await Currency.findOne({ code: rate.fromCurrency });
          if (!fromCurrency) {
            fromCurrency = await Currency.create({
              code: rate.fromCurrency,
              name: rate.fromCurrency,
              symbol: rate.fromCurrency,
            });
          }

          let toCurrency = await Currency.findOne({ code: rate.toCurrency });
          if (!toCurrency) {
            toCurrency = await Currency.create({
              code: rate.toCurrency,
              name: rate.toCurrency,
              symbol: rate.toCurrency,
            });
          }

          // Save exchange rate
          const exchangeRate = await ExchangeRate.create({
            fromCurrency: fromCurrency._id,
            toCurrency: toCurrency._id,
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
      const currencies = await Currency.find({
        isActive: true,
        code: { $ne: baseCurrency.toUpperCase() },
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
  static async crawlSingleRate(fromCurrencyCode, toCurrencyCode) {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrencyCode}`);
      // eslint-disable-next-line camelcase
      const { rates, time_last_updated } = response.data;
      // eslint-disable-next-line camelcase
      const timestamp = new Date(time_last_updated * 1000);

      if (!rates[toCurrencyCode]) {
        throw new Error(`Rate not found for ${toCurrencyCode}`);
      }

      const rate = rates[toCurrencyCode];

      // Ensure currencies exist
      let fromCurrency = await Currency.findOne({ code: fromCurrencyCode.toUpperCase() });
      if (!fromCurrency) {
        fromCurrency = await Currency.create({
          code: fromCurrencyCode.toUpperCase(),
          name: fromCurrencyCode.toUpperCase(),
          symbol: fromCurrencyCode.toUpperCase(),
        });
      }

      let toCurrency = await Currency.findOne({ code: toCurrencyCode.toUpperCase() });
      if (!toCurrency) {
        toCurrency = await Currency.create({
          code: toCurrencyCode.toUpperCase(),
          name: toCurrencyCode.toUpperCase(),
          symbol: toCurrencyCode.toUpperCase(),
        });
      }

      // Save exchange rate
      const exchangeRate = await ExchangeRate.create({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        rate,
        source: 'exchangerate-api',
        timestamp,
      });

      logger.info(`Crawled rate: ${fromCurrencyCode} -> ${toCurrencyCode} = ${rate}`);
      return exchangeRate;
    } catch (error) {
      logger.error(`Error crawling single rate ${fromCurrencyCode} -> ${toCurrencyCode}:`, error);
      throw error;
    }
  }

  /**
   * Smart crawl - only crawl rates that are older than specified time
   */
  static async smartCrawl(baseCurrency = 'USD', maxAgeMinutes = 30) {
    try {
      const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);

      // Get currencies that need updating
      const currenciesToUpdate = await Currency.aggregate([
        {
          $lookup: {
            from: 'exchangerates',
            localField: '_id',
            foreignField: 'toCurrency',
            as: 'latestRate',
          },
        },
        {
          $match: {
            isActive: true,
            code: { $ne: baseCurrency.toUpperCase() },
            $or: [{ latestRate: { $size: 0 } }, { 'latestRate.timestamp': { $lt: cutoffTime } }],
          },
        },
        { $limit: 20 }, // Limit to 20 currencies per run
      ]);

      if (currenciesToUpdate.length === 0) {
        logger.info('All exchange rates are up to date');
        return [];
      }

      logger.info(`Found ${currenciesToUpdate.length} currencies that need updating`);

      const results = await Promise.all(
        currenciesToUpdate.map(async (currency) => {
          try {
            return await this.crawlSingleRate(baseCurrency, currency.code);
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
  static async crawlPriorityCurrencies() {
    const priorityCurrencies = ['VND', 'EUR', 'JPY', 'GBP', 'CNY', 'KRW', 'SGD', 'THB'];
    const results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const currencyCode of priorityCurrencies) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.crawlSingleRate('USD', currencyCode);
        results.push(result);
        // Small delay between requests
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        logger.error(`Error crawling priority currency ${currencyCode}:`, error);
      }
    }

    return results;
  }
}

module.exports = new CrawlerService();
