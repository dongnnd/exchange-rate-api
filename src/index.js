const sequelize = require('./config/database');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const cronService = require('./services/cron.service');

let server;

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connected to PostgreSQL');
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
      if (config.env !== 'test') {
        cronService.startAllJobs();
        logger.info(`Cron jobs started in ${config.env} mode`);
      }
    });
  })
  .catch((err) => {
    logger.error('Unable to connect to PostgreSQL:', err);
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
