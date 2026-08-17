# Project Phases
## Project: ExamSaathi

**Owner:** Sakshi Bansal · sakshibansal425@gmail.com
**Version:** 1.0

Each phase is scoped to be shippable/demoable on its own — useful both for building steadily and for showing incremental portfolio progress.

---

## Phase 0 — Setup & Foundations
**Goal:** Project skeleton ready, nothing user-facing yet.
- Initialize Node.js + Express project structure
- Set up Prisma (or Sequelize) with SQLite
- Define initial DB schema from `architecture.md` ER diagram
- Set up Git repo + basic README
- Set up `.env` config (DB path, session secret, GA4 ID placeholder)
- Decide and lock: EJS (or vanilla JS) templating approach

**Deliverable:** Empty Express app running locally, DB connected, `/health` route returns 200.

---

## Phase 1 — Design System & Static Pages
**Goal:** The design language from `design.md` is implemented and consistent.
- Build global CSS tokens (colors, type scale, spacing) as defined in `design.md`
- Build reusable components: Navbar, Footer, Button, Card, SectionHeading, Badge
- Build static versions of: Home, About Us, Information About Me, Services (no dynamic data yet)
- Implement parallax/scroll motion on Home hero
- Mobile responsiveness pass on all built pages

**Deliverable:** Visually complete, non-dynamic site — the "premium monochromatic" look is fully validated.

---

## Phase 2 — Exam Data & Directory
**Goal:** The core value (exam guidance) becomes real and dynamic.
- Seed database with the exam data (SSC, UPSC, RRB, IBPS, Punjab Police, PPSC, PSSSB, etc.) using the provided table
- Build Exam Directory page with filtering (qualification, category)
- Build Exam Detail page (subjects, books, prep level, pattern)
- Build Preparation Levels page (Level 1–4)

**Deliverable:** A visitor can browse and filter real exam data end-to-end.

---

## Phase 3 — Contact Form + Database Persistence
**Goal:** Visitor inquiries are captured reliably.
- Build Contact Us page UI (per `design.md`)
- Build backend API route + validation (server + client side)
- Persist submissions to `CONTACT_SUBMISSION` table
- Build confirmation/error UI states
- Basic spam protection (honeypot field or simple rate limiting)

**Deliverable:** Contact form works end-to-end and data lands in the local SQLite DB.

---

## Phase 4 — Admin Panel
**Goal:** Sakshi can manage the site without touching code.
- Build admin login (single admin account, hashed password)
- Build protected Admin Dashboard route group
- Build Submissions view (list, mark read/archived)
- Build basic Exam management (add/edit/delete exam entries)
- Build Feature Flags toggle UI

**Deliverable:** Sakshi can log in, view contact submissions, and manage exam data live.

---

## Phase 5 — Chatbot Widget (v1: Rule-Based)
**Goal:** Sidebar assistant answers common questions.
- Design a small FAQ/decision-tree dataset (e.g., "eligibility after 12th", "SSC vs UPSC difference")
- Build chatbot UI widget (per `design.md`)
- Build simple backend matching logic (keyword/rule-based — no vector DB needed yet)
- Fallback: "Still confused? Contact us" → links to Contact page

**Deliverable:** Functional sidebar chatbot answering a defined FAQ set.

---

## Phase 6 — Analytics & Polish
**Goal:** Site is measurable and production-ready.
- Integrate Google Analytics (GA4) site-wide
- Add custom events: CTA clicks, form submissions, exam-card clicks, chatbot opens
- Performance pass (image optimization, lazy loading, Lighthouse audit ≥ 90)
- Accessibility pass (contrast check on monochrome palette, keyboard nav, `prefers-reduced-motion`)
- Cross-browser/device QA

**Deliverable:** Production-ready v1 site with analytics live.

---

## Phase 7 — Deployment
**Goal:** Site is live on the internet.
- Choose hosting (Render/Railway/VPS — Node-friendly, supports SQLite file persistence or easy migration to Postgres)
- Set up custom domain (optional)
- Set up backups for SQLite DB file
- Final smoke test in production

**Deliverable:** Live, publicly accessible ExamSaathi website.

---

## Phase 8+ — Future Enhancements (Post-v1, Backlog)
Not scheduled yet — captured here so they're not lost, and to prove the architecture supports them:
- Mock Test module (new Prisma models + routes, per Phase 2 pattern)
- Current Affairs / Blog module
- Upgrade chatbot to RAG-based (Chroma/FAISS + LLM API) using syllabus documents
- Graph-based "related exams" recommendation via Neo4j
- Migrate SQLite → Supabase/Postgres if traffic grows
- Student accounts (save favorite exams, personalized dashboard)
- Multi-admin support with roles

---

## Suggested Timeline (self-paced, alongside exam prep)
| Phase | Estimated Effort |
|---|---|
| Phase 0 | 2–3 days |
| Phase 1 | 1–1.5 weeks |
| Phase 2 | 1 week |
| Phase 3 | 3–4 days |
| Phase 4 | 1 week |
| Phase 5 | 4–5 days |
| Phase 6 | 3–4 days |
| Phase 7 | 2–3 days |

> Timeline is intentionally generous since this runs alongside government exam preparation — phases can be paused/resumed without breaking the architecture.
