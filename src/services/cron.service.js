const cron = require('node-cron');
const logger = require('../config/logger');
const crawlerService = require('./crawler.service');

/**
 * Cron Service for automated exchange rate crawling
 */
class CronService {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Start priority currencies crawl job (every 5 minutes)
   */
  startAllCurrenciesJob() {
    const job = cron.schedule(
      '*/30 * * * *',
      async () => {
        try {
          logger.info('Starting priority currencies crawl job');
          const results = await crawlerService.crawlAllCurrencies();
          logger.info(`Priority currencies crawl completed: ${results.length} rates updated`);
        } catch (error) {
          logger.error('Error in priority currencies crawl job:', error);
        }
      },
      {
        scheduled: false,
      }
    );

    this.jobs.set('priorityCurrencies', job);
    job.start();
    logger.info('Priority currencies crawl job started');
  }

  /**
   * Start all cron jobs
   */
  // eslint-disable-next-line class-methods-use-this
  startAllJobs() {
    try {
      logger.info('Starting all cron jobs...');
      this.startAllCurrenciesJob();
      logger.info('All cron jobs started successfully');
    } catch (error) {
      logger.error('Error starting cron jobs:', error);
      throw error;
    }
  }
}

module.exports = new CronService();
