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
  async startAllCurrenciesJob() {
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

  /**
   * Trigger priority currencies crawl manually
   */
  async triggerPriorityCurrencies() {
    try {
      logger.info('Triggering priority currencies crawl manually');
      const results = await crawlerService.crawlAllCurrencies();
      logger.info(`Priority currencies crawl completed: ${results.length} rates updated`);
      return results;
    } catch (error) {
      logger.error('Error in priority currencies crawl:', error);
      throw error;
    }
  }

  /**
   * Trigger smart crawl manually
   */
  async triggerSmartCrawl(maxAgeMinutes = 30) {
    try {
      logger.info(`Triggering smart crawl with maxAgeMinutes: ${maxAgeMinutes}`);
      const results = await crawlerService.crawlAllCurrencies();
      logger.info(`Smart crawl completed: ${results.length} rates updated`);
      return results;
    } catch (error) {
      logger.error('Error in smart crawl:', error);
      throw error;
    }
  }

  /**
   * Get job status
   */
  getJobStatus() {
    const status = {};
    for (const [jobName, job] of this.jobs) {
      status[jobName] = {
        running: job.running,
        nextDate: job.nextDate(),
      };
    }
    return status;
  }

  /**
   * Stop specific job
   */
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      logger.info(`Job ${jobName} stopped`);
    }
  }

  /**
   * Stop all jobs
   */
  stopAllJobs() {
    for (const [jobName, job] of this.jobs) {
      job.stop();
      logger.info(`Job ${jobName} stopped`);
    }
  }
}

module.exports = new CronService();
