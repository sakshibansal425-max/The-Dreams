# Design Document
## Project: ExamSaathi — Monochromatic Premium Parallax Design System

**Owner:** Sakshi Bansal · sakshibansal425@gmail.com
**Version:** 1.0

---

## 1. Design Philosophy
Premium, quiet-confidence, monochromatic. Think "editorial/luxury tech" rather than "colorful edtech." One neutral base + one accent used sparingly = the site feels expensive and focused, never noisy. Parallax is used to create depth and a sense of scroll-driven storytelling, not as decoration.

---

## 2. Global Design Tokens

### 2.1 Color Palette (Monochromatic)
| Token | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#0A0A0A` | Main dark background (hero, footer) |
| `--color-bg-secondary` | `#141414` | Section alternation background |
| `--color-bg-light` | `#FAFAFA` | Light-mode section background |
| `--color-surface` | `#1C1C1C` | Cards, form fields |
| `--color-text-primary` | `#F5F5F5` | Primary text on dark |
| `--color-text-secondary` | `#A3A3A3` | Secondary/muted text |
| `--color-text-inverse` | `#0A0A0A` | Text on light background |
| `--color-border` | `#2A2A2A` | Dividers, card borders |
| `--color-accent` | `#C9A15A` (muted gold) *or* `#4A90A4` (muted steel-blue) | CTA buttons, links, active states — **pick ONE accent and use it everywhere** |

> Rule: Grayscale carries 95% of the UI. The single accent color is reserved for CTAs, active nav states, and key highlights only — never for large fills.

### 2.2 Typography
| Token | Font | Usage |
|---|---|---|
| `--font-display` | "Playfair Display" or "Fraunces" (serif) | Big hero headlines — gives premium/editorial feel |
| `--font-body` | "Inter" or "Sora" (sans-serif) | Body text, UI, forms |
| `--font-mono` | "JetBrains Mono" | Optional — for "Information About Me" code-flavored accents (ties to Sakshi's coding identity) |

**Scale:** `12 / 14 / 16 / 20 / 28 / 40 / 64px` — consistent scale across all pages.

### 2.3 Spacing & Grid
- 8px base spacing unit (`8, 16, 24, 32, 48, 64, 96, 128`)
- Max content width: `1200px`, centered
- Section vertical padding: `96–128px` desktop, `48–64px` mobile

### 2.4 Motion / Parallax Rules
- Hero background moves slower than foreground text on scroll (classic parallax depth)
- Section images/illustrations fade + shift 20–40px vertically on scroll-into-view
- Respect `prefers-reduced-motion` — disable parallax for users who request it
- Max animation duration: 600ms, easing `cubic-bezier(0.16, 1, 0.3, 1)` for a premium "settle" feel

---

## 3. Page-by-Page Design Spec

### 3.1 Home
- **Hero:** Full-viewport dark section, serif headline (e.g., "Your Path to a Government Job, Simplified"), muted subtext, single accent CTA button ("Explore Exams"), subtle parallax background (abstract geometric lines/topographic pattern — no stock photos of people, keeps it monochromatic and premium)
- **Value props row:** 3 columns, icon + short text (Structured Exam Data / Curated Books / Guided by a Fellow Aspirant)
- **Featured Exam Categories:** horizontal scroll or grid of cards (SSC / UPSC / Railways / Banking / Police-State), each card has subtle hover-lift + border-glow in accent color
- **"Why I built this" teaser:** short pull-quote from Sakshi linking to About Me
- **Footer CTA band:** contrasting light section (`--color-bg-light`) breaking the dark monotony once, driving to Contact

### 3.2 About Us
- Mission statement in large serif type
- Timeline/parallax scroll section: "The Problem → The Idea → The Platform"
- Values list (Clarity, Credibility, Accessibility)

### 3.3 Information About Me
- Personal, first-person tone
- Photo/illustration placeholder (monochrome-filtered if a real photo is used, to match palette)
- Sections: Educational background (PSEB 12th), Exam prep journey, Why coding + this project, Skills strip (Node.js, Express, SQL, JS — styled like a minimal tag list, reinforcing portfolio value)
- Link to GitHub/LinkedIn (optional, add later)

### 3.4 Services
- Grid of service cards: Exam Directory / Preparation Levels / Book Recommendations / (Coming Soon: Mock Tests, Current Affairs)
- "Coming Soon" cards styled with reduced opacity + accent-colored badge — visually reinforces the extensibility story

### 3.5 Exam Directory
- Sticky filter bar (Qualification: 10th/12th/Graduation · Category: SSC/UPSC/RRB/Banking/Police/State)
- Table/card hybrid: monochrome cards with exam name, min qualification, frequency badge
- Empty-state and loading-state designed (skeleton loaders in `--color-surface`)

### 3.6 Exam Detail Page
- Header band: exam name, category tag, frequency
- Two-column layout (desktop): left = eligibility/posts/pattern, right = sticky "Subjects to Study" + "Recommended Books" card
- Prep-level badge (Level 1–4) shown prominently, color-coded using tints of the single accent

### 3.7 Preparation Levels Page
- 4 horizontal stacked bands (Level 1 → 4), each expands on scroll (parallax reveal), listing mapped exams per level

### 3.8 Contact Us
- Split layout: left = form (Name, Email, Subject, Message, Submit), right = direct contact info + map/illustration placeholder
- Form fields styled with `--color-surface` background, accent-colored focus ring
- Success/error states: inline, non-intrusive toast at top-right, monochrome with accent icon

### 3.9 Chatbot Widget (Sidebar)
- Fixed bottom-right launcher (circular, dark, accent-colored icon)
- Expands into a panel matching `--color-surface`, serif header, sans body
- Quick-reply buttons for common questions (matches accent outline style)

### 3.10 Admin Panel (Internal — utilitarian, not marketing-styled)
- Simpler light-mode dashboard (`--color-bg-light`), data-table-first
- Sidebar nav: Dashboard / Submissions / Manage Exams / Feature Flags / Logout
- Submissions table: unread rows bolded with a small accent dot indicator

---

## 4. Component Library (Reusable Across Pages)
| Component | Notes |
|---|---|
| `Button` (primary/secondary/ghost) | Primary = accent fill; Secondary = accent outline; Ghost = text only |
| `Card` | Consistent border-radius `12px`, `--color-surface` bg, subtle border |
| `SectionHeading` | Serif, consistent kicker-label + headline pattern used on every page |
| `Badge` | For frequency/category/level tags |
| `FormField` | Consistent label-above, floating-focus-ring style |
| `Navbar` | Transparent over hero, solid `--color-bg-primary` on scroll (sticky) |
| `Footer` | Consistent across all pages — links, email, "Built by Sakshi Bansal" credit |

---

## 5. Consistency Checklist (apply to every new page added later)
- [ ] Uses only tokens from Section 2 (no ad-hoc colors/fonts)
- [ ] Hero/section headings use `--font-display`; body uses `--font-body`
- [ ] Max one accent-colored element per "row" of content (avoid accent overload)
- [ ] Parallax/motion respects `prefers-reduced-motion`
- [ ] Reuses components from Section 4 rather than creating new one-off styles
