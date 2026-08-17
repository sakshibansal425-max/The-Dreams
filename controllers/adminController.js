const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Auth Handlers
exports.renderLogin = (req, res) => {
  if (req.session && req.session.adminUser) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', {
    title: 'Admin Login — The Dreams',
    error: req.query.error || null,
    layout: false,
  });
};

exports.processLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('admin/login', {
        title: 'Admin Login — The Dreams',
        error: 'Email and password are required.',
        layout: false,
      });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin) {
      return res.render('admin/login', {
        title: 'Admin Login — The Dreams',
        error: 'Invalid credentials.',
        layout: false,
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.render('admin/login', {
        title: 'Admin Login — The Dreams',
        error: 'Invalid credentials.',
        layout: false,
      });
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    req.session.adminUser = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.render('admin/login', {
      title: 'Admin Login — The Dreams',
      error: 'An error occurred during authentication.',
      layout: false,
    });
  }
};

exports.processLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

// 2. Dashboard
exports.renderDashboard = async (req, res) => {
  try {
    const totalSubmissions = await prisma.contactSubmission.count({ where: { isArchived: false } });
    const unreadSubmissions = await prisma.contactSubmission.count({ where: { isRead: false, isArchived: false } });
    const totalExams = await prisma.exam.count();
    const activeFeatureFlags = await prisma.featureFlag.count({ where: { enabled: true } });

    const recentSubmissions = await prisma.contactSubmission.findMany({
      where: { isArchived: false },
      orderBy: { submittedAt: 'desc' },
      take: 5,
    });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard — The Dreams',
      adminUser: req.session.adminUser,
      stats: { totalSubmissions, unreadSubmissions, totalExams, activeFeatureFlags },
      recentSubmissions,
      currentPage: 'dashboard',
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).render('error', { message: 'Failed to load dashboard.', error, currentPage: 'admin' });
  }
};

// 3. Submissions Management
exports.renderSubmissions = async (req, res) => {
  try {
    const { status } = req.query; // 'all', 'unread', 'archived'

    const whereClause = {};
    if (status === 'unread') {
      whereClause.isRead = false;
      whereClause.isArchived = false;
    } else if (status === 'archived') {
      whereClause.isArchived = true;
    } else {
      whereClause.isArchived = false;
    }

    const submissions = await prisma.contactSubmission.findMany({
      where: whereClause,
      orderBy: { submittedAt: 'desc' },
    });

    res.render('admin/submissions', {
      title: 'Contact Submissions — Admin Panel',
      adminUser: req.session.adminUser,
      submissions,
      currentFilter: status || 'all',
      currentPage: 'submissions',
    });
  } catch (error) {
    console.error('Submissions Manager Error:', error);
    res.status(500).render('error', { message: 'Failed to load submissions.', error, currentPage: 'admin' });
  }
};

exports.toggleSubmissionRead = async (req, res) => {
  try {
    const { id } = req.params;
    const sub = await prisma.contactSubmission.findUnique({ where: { id: parseInt(id) } });

    if (!sub) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    const updated = await prisma.contactSubmission.update({
      where: { id: parseInt(id) },
      data: { isRead: !sub.isRead },
    });

    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
      return res.json({ success: true, isRead: updated.isRead });
    }

    res.redirect('/admin/submissions');
  } catch (error) {
    console.error('Toggle Read Error:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
};

exports.archiveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contactSubmission.update({
      where: { id: parseInt(id) },
      data: { isArchived: true },
    });

    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
      return res.json({ success: true, isArchived: true });
    }

    res.redirect('/admin/submissions');
  } catch (error) {
    console.error('Archive Error:', error);
    res.status(500).json({ error: 'Failed to archive submission.' });
  }
};

// 4. Exams Management (CRUD)
exports.renderExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        examPosts: true,
        examPrepLevels: { include: { prepLevel: true } },
      },
      orderBy: { id: 'asc' },
    });

    res.render('admin/exams-list', {
      title: 'Manage Exams — Admin Panel',
      adminUser: req.session.adminUser,
      exams,
      message: req.query.message || null,
      currentPage: 'manage-exams',
    });
  } catch (error) {
    console.error('Manage Exams Error:', error);
    res.status(500).render('error', { message: 'Failed to load exams list.', error, currentPage: 'admin' });
  }
};

