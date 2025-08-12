const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const cronService = require('../services/cron.service');

const startAllJobs = catchAsync(async (req, res) => {
  cronService.startAllJobs();
  res.status(httpStatus.OK).json({
    message: 'All cron jobs started successfully',
    status: cronService.getJobStatus(),
  });
});

const stopAllJobs = catchAsync(async (req, res) => {
  cronService.stopAllJobs();
  res.status(httpStatus.OK).json({
    message: 'All cron jobs stopped successfully',
  });
});

const getJobStatus = catchAsync(async (req, res) => {
  const status = cronService.getJobStatus();
  res.status(httpStatus.OK).json({
    status,
  });
});

const triggerPriorityCurrencies = catchAsync(async (req, res) => {
  const results = await cronService.triggerPriorityCurrencies();
  res.status(httpStatus.OK).json({
    message: 'Priority currencies crawl triggered successfully',
    results,
  });
});

const triggerSmartCrawl = catchAsync(async (req, res) => {
  const { maxAgeMinutes = 30 } = req.body;
  const results = await cronService.triggerSmartCrawl(maxAgeMinutes);
  res.status(httpStatus.OK).json({
    message: 'Smart crawl triggered successfully',
    results,
  });
});

const triggerAllJobs = catchAsync(async (req, res) => {
  try {
    // Trigger priority currencies crawl
    const priorityResults = await cronService.triggerPriorityCurrencies();
    
    // Trigger smart crawl
    const smartResults = await cronService.triggerSmartCrawl(30);
    
    res.status(httpStatus.OK).json({
      message: 'All cron jobs triggered successfully',
      timestamp: new Date().toISOString(),
      priority: priorityResults,
      smart: smartResults,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to trigger cron jobs',
      error: error.message,
    });
  }
});

const startSpecificJob = catchAsync(async (req, res) => {
  const { jobName } = req.params;

  switch (jobName) {
    case 'priorityCurrencies':
      cronService.startPriorityCurrenciesJob();
      break;
    case 'smartCrawl':
      cronService.startSmartCrawlJob();
      break;
    case 'batchCrawl':
      cronService.startBatchCrawlJob();
      break;
    default:
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Invalid job name',
      });
  }

  res.status(httpStatus.OK).json({
    message: `Job ${jobName} started successfully`,
    status: cronService.getJobStatus(),
  });
});

const stopSpecificJob = catchAsync(async (req, res) => {
  const { jobName } = req.params;
  cronService.stopJob(jobName);

  res.status(httpStatus.OK).json({
    message: `Job ${jobName} stopped successfully`,
    status: cronService.getJobStatus(),
  });
});

module.exports = {
  startAllJobs,
  stopAllJobs,
  getJobStatus,
  triggerPriorityCurrencies,
  triggerSmartCrawl,
  triggerAllJobs,
  startSpecificJob,
  stopSpecificJob,
};
