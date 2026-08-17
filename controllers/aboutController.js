exports.renderAbout = (req, res) => {
  res.render('about', {
    title: 'About Us — The Dreams',
    currentPage: 'about',
  });
};

exports.renderAboutMe = (req, res) => {
  res.render('about-me', {
    title: 'Information About Me — Sakshi Bansal | The Dreams',
    currentPage: 'about-me',
  });
};
