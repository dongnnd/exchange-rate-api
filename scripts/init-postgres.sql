-- Create database if not exists
SELECT 'CREATE DATABASE exchange_rate_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'exchange_rate_db')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE exchange_rate_db TO exchange_user;
GRANT CREATE ON SCHEMA public TO exchange_user;
GRANT USAGE ON SCHEMA public TO exchange_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO exchange_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO exchange_user;
