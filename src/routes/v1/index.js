const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const currencyRoute = require('./currency.route');
const exchangeRateRoute = require('./exchangeRate.route');
const cronRoute = require('./cron.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/currencies',
    route: currencyRoute,
  },
  {
    path: '/exchange-rates',
    route: exchangeRateRoute,
  },
  {
    path: '/cron',
    route: cronRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
