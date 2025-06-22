const sequelize = require('../config/database');
const { User } = require('../models/sequelize');
const logger = require('../config/logger');

async function resetPostgres() {
  try {
    logger.log('⚠️  WARNING: This will DELETE ALL DATA!');
    logger.log('Resetting PostgreSQL database...');

    // Test connection
    await sequelize.authenticate();
    logger.log('PostgreSQL connection established successfully.');

    // Drop all tables (WARNING: This deletes all data!)
    await sequelize.getQueryInterface().dropAllTables();
    logger.log('Dropped all existing tables and data.');

    // Sync all models (create tables)
    await sequelize.sync();
    logger.log('All tables created successfully.');

    // Create default admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isEmailVerified: true,
    });
    logger.log('Created default admin user.');

    logger.log('✅ PostgreSQL database reset completed successfully!');
  } catch (error) {
    logger.error('Database reset failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run reset if called directly
if (require.main === module) {
  resetPostgres();
}

module.exports = resetPostgres;
