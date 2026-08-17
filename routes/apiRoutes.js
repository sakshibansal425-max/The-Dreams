const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');
const chatbotController = require('../controllers/chatbotController');

// Contact API
router.post('/contact', contactController.submitContactForm);

// Chatbot API
router.post('/chatbot', chatbotController.queryChatbot);

module.exports = router;
