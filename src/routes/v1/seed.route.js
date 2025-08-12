const express = require('express');
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const seedCurrencies = require('../../scripts/seed-currencies');
const initPostgres = require('../../scripts/init-postgres');

const router = express.Router();

// Initialize database tables
router.post(
    '/init-db',
    catchAsync(async (req, res) => {
        try {
            await initPostgres();
            res.status(httpStatus.OK).json({
                status_code: httpStatus.OK,
                message: 'Database initialized successfully',
                data: {
                    message: 'All tables have been created',
                },
            });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status_code: httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to initialize database',
                error: error.message,
            });
        }
    })
);

// Seed currencies
router.post(
    '/currencies',
    catchAsync(async (req, res) => {
        try {
            await seedCurrencies();
            res.status(httpStatus.OK).json({
                status_code: httpStatus.OK,
                message: 'Currencies seeded successfully',
                data: {
                    message: 'All currencies have been added to the database',
                },
            });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status_code: httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to seed currencies',
                error: error.message,
            });
        }
    })
);

module.exports = router;
