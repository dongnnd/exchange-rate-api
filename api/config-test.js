module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test config loading
    const config = require('../src/config/config');

    res.status(200).json({
      message: 'Config loaded successfully!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      config: {
        env: config.env,
        postgresUrl: config.postgres.url ? 'Set' : 'Not set',
        jwtSecret: config.jwt.secret ? 'Set' : 'Not set',
      },
      envVars: {
        NODE_ENV: process.env.NODE_ENV || 'Not set',
        POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Config loading failed!',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      envVars: {
        NODE_ENV: process.env.NODE_ENV || 'Not set',
        POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      },
    });
  }
};
