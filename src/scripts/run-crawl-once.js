const sequelize = require('../config/database');
const logger = require('../config/logger');
const CrawlerService = require('../services/crawler.service');

(async () => {
    try {
        logger.info('Connecting to PostgreSQL...');
        await sequelize.authenticate();
        logger.info('Connected. Starting one-off crawl for all currencies...');

        const results = await CrawlerService.crawlAllCurrencies();
        logger.info(`One-off crawl completed. Batches: ${results.length}`);
    } catch (error) {
        logger.error('One-off crawl failed:', error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
        logger.info('Database connection closed.');
    }
})();
