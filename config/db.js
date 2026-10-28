const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Fallback to SQLite DB file if DATABASE_URL environment variable is not explicitly set in Vercel
if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;
