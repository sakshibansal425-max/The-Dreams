exports.requireAdminAuth = (req, res, next) => {
  if (req.session && req.session.adminUser) {
    return next();
  }
  if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in as admin.' });
  }
  return res.redirect('/admin/login');
};
