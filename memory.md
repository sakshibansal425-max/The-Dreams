# AI Working Memory
## Project: The Dreams (ExamSaathi)

**Purpose:** This file is meant to be read by an AI assistant at the start of every work session on this project. Update it at the **end of every phase or work session** so the AI never loses context.

---

## 1. Project Snapshot
- **Name:** The Dreams (formerly working title ExamSaathi)
- **Owner:** Sakshi Bansal (sakshibansal425@gmail.com)
- **One-line description:** Premium monochromatic parallax website guiding 10th/12th-pass and graduate students through Indian government exam options, built in Node.js with a local SQLite DB and admin panel.
- **Reference docs:** `prd.md` (what/why), `architecture.md` (diagrams/schema), `design.md` (visual system), `phase.md` (roadmap)

---

## 2. Current Phase
**Phase:** 6 — Analytics & Polish (Phases 0 through 6 Complete)
**Status:** Completed
**Last updated:** 2026-08-17

---

## 3. Phase Log
### [2026-08-17] — Phase 0 to 6 — Full Platform Build
**Done:**
- Initialized Node.js + Express project skeleton with clean modular layout (`routes/`, `controllers/`, `models/`, `views/`, `public/`, `config/`, `middleware/`).
- Configured Prisma ORM with SQLite database (`prisma/schema.prisma`) mapping all 12 models: Exam, Subject, Book, ExamSubject, SubjectBook, PrepLevel, ExamPrepLevel, ExamPost, ExamPattern, ContactSubmission, AdminUser, FeatureFlag.
- Created `.env` and `.env.example` with non-hardcoded secrets and GA4 ID placeholder.
- Implemented `/health` route returning 200 JSON status confirming DB connection.
- Initialized Git repository with `.gitignore` and `README.md`.
- Implemented Monochromatic Parallax Design System (`public/css/style.css`, `public/js/main.js`) with muted gold accent `#C9A15A`.
- Built all core public EJS pages: Home, About Us, Information About Me (Sakshi's PSEB 12th + Node.js fullstack portfolio story), Services & Modules, Exam Directory with multi-filter search, Exam Detail page, Prep Levels 1–4 roadmap, Contact Us page with honeypot spam protection.
- Built Protected Admin Panel (`/admin/login`, `/admin/dashboard`, `/admin/submissions`, `/admin/exams`, `/admin/feature-flags`) with session auth, contact submission manager, exam CRUD, and feature flag toggles.
- Built floating Sidebar Chatbot Widget with rule-based FAQ assistant API.
- Added GA4 analytics script integration in shared header partial.
- Verified all pages with automated HTTP GET checks (200 OK).

**In progress:**
- Ready for Phase 7 (Deployment to Render/Railway/VPS).

**Blocked/Open questions:**
- None.

**Next step:**
- Phase 7: Deployment to production host (Render/Railway/VPS).

---

## 4. Decisions Log

| Date | Decision | Reason | Doc updated? |
|---|---|---|---|
| 2026-08-17 | Confirmed website name as "The Dreams" | User explicit confirmation | Yes |
| 2026-08-17 | Selected Muted Gold `#C9A15A` as single accent color | Matches premium editorial design requirement | Yes |

---

## 5. Known Constraints
- Frontend AND backend must stay Node.js only — no React/Vue/Django.
- Primary database must remain a local SQL DB (SQLite).
- Design must stay monochromatic with a single accent color (`#C9A15A`).
- Plugin-style extensibility for future modules.
- Single-admin account for Sakshi (`sakshibansal425@gmail.com`).
