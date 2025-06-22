const sequelize = require('../config/database');
// eslint-disable-next-line no-unused-vars, import/no-unresolved
const User = require('../models/sequelize/user.model');
// eslint-disable-next-line no-unused-vars, import/no-unresolved
const Currency = require('../models/sequelize/currency.model');
// eslint-disable-next-line no-unused-vars, import/no-unresolved
const ExchangeRate = require('../models/sequelize/exchangeRate.model');

const logger = require('../config/logger');

async function initPostgres() {
  try {
    logger.info('Initializing PostgreSQL database...');

    // Test connection
    await sequelize.authenticate();
    logger.info('PostgreSQL connection established successfully.');

    // Sync all models (create tables if they don't exist) - KHÔNG force để giữ dữ liệu
    await sequelize.sync({ force: true });
    logger.info('All tables created/verified successfully.');

    // Check if admin user exists
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      // Create default admin user only if doesn't exist
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        isEmailVerified: true,
      });
      logger.info('Created default admin user.');
    } else {
      logger.info('Admin user already exists.');
    }

    logger.info('PostgreSQL database initialization completed successfully!');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run initialization if called directly
if (require.main === module) {
  initPostgres();
}

module.exports = initPostgres;
