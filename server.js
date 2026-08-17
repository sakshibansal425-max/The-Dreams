const express = require('express');
const path = require('path');
const session = require('express-session');
const env = require('./config/env');
const routes = require('./routes');
const { attachFeatureFlags } = require('./middleware/featureFlags');

const app = express();

// 1. View Engine Setup (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware for admin authentication
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set true if using HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Feature Flags Middleware (attaches to res.locals)
app.use(attachFeatureFlags);

// Global Variables for EJS Templates
app.use((req, res, next) => {
  res.locals.gaMeasurementId = env.gaMeasurementId;
  res.locals.adminUser = req.session.adminUser || null;
  res.locals.siteName = 'The Dreams';
  next();
});

// 3. Mount Routes
app.use('/', routes);

// 4. 404 Handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Page Not Found | The Dreams',
    message: 'The page you are looking for does not exist or has been moved.',
    currentPage: '404',
  });
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).render('error', {
    title: '500 - Server Error | The Dreams',
    message: 'An unexpected error occurred on our server.',
    error: env.nodeEnv === 'development' ? err : null,
    currentPage: 'error',
  });
});

// 6. Start Server
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 The Dreams Server running on http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔑 Admin Login: http://localhost:${PORT}/admin/login`);
  console.log(`=================================================`);
});

module.exports = app;
