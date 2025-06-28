const express = require('express');
const currencyController = require('../../controllers/currency.controller');

const router = express.Router();

router.get('/', currencyController.getCurrencies);

module.exports = router;
