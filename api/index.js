// Vercel Serverless Function Entry Point for The Dreams
const path = require('path');
require('dotenv').config();

// Ensure DATABASE_URL is set before any controller or Prisma model loads
if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

const app = require('../server');

module.exports = app;
