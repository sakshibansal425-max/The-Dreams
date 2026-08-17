const prisma = require('../config/db');

exports.renderContact = (req, res) => {
  res.render('contact', {
    title: 'Contact Us & Student Guidance — The Dreams',
    currentPage: 'contact',
    submitted: req.query.submitted === 'true',
    error: req.query.error || null,
  });
};

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, honeypot } = req.body;

    // Honeypot spam protection check
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Spam detected via honeypot field.');
      return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    }

    if (!name || !email || !subject || !message) {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
      }
      return res.redirect('/contact?error=' + encodeURIComponent('All fields are required.'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
        return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      }
      return res.redirect('/contact?error=' + encodeURIComponent('Invalid email address.'));
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
      return res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Sakshi will review your query and respond shortly.',
        submissionId: submission.id,
      });
    }

    res.redirect('/contact?submitted=true');
  } catch (error) {
    console.error('Contact Form Submission Error:', error);
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
      return res.status(500).json({ success: false, error: 'Failed to process submission. Please try again later.' });
    }
    res.redirect('/contact?error=' + encodeURIComponent('Something went wrong. Please try again.'));
  }
};
