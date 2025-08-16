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
   * Start priority currencies crawl job (every 30 minutes)
   */
  async startPriorityCurrenciesJob() {
    await crawlerService.crawlAllCurrencies();
    // const job = cron.schedule(
    //   '*/30 * * * *',
    //   async () => {
    //     try {
    //       logger.info('Starting priority currencies crawl job');
    //       const results = await crawlerService.crawlAllCurrencies();
    //       logger.info(`Priority currencies crawl completed: ${results.length} rates updated`);
    //     } catch (error) {
    //       logger.error('Error in priority currencies crawl job:', error);
    //     }
    //   },
    //   {
    //     scheduled: false,
    //   }
    // );

    // this.jobs.set('priorityCurrencies', job);
    // job.start();
    // logger.info('Priority currencies crawl job started');
  }

  /**
   * Start smart crawl job (every hour)
   */
  async startSmartCrawlJob() {
    const job = cron.schedule(
      '0 * * * *',
      async () => {
        try {
          logger.info('Starting smart crawl job');
          const results = await crawlerService.triggerSmartCrawl(30);
          logger.info(`Smart crawl completed: ${results.length} rates updated`);
        } catch (error) {
          logger.error('Error in smart crawl job:', error);
        }
      },
      {
        scheduled: false,
      }
    );

    this.jobs.set('smartCrawl', job);
    job.start();
    logger.info('Smart crawl job started');
  }

  /**
   * Start batch crawl job (every 6 hours)
   */
  async startBatchCrawlJob() {
    const job = cron.schedule(
      '0 */6 * * *',
      async () => {
        try {
          logger.info('Starting batch crawl job');
          const results = await crawlerService.crawlBatches();
          logger.info(`Batch crawl completed: ${results.length} rates updated`);
        } catch (error) {
          logger.error('Error in batch crawl job:', error);
        }
      },
      {
        scheduled: false,
      }
    );

    this.jobs.set('batchCrawl', job);
    job.start();
    logger.info('Batch crawl job started');
  }

  /**
   * Start all cron jobs
   */
  startAllJobs() {
    try {
      logger.info('Starting all cron jobs...');
      this.startPriorityCurrenciesJob();
      logger.info('All cron jobs started successfully');
    } catch (error) {
      logger.error('Error starting cron jobs:', error);
      throw error;
    }
  }

  /**
   * Stop all cron jobs
   */
  stopAllJobs() {
    try {
      logger.info('Stopping all cron jobs...');
      this.jobs.forEach((job, name) => {
        job.stop();
        logger.info(`Stopped job: ${name}`);
      });
      this.jobs.clear();
      logger.info('All cron jobs stopped successfully');
    } catch (error) {
      logger.error('Error stopping cron jobs:', error);
      throw error;
    }
  }

  /**
   * Stop specific job
   */
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      this.jobs.delete(jobName);
      logger.info(`Stopped job: ${jobName}`);
    } else {
      logger.warn(`Job not found: ${jobName}`);
    }
  }

  /**
   * Get job status
   */
  getJobStatus() {
    const status = {};
    this.jobs.forEach((job, name) => {
      status[name] = {
        running: job.running,
        scheduled: job.scheduled,
      };
    });
    return status;
  }

  // Legacy function for backward compatibility
  // eslint-disable-next-line class-methods-use-this
  async crawlAllCurrencies() {
    const results = await crawlerService.crawlAllCurrencies();
    logger.info(`Priority currencies crawl completed: ${results.length} rates updated`);
    return results;
  }
}

module.exports = new CronService();
