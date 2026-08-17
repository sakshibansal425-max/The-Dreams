const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'sakshibansal425@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin_password_123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      name: 'Sakshi Bansal',
      passwordHash,
    },
  });
  console.log('✅ Admin User seeded:', admin.email);

  // 2. Seed Feature Flags
  const featureFlags = [
    { key: 'chatbot_enabled', enabled: true, description: 'Enable sidebar rule-based FAQ assistant widget' },
    { key: 'contact_form_enabled', enabled: true, description: 'Enable visitor contact form submissions' },
    { key: 'mock_test_teaser_enabled', enabled: true, description: 'Show coming-soon banner for mock tests' },
    { key: 'current_affairs_teaser_enabled', enabled: true, description: 'Show current affairs module teaser' },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: { enabled: flag.enabled, description: flag.description },
      create: flag,
    });
  }
  console.log('✅ Feature Flags seeded');

  // 3. Seed Preparation Levels
  const prepLevels = [
    {
      levelNumber: 1,
      levelName: 'Foundation Level',
      description: 'Ideal for 10th pass candidates. Focuses on basic NCERTs, elementary mathematics, foundational English, and basic general knowledge.',
    },
    {
      levelNumber: 2,
      levelName: '12th Pass Level',
      description: 'Designed for 12th pass students targeting SSC CHSL, Railway NTPC, Punjab Police Constable, and NDA.',
    },
    {
      levelNumber: 3,
      levelName: 'Graduation Level',
      description: 'Comprehensive preparation for graduates targeting SSC CGL, IBPS PO, Banking Clerks, Punjab Police SI, PSSSB, and PPSC.',
    },
    {
      levelNumber: 4,
      levelName: 'Advanced / Civil Services Level',
      description: 'High-intensity analytical and descriptive preparation for UPSC Civil Services (IAS/IPS/IFS) and PPSC Combined Competitive Services.',
    },
  ];

  const createdPrepLevels = {};
  for (const level of prepLevels) {
    const pl = await prisma.prepLevel.upsert({
      where: { levelNumber: level.levelNumber },
      update: level,
      create: level,
    });
    createdPrepLevels[level.levelNumber] = pl;
  }
  console.log('✅ Prep Levels seeded');

  // 4. Seed Subjects
  const subjectsData = [
    { name: 'Quantitative Aptitude', description: 'Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, and Data Interpretation' },
    { name: 'General Intelligence & Reasoning', description: 'Verbal reasoning, Non-verbal reasoning, Puzzles, Coding-Decoding, Syllogism' },
    { name: 'General English & Comprehension', description: 'Grammar rules, Vocabulary, Reading Comprehension, Cloze Test, Error Spotting' },
    { name: 'General Knowledge & Current Affairs', description: 'Indian History, Polity, Geography, Economy, Science, Punjab State GK, National & International Events' },
    { name: 'Computer Knowledge', description: 'Fundamentals of Computers, MS Office, Internet, Cybersecurity, Networking Basics' },
    { name: 'Punjabi Language', description: 'Punjabi Grammar, Vocabulary, Translation, Idioms, Literature basics for Punjab State Exams' },
  ];

  const createdSubjects = {};
  for (const s of subjectsData) {
    const subj = await prisma.subject.upsert({
      where: { name: s.name },
      update: { description: s.description },
      create: s,
    });
    createdSubjects[s.name] = subj;
  }
  console.log('✅ Subjects seeded');

  // 5. Seed Recommended Books
  const booksData = [
    { title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', link: 'https://www.amazon.in/s?k=RS+Aggarwal+Quantitative+Aptitude', subjectName: 'Quantitative Aptitude' },
    { title: 'Fast Track Objective Arithmetic', author: 'Rajesh Verma (Arihant)', link: 'https://www.amazon.in/s?k=Fast+Track+Objective+Arithmetic', subjectName: 'Quantitative Aptitude' },
    { title: 'A Modern Approach to Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', link: 'https://www.amazon.in/s?k=RS+Aggarwal+Reasoning', subjectName: 'General Intelligence & Reasoning' },
    { title: 'Analytical Reasoning', author: 'M.K. Pandey', link: 'https://www.amazon.in/s?k=MK+Pandey+Analytical+Reasoning', subjectName: 'General Intelligence & Reasoning' },
    { title: 'Objective General English', author: 'S.P. Bakshi (Arihant)', link: 'https://www.amazon.in/s?k=SP+Bakshi+Objective+General+English', subjectName: 'General English & Comprehension' },
    { title: 'Word Power Made Easy', author: 'Norman Lewis', link: 'https://www.amazon.in/s?k=Word+Power+Made+Easy', subjectName: 'General English & Comprehension' },
    { title: 'Lucent\'s General Knowledge', author: 'Dr. Binay Karna (Lucent)', link: 'https://www.amazon.in/s?k=Lucent+General+Knowledge', subjectName: 'General Knowledge & Current Affairs' },
    { title: 'Indian Polity for Civil Services', author: 'M. Laxmikanth (McGraw Hill)', link: 'https://www.amazon.in/s?k=Laxmikanth+Indian+Polity', subjectName: 'General Knowledge & Current Affairs' },
    { title: 'Know Your State: Punjab', author: 'Arihant Experts', link: 'https://www.amazon.in/s?k=Arihant+Punjab+GK', subjectName: 'Punjabi Language' },
    { title: 'Objective Computer Awareness', author: 'Arihant Experts', link: 'https://www.amazon.in/s?k=Arihant+Computer+Awareness', subjectName: 'Computer Knowledge' },
  ];

  for (const b of booksData) {
    const subject = createdSubjects[b.subjectName];
    const book = await prisma.book.create({
      data: {
        title: b.title,
        author: b.author,
        link: b.link,
      },
    });

    if (subject) {
      await prisma.subjectBook.upsert({
        where: {
          subjectId_bookId: {
            subjectId: subject.id,
            bookId: book.id,
          },
        },
        update: {},
        create: {
          subjectId: subject.id,
          bookId: book.id,
        },
      });
    }
  }
  console.log('✅ Books & Subject-Book relations seeded');

  // 6. Seed Exams with Posts, Patterns, Subjects & Prep Levels
  const examsData = [
    {
      code: 'SSC-CGL',
      name: 'SSC Combined Graduate Level (CGL)',
      category: 'SSC',
      minQualification: 'Graduation',
      frequency: 'Annual',
      description: 'Premier national recruitment exam for Group B and C Gazetted/Non-Gazetted posts across central government ministries (Inspectors in Income Tax, Excise, Assistant Section Officers, Auditors).',
      officialLink: 'https://ssc.gov.in',
      prepLevelNumber: 3,
      posts: [
        { postName: 'Assistant Section Officer (CSS/MEA/IB)', postLevel: 'Group B' },
        { postName: 'Inspector (Income Tax / Central Excise / Preventive)', postLevel: 'Group B' },
        { postName: 'Assistant Enforcement Officer (ED)', postLevel: 'Group B' },
        { postName: 'Sub-Inspector (CBI)', postLevel: 'Group B' },
        { postName: 'Auditor & Accountant (CAG)', postLevel: 'Group C' },
      ],
      stages: [
        { stageName: 'Tier 1: Computer Based Exam (Qualifying)', stageOrder: 1 },
        { stageName: 'Tier 2: Mathematical Abilities, Reasoning, English, GA & Computer Test', stageOrder: 2 },
        { stageName: 'Document Verification & Medical Test', stageOrder: 3 },
      ],
      subjects: ['Quantitative Aptitude', 'General Intelligence & Reasoning', 'General English & Comprehension', 'General Knowledge & Current Affairs', 'Computer Knowledge'],
    },
    {
      code: 'SSC-CHSL',
      name: 'SSC Combined Higher Secondary Level (CHSL)',
      category: 'SSC',
      minQualification: '12th',
      frequency: 'Annual',
      description: 'One of the most popular 12th pass government exams in India for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO) in union ministries.',
      officialLink: 'https://ssc.gov.in',
      prepLevelNumber: 2,
      posts: [
        { postName: 'Lower Division Clerk (LDC) / Junior Secretariat Assistant', postLevel: 'Group C' },
        { postName: 'Data Entry Operator (DEO / DEO Grade A)', postLevel: 'Group C' },
      ],
      stages: [
        { stageName: 'Tier 1: Objective Computer Based Test', stageOrder: 1 },
        { stageName: 'Tier 2: Mathematical, Reasoning, English, GA + Skill / Typing Test', stageOrder: 2 },
      ],
      subjects: ['Quantitative Aptitude', 'General Intelligence & Reasoning', 'General English & Comprehension', 'General Knowledge & Current Affairs'],
    },
    {
      code: 'SSC-MTS',
      name: 'SSC Multi-Tasking Staff (MTS) & Havaldar',
      category: 'SSC',
      minQualification: '10th',
      frequency: 'Annual',
      description: 'Ideal starting entry-level exam for 10th pass candidates for Multi-Tasking (Non-Technical) Staff and Havaldar in CBIC & CBN.',
      officialLink: 'https://ssc.gov.in',
      prepLevelNumber: 1,
      posts: [
        { postName: 'Multi-Tasking Staff (General Central Service)', postLevel: 'Group C' },
        { postName: 'Havaldar (Central Excise / Customs / Narcotics)', postLevel: 'Group C' },
      ],
      stages: [
        { stageName: 'Session 1 & 2 Computer Based Examination', stageOrder: 1 },
        { stageName: 'PET / PST (Physical Test - Only for Havaldar)', stageOrder: 2 },
      ],
      subjects: ['Quantitative Aptitude', 'General Intelligence & Reasoning', 'General English & Comprehension', 'General Knowledge & Current Affairs'],
    },
    {
      code: 'UPSC-CSE',
      name: 'UPSC Civil Services Examination (CSE)',
      category: 'UPSC',
      minQualification: 'Graduation',
      frequency: 'Annual',
      description: 'India\'s most prestigious exam recruiting officers for the Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and Central Group A services.',
      officialLink: 'https://upsc.gov.in',
      prepLevelNumber: 4,
      posts: [
        { postName: 'Indian Administrative Service (IAS)', postLevel: 'Group A' },
        { postName: 'Indian Police Service (IPS)', postLevel: 'Group A' },
        { postName: 'Indian Foreign Service (IFS)', postLevel: 'Group A' },
        { postName: 'Indian Revenue Service (IRS IT / Customs)', postLevel: 'Group A' },
      ],
      stages: [
        { stageName: 'Preliminary Examination (GS Paper 1 + CSAT Paper 2)', stageOrder: 1 },
        { stageName: 'Mains Written Examination (9 Descriptive Papers)', stageOrder: 2 },
        { stageName: 'Personality Test / Interview', stageOrder: 3 },
      ],
      subjects: ['General Knowledge & Current Affairs', 'General English & Comprehension', 'Quantitative Aptitude', 'General Intelligence & Reasoning'],
    },
    {
      code: 'RRB-NTPC',
      name: 'Railway RRB Non-Technical Popular Categories (NTPC)',
      category: 'RRB',
      minQualification: '12th',
      frequency: 'Notification-based',
      description: 'Massive railway recruitment for Under-Graduate and Graduate level positions such as Goods Guard, Station Master, Commercial Clerk, and Ticket Collector.',
      officialLink: 'https://indianrailways.gov.in',
      prepLevelNumber: 2,
      posts: [
        { postName: 'Station Master', postLevel: 'Group C' },
        { postName: 'Goods Guard / Train Manager', postLevel: 'Group C' },
        { postName: 'Commercial cum Ticket Clerk', postLevel: 'Group C' },
        { postName: 'Junior Clerk cum Typist', postLevel: 'Group C' },
      ],
      stages: [
        { stageName: '1st Stage Computer Based Test (CBT 1)', stageOrder: 1 },
        { stageName: '2nd Stage Computer Based Test (CBT 2)', stageOrder: 2 },
        { stageName: 'Typing Skill Test / CBAT (Psychometric Test)', stageOrder: 3 },
        { stageName: 'Document Verification & Medical Examination', stageOrder: 4 },
      ],
      subjects: ['General Intelligence & Reasoning', 'Quantitative Aptitude', 'General Knowledge & Current Affairs', 'Computer Knowledge'],
    },
    {
      code: 'IBPS-PO',
      name: 'IBPS Probationary Officer (PO) / Management Trainee',
      category: 'IBPS',
      minQualification: 'Graduation',
      frequency: 'Annual',
      description: 'National banking recruitment exam for Officer Cadet / Assistant Manager cadre across 11+ Public Sector Banks in India.',
      officialLink: 'https://ibps.in',
      prepLevelNumber: 3,
      posts: [
        { postName: 'Probationary Officer / Assistant Manager', postLevel: 'Group B Officer' },
      ],
      stages: [
        { stageName: 'Preliminary Exam (English, Quant, Reasoning)', stageOrder: 1 },
        { stageName: 'Main Exam (Objective + Descriptive English)', stageOrder: 2 },
        { stageName: 'Common Interview & Final Merit List', stageOrder: 3 },
      ],
      subjects: ['Quantitative Aptitude', 'General Intelligence & Reasoning', 'General English & Comprehension', 'General Knowledge & Current Affairs', 'Computer Knowledge'],
    },
    {
      code: 'PUNJAB-POLICE-CONSTABLE',
      name: 'Punjab Police Constable Recruitment',
      category: 'Police',
      minQualification: '12th',
      frequency: 'Annual',
      description: 'Recruitment for Constables in District Police Cadre and Armed Police Cadre under Punjab Police Department. Mandatory 10th pass Punjabi language requirement.',
      officialLink: 'https://punjabpolice.gov.in',
      prepLevelNumber: 2,
      posts: [
        { postName: 'Constable (District Cadre)', postLevel: 'Group C' },
        { postName: 'Constable (Armed Police Cadre)', postLevel: 'Group C' },
      ],
      stages: [
        { stageName: 'Stage 1: Computer Based Test (CBT - Paper 1 & Qualifying Paper 2 Punjabi)', stageOrder: 1 },
        { stageName: 'Stage 2: Physical Measurement Test (PMT) & Physical Screening Test (PST)', stageOrder: 2 },
        { stageName: 'Stage 3: Document Scrutiny', stageOrder: 3 },
      ],
      subjects: ['General Knowledge & Current Affairs', 'Quantitative Aptitude', 'General Intelligence & Reasoning', 'General English & Comprehension', 'Punjabi Language', 'Computer Knowledge'],
    },
    {
      code: 'PUNJAB-POLICE-SI',
      name: 'Punjab Police Sub-Inspector (SI)',
      category: 'Police',
      minQualification: 'Graduation',
      frequency: 'Notification-based',
      description: 'Prestigious executive cadre exam for Sub-Inspectors in District Police, Armed Police, Intelligence, and Investigation Cadres of Punjab Police.',
      officialLink: 'https://punjabpolice.gov.in',
      prepLevelNumber: 3,
      posts: [
        { postName: 'Sub-Inspector (District Cadre)', postLevel: 'Group B' },
        { postName: 'Sub-Inspector (Armed Cadre)', postLevel: 'Group B' },
        { postName: 'Sub-Inspector (Intelligence Cadre)', postLevel: 'Group B' },
      ],
      stages: [
        { stageName: 'Stage 1: Computer Based Test (Paper 1, Paper 2 & Mandatory Punjabi Test)', stageOrder: 1 },
        { stageName: 'Stage 2: Physical Measurement Test (PMT) & Physical Screening Test (PST)', stageOrder: 2 },
        { stageName: 'Stage 3: Document Scrutiny & Medical Test', stageOrder: 3 },
      ],
      subjects: ['General Knowledge & Current Affairs', 'Quantitative Aptitude', 'General Intelligence & Reasoning', 'General English & Comprehension', 'Punjabi Language', 'Computer Knowledge'],
    },
    {
      code: 'PSSSB-CLERK',
      name: 'PSSSB Senior Assistant / Clerk / Typist',
      category: 'State',
      minQualification: 'Graduation',
      frequency: 'Notification-based',
      description: 'Punjab Subordinate Services Selection Board recruitment for clerical and administrative assistant positions across Punjab state departments.',
      officialLink: 'https://sssb.punjab.gov.in',
      prepLevelNumber: 3,
      posts: [
        { postName: 'Senior Assistant / Inspector', postLevel: 'Group B/C' },
        { postName: 'Clerk cum Data Entry Operator', postLevel: 'Group C' },
      ],
      stages: [
        { stageName: 'Written Competitive Examination', stageOrder: 1 },
        { stageName: 'Punjabi & English Typing Test (30 WPM)', stageOrder: 2 },
        { stageName: 'Document Verification', stageOrder: 3 },
      ],
      subjects: ['General Knowledge & Current Affairs', 'Quantitative Aptitude', 'General Intelligence & Reasoning', 'General English & Comprehension', 'Punjabi Language', 'Computer Knowledge'],
    },
  ];

  for (const ed of examsData) {
    const exam = await prisma.exam.upsert({
      where: { code: ed.code },
      update: {
        name: ed.name,
        category: ed.category,
        minQualification: ed.minQualification,
        frequency: ed.frequency,
        description: ed.description,
        officialLink: ed.officialLink,
      },
      create: {
        code: ed.code,
        name: ed.name,
        category: ed.category,
        minQualification: ed.minQualification,
        frequency: ed.frequency,
        description: ed.description,
        officialLink: ed.officialLink,
      },
    });

    // Link Prep Level
    const targetPrepLevel = createdPrepLevels[ed.prepLevelNumber];
    if (targetPrepLevel) {
      await prisma.examPrepLevel.upsert({
        where: {
          examId_prepLevelId: {
            examId: exam.id,
            prepLevelId: targetPrepLevel.id,
          },
        },
        update: {},
        create: {
          examId: exam.id,
          prepLevelId: targetPrepLevel.id,
        },
      });
    }

    // Add Posts
    for (const p of ed.posts) {
      const existingPost = await prisma.examPost.findFirst({
        where: { examId: exam.id, postName: p.postName },
      });
      if (!existingPost) {
        await prisma.examPost.create({
          data: {
            examId: exam.id,
            postName: p.postName,
            postLevel: p.postLevel,
          },
        });
      }
    }

    // Add Patterns/Stages
    for (const st of ed.stages) {
      const existingStage = await prisma.examPattern.findFirst({
        where: { examId: exam.id, stageName: st.stageName },
      });
      if (!existingStage) {
        await prisma.examPattern.create({
          data: {
            examId: exam.id,
            stageName: st.stageName,
            stageOrder: st.stageOrder,
          },
        });
      }
    }

    // Map Subjects
    for (const subjName of ed.subjects) {
      const targetSubject = createdSubjects[subjName];
      if (targetSubject) {
        await prisma.examSubject.upsert({
          where: {
            examId_subjectId: {
              examId: exam.id,
              subjectId: targetSubject.id,
            },
          },
          update: {},
          create: {
            examId: exam.id,
            subjectId: targetSubject.id,
          },
        });
      }
    }
  }
  console.log('✅ Exams, Posts, Patterns, and Exam-Subject relations seeded successfully!');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