exports.renderNewExamForm = async (req, res) => {
  try {
    const prepLevels = await prisma.prepLevel.findMany();
    const subjects = await prisma.subject.findMany();

    res.render('admin/exam-form', {
      title: 'Add New Exam — Admin Panel',
      adminUser: req.session.adminUser,
      exam: null,
      prepLevels,
      subjects,
      currentPage: 'manage-exams',
    });
  } catch (error) {
    console.error('New Exam Form Error:', error);
    res.status(500).render('error', { message: 'Failed to render form.', error, currentPage: 'admin' });
  }
};

exports.createExam = async (req, res) => {
  try {
    const { name, code, category, minQualification, frequency, description, officialLink, prepLevelId } = req.body;

    const exam = await prisma.exam.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        category,
        minQualification,
        frequency,
        description: description.trim(),
        officialLink: officialLink ? officialLink.trim() : null,
      },
    });

    if (prepLevelId) {
      await prisma.examPrepLevel.create({
        data: {
          examId: exam.id,
          prepLevelId: parseInt(prepLevelId),
        },
      });
    }

    res.redirect('/admin/exams?message=' + encodeURIComponent(`Exam "${exam.name}" created successfully!`));
  } catch (error) {
    console.error('Create Exam Error:', error);
    res.status(500).render('error', { message: 'Failed to create exam entry.', error, currentPage: 'admin' });
  }
};

exports.renderEditExamForm = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(id) },
      include: {
        examPrepLevels: true,
      },
    });

    if (!exam) {
      return res.status(404).render('error', { message: 'Exam not found.', currentPage: 'admin' });
    }

    const prepLevels = await prisma.prepLevel.findMany();

    res.render('admin/exam-form', {
      title: `Edit ${exam.name} — Admin Panel`,
      adminUser: req.session.adminUser,
      exam,
      prepLevels,
      currentPage: 'manage-exams',
    });
  } catch (error) {
    console.error('Edit Exam Form Error:', error);
    res.status(500).render('error', { message: 'Failed to render edit form.', error, currentPage: 'admin' });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, category, minQualification, frequency, description, officialLink, isActive, prepLevelId } = req.body;

    const exam = await prisma.exam.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        category,
        minQualification,
        frequency,
        description: description.trim(),
        officialLink: officialLink ? officialLink.trim() : null,
        isActive: isActive === 'on' || isActive === 'true' || isActive === true,
      },
    });

    if (prepLevelId) {
      await prisma.examPrepLevel.deleteMany({ where: { examId: exam.id } });
      await prisma.examPrepLevel.create({
        data: {
          examId: exam.id,
          prepLevelId: parseInt(prepLevelId),
        },
      });
    }

    res.redirect('/admin/exams?message=' + encodeURIComponent(`Exam "${exam.name}" updated successfully!`));
  } catch (error) {
    console.error('Update Exam Error:', error);
    res.status(500).render('error', { message: 'Failed to update exam.', error, currentPage: 'admin' });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.exam.delete({ where: { id: parseInt(id) } });

    res.redirect('/admin/exams?message=' + encodeURIComponent(`Exam "${deleted.name}" deleted successfully.`));
  } catch (error) {
    console.error('Delete Exam Error:', error);
    res.status(500).render('error', { message: 'Failed to delete exam.', error, currentPage: 'admin' });
  }
};

// 5. Feature Flags Management
exports.renderFeatureFlags = async (req, res) => {
  try {
    const flags = await prisma.featureFlag.findMany({ orderBy: { id: 'asc' } });
    res.render('admin/feature-flags', {
      title: 'Feature Flags — Admin Panel',
      adminUser: req.session.adminUser,
      flags,
      currentPage: 'feature-flags',
    });
  } catch (error) {
    console.error('Feature Flags View Error:', error);
    res.status(500).render('error', { message: 'Failed to load feature flags.', error, currentPage: 'admin' });
  }
};

exports.toggleFeatureFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const flag = await prisma.featureFlag.findUnique({ where: { id: parseInt(id) } });

    if (!flag) {
      return res.status(404).json({ error: 'Feature flag not found.' });
    }

    const updated = await prisma.featureFlag.update({
      where: { id: parseInt(id) },
      data: { enabled: !flag.enabled },
    });

    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
      return res.json({ success: true, key: updated.key, enabled: updated.enabled });
    }

    res.redirect('/admin/feature-flags');
  } catch (error) {
    console.error('Toggle Feature Flag Error:', error);
    res.status(500).json({ error: 'Failed to update feature flag.' });
  }
};
