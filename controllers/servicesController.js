exports.renderServices = (req, res) => {
  res.render('services', {
    title: 'Services & Modules — The Dreams',
    currentPage: 'services',
  });
};
