const sequelize = require('../config/database');
const logger = require('../config/logger');

/**
 * Migration to update currencies table for multilingual support
 * Adds name_vi and name_en columns, removes the old name column
 */
async function up() {
  try {
    logger.info('Starting migration: Update currencies table for multilingual support...');

    // Add new columns
    await sequelize.query(`
      ALTER TABLE currencies 
      ADD COLUMN name_vi VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN name_en VARCHAR(255) NOT NULL DEFAULT ''
    `);

    // Remove the old name column
    await sequelize.query(`
      ALTER TABLE currencies DROP COLUMN name
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

    // Add back the old name column
    await sequelize.query(`
      ALTER TABLE currencies 
      ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT ''
    `);

    // Copy name_en back to name (or name_vi if preferred)
    await sequelize.query(`
      UPDATE currencies SET name = name_en
    `);

    // Remove the new columns
    await sequelize.query(`
      ALTER TABLE currencies 
      DROP COLUMN name_vi,
      DROP COLUMN name_en
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
    logger.info('Usage: node update_currency_multilingual.js [up|down]');
    process.exit(1);
  }
}

module.exports = { up, down };
