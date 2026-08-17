# Product Requirements Document (PRD)
## Project: ExamSaathi — Government Exam Preparation Guide Platform

**Owner:** Sakshi Bansal
**Contact:** sakshibansal425@gmail.com
**Version:** 1.0
**Status:** Draft for Development

---

## 1. Introduction

### 1.1 Background
Sakshi completed 12th class from PSEB and is currently preparing for Indian government exams (SSC, UPSC, Railways, Banking, Punjab Police, PPSC, PSSSB, etc.). While preparing, she noticed there is no single, well-organized, premium-feeling website that walks a student through *which exam suits them, what to study, and where to start* — most existing resources are cluttered ad-heavy blogs or scattered YouTube playlists.

### 1.2 Problem Statement
Students who have just passed 10th/12th or completed graduation often don't know:
- Which government exams they are eligible for
- What subjects/books to prepare from
- What the exam pattern, frequency, and posts are
- Where to get a trustworthy, distraction-free starting point

### 1.3 Vision
Build a **premium, monochromatic, parallax-driven** website — *ExamSaathi* (name placeholder, can be changed later) — that acts as a guide/companion for students preparing for government exams, built and maintained by Sakshi herself, doubling as a **portfolio-grade project** demonstrating her full-stack Node.js skills to recruiters.

### 1.4 Goals
1. Help a confused 10th/12th pass student identify relevant exams in under 2 minutes.
2. Present exam data (eligibility, posts, frequency, subjects, books) in a clean, structured, filterable way.
3. Establish credibility and personal brand for Sakshi (About / "Information about me" section).
4. Capture visitor interest via a contact form, stored reliably and reviewable via an admin panel.
5. Be architected so exams, subjects, blog content, or entirely new features (e.g. mock tests, forum) can be added later without a rebuild.
6. Track visitor behavior via Google Analytics to iteratively improve content and UX.

### 1.5 Non-Goals (v1)
- No payment/monetization system in v1.
- No full user authentication/login system for students in v1 (only admin login).
- No actual mock-test engine in v1 (planned as a later phase/feature).
- No mobile app — responsive web only.

---

## 2. Features

### 2.1 Core Public Pages
| Page | Purpose |
|---|---|
| **Home** | Hero (parallax), value proposition, featured exam categories, quick CTA to explore exams and contact |
| **About Us** | Story of the platform, mission, why it exists |
| **Information About Me** | Sakshi's personal journey — PSEB 12th, exam prep journey, why she's building this, coding background (can double as a personal-brand/portfolio section) |
| **Services** | What the platform offers: exam directory, subject guides, book recommendations, preparation levels, (future) mock tests/current affairs |
| **Exam Directory** | Structured, filterable listing of exams (data-driven from the table provided) — filter by qualification, category (SSC/UPSC/Railway/Banking/Police/State), frequency |
| **Exam Detail Page** | Deep-dive per exam: eligibility, posts, frequency, subjects, recommended books, prep level |
| **Preparation Levels** | Level 1–4 breakdown (Foundation → Advanced) with mapped exams |
| **Contact Us** | Contact form (name, email, subject, message) + direct email/social links |

### 2.2 Interactive / Engagement Features
- **Sidebar Chatbot** — a lightweight assistant widget (rule-based initially, upgradable to LLM-based later) to answer FAQs like "Which exam suits a 12th pass student?" or "What is SSC CHSL eligibility?"
- **Contact Form** — validated client + server side, persisted to local SQL database
- **Parallax scroll effects** — used tastefully on Home and section transitions, monochromatic palette (e.g., black/white/grey with a single accent shade)
- **Google Analytics (GA4)** — pageviews, scroll depth, button clicks (CTA tracking), form submission events

### 2.3 Admin Panel (Protected)
- Secure admin login (single admin user: Sakshi)
- Dashboard: list of contact form submissions (name, email, message, submitted date, read/unread status)
- Ability to mark submissions as read/archived
- (Future-ready) Section to add/edit/delete exam entries via UI instead of editing code — makes the "add features later" requirement concrete

### 2.4 Extensibility Requirements
- Content (exams, subjects, books) stored in DB tables, not hardcoded — new exams can be added via admin panel or direct DB insert without redeploying code
- Modular page/component structure (Node.js backend serving templated views or a decoupled API + frontend) so new pages (e.g., "Current Affairs", "Mock Tests", "Blog") can be added as new modules/routes
- Config-driven feature flags (e.g., `chatbot_enabled`, `mock_test_enabled`) stored in DB or `.env` so features can be toggled without code changes

---

## 3. Use Cases

