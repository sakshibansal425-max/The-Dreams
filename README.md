# The Dreams — Government Exam Preparation Guide Platform

> **Owner:** Sakshi Bansal (sakshibansal425@gmail.com)  
> **Tech Stack:** Node.js, Express.js, Prisma ORM, SQLite DB, EJS Views, Monochromatic CSS design system  
> **Live Local URL:** `http://localhost:3000`

---

## 🌟 Overview

**The Dreams** is a portfolio-grade, monochromatic, parallax-driven web application designed to guide students preparing for Indian government exams (SSC, UPSC, Railways, Banking, Punjab Police, PPSC, PSSSB, etc.).

It solves the information chaos faced by 10th-pass, 12th-pass, and graduate aspirants by presenting structured data: exam patterns, minimum eligibility, recruiting posts, stage selection processes, and curated subject-wise book recommendations in a clean, distraction-free environment.

---

## 🚀 Key Features

1. **Monochromatic Parallax Design System**
   - High-contrast monochromatic visual palette with a single muted gold accent (`#C9A15A`).
   - Parallax scroll depth on hero sections, smooth motion, and responsive breakpoints.

2. **Dynamic Exam Directory & Search**
   - Filter government exams by qualification (`10th`, `12th`, `Graduation`) or category (`SSC`, `UPSC`, `RRB`, `IBPS`, `Police`, `State`).
   - Full keyword search across exam names, codes, and descriptions.

3. **Detailed Exam Pathways**
   - Deep-dive pages per exam detailing selection stages (Tier 1, Tier 2, Interview, PET), post categories (Group A/B/C/D), and recommended book catalogs.

4. **Preparation Levels (1 to 4 Roadmap)**
   - Step-by-step guidance mapping basic NCERT foundations (Level 1) up to advanced civil services (Level 4).

5. **Contact Portal & DB Persistence**
   - Validated student inquiry form persisted to SQLite DB with honeypot anti-spam protection.

6. **Interactive Rule-Based Chatbot Assistant**
   - Floating sidebar widget answering student eligibility FAQs in real time.

7. **Protected Admin Panel**
   - Single admin authentication (Sakshi).
   - Dashboard analytics, contact submissions management (read/unread, archive), exam CRUD (add/edit/delete exams), and dynamic feature flag toggling.

---

## 🛠️ Installation & Setup

1. **Clone the repository & install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create or verify `.env` file (refer to `.env.example`):
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="thedreams_super_secret_session_key_2026"
   GA_MEASUREMENT_ID="G-MEASUREMENT_ID_PLACEHOLDER"
   ADMIN_EMAIL="sakshibansal425@gmail.com"
   ADMIN_PASSWORD="admin_password_123"
   ```

3. **Run Prisma Migrations & Seed Database:**
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Access Endpoints:**
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Health Check: [http://localhost:3000/health](http://localhost:3000/health)
   - Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📁 Directory Architecture

```
d:\dreams\
├── config/             # DB & environment configuration singleton
│   ├── db.js
│   └── env.js
├── controllers/        # Route logic & DB handlers
│   ├── adminController.js
│   ├── homeController.js
│   ├── examController.js
│   ├── contactController.js
│   ├── chatbotController.js
│   └── healthController.js
├── middleware/         # Auth & Feature Flags middlewares
│   ├── auth.js
│   └── featureFlags.js
├── prisma/             # Schema definitions & seed scripts
│   ├── schema.prisma
│   ├── seed.js
│   └── dev.db
├── public/             # Static design system assets
│   ├── css/style.css
│   └── js/main.js
├── routes/             # Modular Express routers
│   ├── index.js
│   ├── publicRoutes.js
│   ├── apiRoutes.js
│   ├── adminRoutes.js
│   └── health.js
├── views/              # EJS server-rendered template views
│   ├── partials/
│   ├── admin/
│   ├── home.ejs
│   ├── exam-directory.ejs
│   ├── exam-detail.ejs
│   ├── prep-levels.ejs
│   ├── services.ejs
│   ├── about.ejs
│   ├── about-me.ejs
│   ├── contact.ejs
│   └── error.ejs
├── .env
├── package.json
└── server.js           # Express main server entry point
```

---

## 📝 License
Created by Sakshi Bansal. All rights reserved.
"# The-Dreams" 
