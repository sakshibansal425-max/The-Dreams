const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const servicesController = require('../controllers/servicesController');
const examController = require('../controllers/examController');
const prepLevelController = require('../controllers/prepLevelController');
const contactController = require('../controllers/contactController');

// Home
router.get('/', homeController.renderHome);

// About Us & About Me
router.get('/about', aboutController.renderAbout);
router.get('/about-me', aboutController.renderAboutMe);

// Services
router.get('/services', servicesController.renderServices);

// Exams Directory & Detail
router.get('/exams', examController.renderExamDirectory);
router.get('/exams/:code', examController.renderExamDetail);

// Preparation Levels
router.get('/prep-levels', prepLevelController.renderPrepLevels);

// Contact
router.get('/contact', contactController.renderContact);
router.post('/contact', contactController.submitContactForm);

module.exports = router;
