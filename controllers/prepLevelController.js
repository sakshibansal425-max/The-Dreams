const prisma = require('../config/db');

exports.renderPrepLevels = async (req, res) => {
  try {
    const prepLevels = await prisma.prepLevel.findMany({
      orderBy: { levelNumber: 'asc' },
      include: {
        examPrepLevels: {
          include: {
            exam: {
              include: {
                examPosts: true,
              },
            },
          },
        },
      },
    });

    res.render('prep-levels', {
      title: 'Preparation Levels (1 to 4) — The Dreams',
      prepLevels,
      currentPage: 'prep-levels',
    });
  } catch (error) {
    console.error('Prep Levels Error:', error);
    res.status(500).render('error', { message: 'Failed to load preparation levels.', error, currentPage: 'prep-levels' });
  }
};
