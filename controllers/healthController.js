const prisma = require('../config/db');

exports.checkHealth = async (req, res) => {
  try {
    // Ping SQLite database using raw query
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'ok',
      service: 'The Dreams API',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health Check Failed:', error);
    return res.status(500).json({
      status: 'error',
      service: 'The Dreams API',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
};
