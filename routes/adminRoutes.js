const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { requireAdminAuth } = require('../middleware/auth');

// Auth routes (unprotected)
router.get('/login', adminController.renderLogin);
router.post('/login', adminController.processLogin);
router.get('/logout', adminController.processLogout);

// Protected Admin Routes
router.use(requireAdminAuth);

// Dashboard
router.get('/dashboard', adminController.renderDashboard);

// Submissions
router.get('/submissions', adminController.renderSubmissions);
router.post('/submissions/:id/toggle-read', adminController.toggleSubmissionRead);
router.post('/submissions/:id/archive', adminController.archiveSubmission);

// Exam CRUD
router.get('/exams', adminController.renderExams);
router.get('/exams/new', adminController.renderNewExamForm);
router.post('/exams/new', adminController.createExam);
router.get('/exams/:id/edit', adminController.renderEditExamForm);
router.post('/exams/:id/edit', adminController.updateExam);
router.post('/exams/:id/delete', adminController.deleteExam);

// Feature Flags
router.get('/feature-flags', adminController.renderFeatureFlags);
router.post('/feature-flags/:id/toggle', adminController.toggleFeatureFlag);

module.exports = router;
