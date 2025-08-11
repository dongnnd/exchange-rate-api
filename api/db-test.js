const sequelize = require('../src/config/database');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test database connection
    await sequelize.authenticate();
    
    // Test a simple query
    const result = await sequelize.query('SELECT COUNT(*) as count FROM currencies');
    
    res.status(200).json({
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      currencyCount: result[0][0].count,
      postgresUrl: process.env.POSTGRES_URL ? 'Set' : 'Not set'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed!',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      postgresUrl: process.env.POSTGRES_URL ? 'Set' : 'Not set'
    });
  }
};
