require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  sessionSecret: process.env.SESSION_SECRET || 'thedreams_fallback_secret_key',
  gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
  adminEmail: process.env.ADMIN_EMAIL || 'sakshibansal425@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin_password_123',
};