| # | Actor | Use Case |
|---|---|---|
| UC-1 | Student (visitor) | Lands on Home, browses exam categories, filters by "12th pass" eligibility |
| UC-2 | Student (visitor) | Opens an exam detail page to see subjects, books, and posts |
| UC-3 | Student (visitor) | Asks the sidebar chatbot "Which exam can I give after 12th?" |
| UC-4 | Student (visitor) | Fills contact form to ask a specific doubt or request guidance |
| UC-5 | Sakshi (admin) | Logs into admin panel, reviews new contact submissions |
| UC-6 | Sakshi (admin) | Adds a new exam entry (e.g., a new SSC notification) via admin panel |
| UC-7 | Sakshi (owner) | Reviews Google Analytics dashboard to see which exam pages get most traffic |
| UC-8 | Recruiter/Developer (visitor) | Visits "About Me" section to evaluate Sakshi's skills and project quality |

---

## 4. Target Audience

### Primary
- Students who passed **10th or 12th** (PSEB/CBSE/other boards) and are exploring government exam options, especially in **Punjab** (Punjab Police, PPSC, PSSSB) but also national-level exams.
- Graduates preparing for SSC CGL, Banking (IBPS/SBI), UPSC CSE/CDS, CAPF.

### Secondary
- Parents/guardians researching exam options on behalf of their children.
- Recruiters/developers evaluating Sakshi's technical portfolio (via About Me / footer credit).

---

## 5. Tech Stack

### 5.1 Frontend
- **Node.js** based frontend — server-rendered views using **EJS/Handlebars** (simplest, SEO-friendly, fast to build) *or* a lightweight Node-served static build (vanilla JS + CSS) for the parallax/animation-heavy pages.
- Parallax/scroll effects: vanilla JS with `IntersectionObserver` / a small library (e.g., Locomotive Scroll or AOS) — kept framework-free to stay true to "Node.js only" requirement.
- Monochromatic design system defined centrally (see `design.md`).

### 5.2 Backend
- **Node.js + Express.js** — REST API layer for: exam data, contact form submissions, chatbot responses, admin auth, admin CRUD.
- **Authentication:** simple session-based or JWT auth for the single admin account.

### 5.3 Database

| Type | Choice (v1) | Alternative (documented, not chosen) | Why |
|---|---|---|---|
| **Primary (relational)** | **Local SQL — SQLite** (via `better-sqlite3` or `sequelize`/`prisma` ORM) | Supabase (hosted Postgres), Firebase (NoSQL doc store) | Matches explicit requirement: "local SQL DB", zero hosting cost, file-based, trivial to back up, easy to swap to Postgres/Supabase later since ORM abstracts the DB layer |
| **NoSQL (future, optional)** | Not used in v1 | **Neo4j** (graph DB) | Could model exam→subject→book relationships as a graph if the "recommend related exams" feature grows complex (e.g., "students who prepared for X also prepared for Y"). Not needed for v1's scale. |
| **Vector DB / RAG (future, optional)** | Not used in v1 | **Chroma** (self-hosted, free) or **FAISS** (in-process, no server) over **Pinecone** (paid/hosted) | If the chatbot evolves from rule-based to an LLM-powered RAG assistant that answers from exam-syllabus documents, Chroma/FAISS are the pragmatic free/local choices consistent with the "local-first" philosophy of this project. Vector-less (keyword/rule-based) chatbot is the recommended v1 approach — simpler, no embedding costs. |

### 5.4 Other Tools
- **Google Analytics (GA4)** — via `gtag.js` snippet
- **ORM:** Prisma or Sequelize (recommended: Prisma, for type-safe schema + easy future migration from SQLite → Postgres/Supabase)
- **Validation:** `zod` or `express-validator` for form validation
- **Deployment (future):** Node-friendly host (Render/Railway/VPS) — SQLite file works for small scale; migrate to Postgres/Supabase when traffic grows
- **Version control:** Git + GitHub (also reinforces the portfolio angle)

### 5.5 Why This Stack Fits the Requirements
- "Node.js only for frontend and backend" → Express + EJS/vanilla JS satisfies this without introducing React/Vue.
- "Local SQL DB" → SQLite is genuinely local (a file on disk), zero external dependency, perfect for v1 and for a student-budget project.
- "System where I can add features later" → Prisma schema + modular Express routes + DB-driven content + feature flags together create a plug-in-friendly architecture (detailed further in `architecture.md`).

---

## 6. Success Metrics (v1)
- Site loads in < 2s on average connection
- Contact form submission success rate > 98%
- GA4 tracking confirmed live on all pages
- Admin can view/manage submissions without touching code
- At least 5 exam categories fully populated with data at launch
