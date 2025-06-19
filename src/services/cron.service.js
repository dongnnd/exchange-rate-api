const cron = require('node-cron');
const logger = require('../config/logger');
const CrawlerService = require('./crawler.service');

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
  startPriorityCurrenciesJob() {
    const job = cron.schedule(
      '*/30 * * * *',
      async () => {
        try {
          logger.info('Starting priority currencies crawl job');
          const results = await CrawlerService.crawlPriorityCurrencies();
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
   * Start smart crawl job (every hour)
   */
  startSmartCrawlJob() {
    const job = cron.schedule(
      '0 * * * *',
      async () => {
        try {
          logger.info('Starting smart crawl job');
          const results = await CrawlerService.smartCrawl('USD', 60); // 60 minutes max age
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
   * Start full batch crawl job (every 6 hours)
   */
  startBatchCrawlJob() {
    const job = cron.schedule(
      '0 */6 * * *',
      async () => {
        try {
          logger.info('Starting batch crawl job');
          const results = await CrawlerService.crawlInBatches('USD', 5, 2000); // Smaller batches, longer delay
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
    logger.info('Starting all cron jobs');
    this.startPriorityCurrenciesJob();
    this.startSmartCrawlJob();
    this.startBatchCrawlJob();
    logger.info('All cron jobs started');
  }

  /**
   * Stop a specific job
   */
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      this.jobs.delete(jobName);
      logger.info(`Job ${jobName} stopped`);
    }
  }

  /**
   * Stop all jobs
   */
  stopAllJobs() {
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Job ${name} stopped`);
    });
    this.jobs.clear();
    logger.info('All cron jobs stopped');
  }

  /**
   * Get job status
   */
  getJobStatus() {
    const status = {};
    this.jobs.forEach((job, name) => {
      status[name] = {
        running: job.running,
        nextDate: job.nextDate(),
      };
    });
    return status;
  }

  /**
   * Manual trigger for priority currencies
   */
  // eslint-disable-next-line class-methods-use-this
  async triggerPriorityCurrencies() {
    try {
      logger.info('Manual trigger: Priority currencies crawl');
      const results = await CrawlerService.crawlPriorityCurrencies();
      logger.info(`Manual priority crawl completed: ${results.length} rates updated`);
      return results;
    } catch (error) {
      logger.error('Error in manual priority crawl:', error);
      throw error;
    }
  }

  /**
   * Manual trigger for smart crawl
   */
  // eslint-disable-next-line class-methods-use-this
  async triggerSmartCrawl(maxAgeMinutes = 30) {
    try {
      logger.info('Manual trigger: Smart crawl');
      const results = await CrawlerService.smartCrawl('USD', maxAgeMinutes);
      logger.info(`Manual smart crawl completed: ${results.length} rates updated`);
      return results;
    } catch (error) {
      logger.error('Error in manual smart crawl:', error);
      throw error;
    }
  }
}

module.exports = new CronService();
