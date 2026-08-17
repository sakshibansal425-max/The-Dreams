const prisma = require('../config/db');

// FAQ Rule base
const faqRules = [
  {
    keywords: ['12th', 'after 12th', 'plus two', 'higher secondary'],
    response: 'Great choices after 12th include: **SSC CHSL** (LDC/DEO), **Punjab Police Constable**, **RRB NTPC** (Undergraduate posts), and **UPSC NDA**. Visit our Exam Directory and filter by "12th Pass" to see full details!',
    links: [{ text: 'View 12th Pass Exams', url: '/exams?qualification=12th' }],
  },
  {
    keywords: ['10th', 'after 10th', 'matric', 'matriculation'],
    response: 'Top options for 10th pass candidates: **SSC MTS & Havaldar** and **RRB Group D**. Check out Level 1 (Foundation) in our Preparation Levels guide!',
    links: [{ text: 'View 10th Pass Exams', url: '/exams?qualification=10th' }],
  },
  {
    keywords: ['graduate', 'graduation', 'degree', 'ba', 'bsc', 'bcom', 'btech'],
    response: 'High-level opportunities for graduates: **SSC CGL**, **IBPS PO/Clerk**, **UPSC CSE**, **Punjab Police Sub-Inspector**, **PSSSB Senior Assistant**, and **PPSC Naib Tehsildar**.',
    links: [{ text: 'Explore Graduate Exams', url: '/exams?qualification=Graduation' }],
  },
  {
    keywords: ['punjab', 'punjab police', 'ppsc', 'psssb'],
    response: 'For Punjab State Exams (Punjab Police Constable/SI, PSSSB Clerks, PPSC): Mandatory **10th pass in Punjabi language** is required. Recommended Punjab GK book: *Know Your State: Punjab* by Arihant.',
    links: [{ text: 'Filter Police & State Exams', url: '/exams?category=Police' }],
  },
  {
    keywords: ['ssc', 'cgl', 'chsl', 'mts'],
    response: 'SSC exams are conducted annually by Staff Selection Commission for central government ministries. SSC CGL is for graduates, CHSL for 12th pass, and MTS for 10th pass.',
    links: [{ text: 'View SSC Exams', url: '/exams?category=SSC' }],
  },
  {
    keywords: ['book', 'books', 'study material', 'preparation book'],
    response: 'Popular recommended books:\n• **Quant:** RS Aggarwal / Rajesh Verma\n• **Reasoning:** RS Aggarwal / MK Pandey\n• **English:** SP Bakshi\n• **GK:** Lucent GK & Laxmikanth (Polity)',
    links: [{ text: 'View Books in Exam Details', url: '/exams' }],
  },
  {
    keywords: ['who built this', 'sakshi', 'author', 'about me', 'creator'],
    response: 'This platform was created by **Sakshi Bansal** — a student preparing for government exams herself, built using Node.js, Express, and Prisma SQLite to guide fellow aspirants!',
    links: [{ text: 'Read Sakshi\'s Story', url: '/about-me' }],
  },
];

exports.queryChatbot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const query = message.toLowerCase().trim();

    // Check FAQ rules
    for (const rule of faqRules) {
      const match = rule.keywords.some((kw) => query.includes(kw));
      if (match) {
        return res.json({
          reply: rule.response,
          links: rule.links || [],
        });
      }
    }

    // Dynamic database search fallback for specific exam names
    const matchedExam = await prisma.exam.findFirst({
      where: {
        OR: [
          { name: { contains: query } },
          { code: { contains: query } },
          { category: { contains: query } },
        ],
      },
    });

    if (matchedExam) {
      return res.json({
        reply: `Here is what I found for **${matchedExam.name}**: It is a ${matchedExam.frequency} exam requiring **${matchedExam.minQualification}** qualification.`,
        links: [{ text: `View ${matchedExam.code} Details`, url: `/exams/${matchedExam.code}` }],
      });
    }

    // Default Fallback
    return res.json({
      reply: "I couldn't find an exact answer for your query. But don't worry! You can explore our Exam Directory or send a direct question to Sakshi via the Contact form.",
      links: [
        { text: 'Browse Exam Directory', url: '/exams' },
        { text: 'Contact Us', url: '/contact' },
      ],
    });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return res.status(500).json({ error: 'Internal server error in chatbot widget.' });
  }
};
