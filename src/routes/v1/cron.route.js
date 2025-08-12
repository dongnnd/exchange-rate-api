const express = require('express');
const auth = require('../../middlewares/auth');
const cronController = require('../../controllers/cron.controller');

const router = express.Router();

// External cron service endpoint (no auth required) - ĐẶT TRƯỚC middleware auth
router.route('/trigger').get(cronController.triggerAllJobs);

// All other routes require authentication
router.use(auth('manageExchangeRates'));

// Cron job management
router.route('/start-all').post(cronController.startAllJobs);

router.route('/stop-all').post(cronController.stopAllJobs);

router.route('/status').get(cronController.getJobStatus);

// Manual triggers
router.route('/trigger/priority').post(cronController.triggerPriorityCurrencies);

router.route('/trigger/smart').post(cronController.triggerSmartCrawl);

// Specific job control
router.route('/start/:jobName').post(cronController.startSpecificJob);

router.route('/stop/:jobName').post(cronController.stopSpecificJob);

module.exports = router;
