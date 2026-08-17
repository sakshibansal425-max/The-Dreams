const express = require('express');
const router = express.Router();

const publicRoutes = require('./publicRoutes');
const apiRoutes = require('./apiRoutes');
const adminRoutes = require('./adminRoutes');
const healthRoutes = require('./health');

// Health Check Endpoint
router.use('/health', healthRoutes);

// API Endpoints
router.use('/api', apiRoutes);

// Admin Module Routes
router.use('/admin', adminRoutes);

// Main Public Web Pages
router.use('/', publicRoutes);

module.exports = router;
