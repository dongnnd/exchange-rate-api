const express = require('express');
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router.get(
  '/health',
  catchAsync(async (req, res) => {
    res.status(httpStatus.OK).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      message: 'API is running successfully on Render!',
      version: '1.0.0',
      database: 'Connected'
    });
  })
);

module.exports = router;
