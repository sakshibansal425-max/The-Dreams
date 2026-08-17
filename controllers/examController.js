const prisma = require('../config/db');

exports.renderExamDirectory = async (req, res) => {
  try {
    const { category, qualification, search } = req.query;

    const whereClause = { isActive: true };

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (qualification && qualification !== 'All') {
      whereClause.minQualification = qualification;
    }

    if (search && search.trim() !== '') {
      whereClause.OR = [
        { name: { contains: search.trim() } },
        { description: { contains: search.trim() } },
        { code: { contains: search.trim() } },
      ];
    }

    const exams = await prisma.exam.findMany({
      where: whereClause,
      include: {
        examPosts: true,
        examPrepLevels: {
          include: { prepLevel: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const categories = ['All', 'SSC', 'UPSC', 'RRB', 'IBPS', 'Police', 'State'];
    const qualifications = ['All', '10th', '12th', 'Graduation'];

    res.render('exam-directory', {
      title: 'Exam Directory — The Dreams',
      exams,
      categories,
      qualifications,
      selectedCategory: category || 'All',
      selectedQualification: qualification || 'All',
      searchQuery: search || '',
      currentPage: 'exams',
    });
  } catch (error) {
    console.error('Exam Directory Error:', error);
    res.status(500).render('error', { message: 'Failed to load exam directory.', error, currentPage: 'exams' });
  }
};

exports.renderExamDetail = async (req, res) => {
  try {
    const { code } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        examPosts: true,
        examPatterns: {
          orderBy: { stageOrder: 'asc' },
        },
        examSubjects: {
          include: {
            subject: {
              include: {
                subjectBooks: {
                  include: { book: true },
                },
              },
            },
          },
        },
        examPrepLevels: {
          include: { prepLevel: true },
        },
      },
    });

    if (!exam) {
      return res.status(404).render('error', {
        message: `Exam with code "${code}" was not found.`,
        currentPage: 'exams',
      });
    }

    res.render('exam-detail', {
      title: `${exam.name} — Full Guide, Eligibility & Books | The Dreams`,
      exam,
      currentPage: 'exams',
    });
  } catch (error) {
    console.error('Exam Detail Error:', error);
    res.status(500).render('error', { message: 'Failed to load exam details.', error, currentPage: 'exams' });
  }
};
