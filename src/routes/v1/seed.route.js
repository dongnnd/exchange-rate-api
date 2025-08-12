const express = require('express');
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const seedCurrencies = require('../../scripts/seed-currencies');

const router = express.Router();

router.post(
  '/currencies',
  catchAsync(async (req, res) => {
    try {
      await seedCurrencies();
      res.status(httpStatus.OK).json({
        status_code: httpStatus.OK,
        message: 'Currencies seeded successfully',
        data: {
          message: 'All currencies have been added to the database'
        }
      });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to seed currencies',
        error: error.message
      });
    }
  })
);

module.exports = router;
