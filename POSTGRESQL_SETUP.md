# PostgreSQL Setup Guide

## Prerequisites

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE exchange_rates_db;
   
   # Create user (optional)
   CREATE USER exchange_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE exchange_rates_db TO exchange_user;
   ```

## Environment Configuration

Add to your `.env` file:

```env
# PostgreSQL Configuration
POSTGRES_URL=postgresql://postgres:password@localhost:5432/exchange_rates_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=exchange_rates_db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=password

# Switch to PostgreSQL (set to 'true' to use PostgreSQL)
USE_POSTGRES=false
```

## Database Initialization

1. **Initialize PostgreSQL database:**
   ```bash
   npm run init:postgres
   ```

2. **Migrate data from MongoDB (optional):**
   ```bash
   npm run migrate:to-postgres
   ```

## Switching Between Databases

### Use MongoDB (default)
```env
USE_POSTGRES=false
```

### Use PostgreSQL
```env
USE_POSTGRES=true
```

## Database Models

### Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: 'user', 'admin')
- `isEmailVerified` (Boolean)
- `isActive` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Currencies Table
- `id` (Primary Key)
- `code` (String(3), Unique)
- `name` (String)
- `symbol` (String(5))
- `isActive` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Exchange Rates Table
- `id` (Primary Key)
- `fromCurrencyId` (Foreign Key to currencies.id)
- `toCurrencyId` (Foreign Key to currencies.id)
- `rate` (Decimal(20,8))
- `source` (String)
- `timestamp` (Date)
- `isActive` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Indexes

- **Unique Index**: `(fromCurrencyId, toCurrencyId)` - Ensures no duplicate currency pairs
- **Performance Index**: `(fromCurrencyId, toCurrencyId, timestamp)` - Optimizes queries
- **Source Index**: `(source, timestamp)` - Optimizes source-based queries

## Benefits of PostgreSQL

1. **ACID Compliance**: Full transaction support
2. **Complex Queries**: Advanced SQL features
3. **Data Integrity**: Foreign key constraints
4. **Performance**: Optimized indexes
5. **Scalability**: Better for complex relationships

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql -h localhost -U postgres -d exchange_rates_db
```

### Permission Issues
```bash
# Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### Reset Database
```bash
# Drop and recreate
DROP DATABASE exchange_rates_db;
CREATE DATABASE exchange_rates_db;
npm run init:postgres
``` 