const prisma = require('../config/db');

exports.renderHome = async (req, res) => {
  try {
    const featuredExams = await prisma.exam.findMany({
      take: 6,
      where: { isActive: true },
      include: {
        examPrepLevels: {
          include: { prepLevel: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    const prepLevels = await prisma.prepLevel.findMany({
      orderBy: { levelNumber: 'asc' },
    });

    res.render('home', {
      title: 'The Dreams — Premium Government Exam Prep Guide',
      featuredExams,
      prepLevels,
      currentPage: 'home',
    });
  } catch (error) {
    console.error('Home Page Error:', error);
    res.status(500).render('error', { message: 'Failed to load home page.', error, currentPage: 'home' });
  }
};
