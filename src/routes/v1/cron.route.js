const express = require('express');
const auth = require('../../middlewares/auth');
const cronController = require('../../controllers/cron.controller');

const router = express.Router();

// Simple ping endpoint for cron-job.org testing
router.route('/ping').get((req, res) => {
  res.status(200).json({
    message: 'Ping successful',
    timestamp: new Date().toISOString(),
    status: 'OK',
  });
});

// Start cron jobs endpoint (no auth required)
router.route('/start-cron').get(cronController.startCronJobs);

module.exports = router;
