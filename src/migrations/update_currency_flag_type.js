const sequelize = require('../config/database');
const logger = require('../config/logger');

/**
 * Migration to update currencies table flag field from VARCHAR(255) to TEXT
 */
async function up() {
  try {
    logger.info('Starting migration: Update currencies table flag field to TEXT...');

    // Change flag column type from VARCHAR(255) to TEXT
    await sequelize.query(`
      ALTER TABLE currencies 
      ALTER COLUMN flag TYPE TEXT
    `);

    logger.info('Migration completed successfully!');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback migration
 */
async function down() {
  try {
    logger.info('Rolling back migration...');

    // Change flag column type back to VARCHAR(255)
    await sequelize.query(`
      ALTER TABLE currencies 
      ALTER COLUMN flag TYPE VARCHAR(255)
    `);

    logger.info('Rollback completed successfully!');
  } catch (error) {
    logger.error('Rollback failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'up') {
    up()
      .then(() => {
        logger.info('Migration up completed');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Migration up failed:', error);
        process.exit(1);
      });
  } else if (command === 'down') {
    down()
      .then(() => {
        logger.info('Migration down completed');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Migration down failed:', error);
        process.exit(1);
      });
  } else {
    logger.info('Usage: node update_currency_flag_type.js [up|down]');
    process.exit(1);
  }
}

module.exports = { up, down };
