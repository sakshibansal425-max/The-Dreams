# AI Working Memory
## Project: ExamSaathi

**Purpose:** This file is meant to be read by an AI assistant (Claude/Claude Code or similar) at the start of every work session on this project. Update it at the **end of every phase or work session** so the AI never loses context, even across separate chats/sessions. Keep entries factual and short — this is a state tracker, not a diary.

---

## 0. How to Use This File (instructions for the AI)
1. At the start of a session, read this whole file before writing any code.
2. Cross-check "Current Phase" against `phase.md` to know what's next.
3. After completing meaningful work, append a dated entry under the current phase's log — do not delete prior entries.
4. If a decision changes something in `prd.md`, `architecture.md`, or `design.md`, note it under **Section 4 — Decisions Log**, and update the source doc too.
5. Never assume — if something in this file conflicts with the actual codebase, trust the codebase and flag the mismatch to the user.

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
> Add a new entry each time work is done. Format: `### [Date] — Phase X — <short title>`

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
- None. All open questions answered by user.

**Next step:**
- Phase 7: Deployment to production host (Render/Railway/VPS).

---

## 4. Decisions Log
> Record any decision that deviates from or adds to `prd.md` / `architecture.md` / `design.md`. Keeps the docs and the actual build in sync.

| Date | Decision | Reason | Doc updated? |
|---|---|---|---|
| 2026-08-17 | Confirmed website name as "The Dreams" | User explicit confirmation | Yes |
| 2026-08-17 | Selected Muted Gold `#C9A15A` as single accent color | Matches premium editorial design requirement | Yes |


---

## 5. Known Constraints (do not violate without asking the user)
- Frontend AND backend must stay Node.js only — no React/Vue/Django/etc.
- Primary database must remain a **local SQL DB (SQLite)** unless the user explicitly approves a migration (e.g., to Supabase).
- Design must stay monochromatic with a single accent color — see `design.md` Section 2.1.
- Every new feature/page must be added in a way that doesn't require rewriting existing modules (plugin-style extensibility — see `architecture.md` Section 6).
- Admin panel is single-admin only (Sakshi) unless told otherwise.

---

## 6. Open Questions (for Sakshi, not yet answered)
- Final site name (currently placeholder "ExamSaathi")
- Accent color choice: muted gold `#C9A15A` vs muted steel-blue `#4A90A4` (see `design.md` 2.1)
- Hosting provider for Phase 7 (Render vs Railway vs VPS)
- Whether a real photo will be used on "Information About Me" page

---

## 7. Quick Glossary (for AI context, avoid re-deriving each time)
- **Prep Level 1–4:** Foundation → 12th-level → Graduation-level → Advanced, as defined in `prd.md`/exam data
- **Feature Flag:** DB-stored boolean toggle controlling whether a module (e.g., chatbot) is active
- **RAG chatbot:** Future-only concept — not built in v1; v1 chatbot is rule-based/keyword-matched
