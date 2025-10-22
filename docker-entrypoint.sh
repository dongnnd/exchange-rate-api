#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
# Wait for postgres to be ready
until node -e "
const sequelize = require('./src/config/database');
sequelize.authenticate()
  .then(() => { console.log('Database connected'); process.exit(0); })
  .catch(() => { console.log('Database not ready'); process.exit(1); });
" 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Only run init if AUTO_INIT environment variable is set to true
if [ "$AUTO_INIT" = "true" ]; then
  echo "AUTO_INIT is enabled. Checking database status..."

  # Check if currencies table exists and has data
  CURRENCIES_COUNT=$(NODE_ENV=test node -e "
    const { Sequelize } = require('sequelize');
    const config = require('./src/config/config');

    const sequelize = new Sequelize(config.postgres.url, {
      logging: false
    });

    (async () => {
      try {
        await sequelize.authenticate();
        const [results] = await sequelize.query('SELECT COUNT(*) as count FROM currencies', {
          type: Sequelize.QueryTypes.SELECT
        });
        console.log(results.count || 0);
        process.exit(0);
      } catch (error) {
        console.log(0);
        process.exit(0);
      }
    })();
  " 2>/dev/null || echo "0")

  echo "Found $CURRENCIES_COUNT currencies in database"

  if [ "$CURRENCIES_COUNT" -eq "0" ]; then
    echo "Database is empty. Initializing..."
    node src/scripts/init-postgres.js

    echo "Seeding currencies..."
    node src/scripts/seed-currencies.js

    echo "Database initialization completed!"
  else
    echo "Database already initialized. Skipping..."
  fi
else
  echo "AUTO_INIT is disabled. Skipping database initialization."
  echo "To enable auto-init, set AUTO_INIT=true in environment variables."
fi

echo "Starting application..."
exec "$@"
