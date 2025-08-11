const app = require('../src/app');

module.exports = async (req, res) => {
  try {
    // Add CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Test route
    if (req.url === '/api/test-main') {
      return res.status(200).json({
        message: 'Main API handler is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        url: req.url
      });
    }
    
    // Call the Express app
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
