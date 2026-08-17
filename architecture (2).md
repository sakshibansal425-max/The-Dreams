# Architecture Document
## Project: ExamSaathi

**Owner:** Sakshi Bansal · sakshibansal425@gmail.com
**Version:** 1.0

All diagrams below are written in **Mermaid** syntax — they render automatically on GitHub, Notion, Obsidian, and most modern Markdown viewers/VS Code extensions.

---

## 1. High-Level System Diagram (1D — Linear Request Flow)

A simple, linear view of how a single request travels through the system.

```mermaid
flowchart LR
    A[Student Browser] -->|HTTPS Request| B[Node.js + Express Server]
    B -->|Renders View / Serves API| C[EJS Views / Static Frontend]
    B -->|Query/Write| D[(SQLite Database)]
    B -->|Sends Event| E[Google Analytics GA4]
    C -->|Response| A
```

---

## 2. Layered Architecture Diagram (2D — System Layers)

A layered view showing how components stack and depend on each other.

```mermaid
flowchart TB
    subgraph Client Layer
        A1[Public Pages: Home/About/Services/Contact/Exam Directory]
        A2[Admin Panel UI]
        A3[Chatbot Widget]
    end

    subgraph Application Layer - Node.js/Express
        B1[Public Routes/Controllers]
        B2[Admin Routes/Controllers - Auth Protected]
        B3[Chatbot Service - rule-based v1]
        B4[Contact Form Service]
        B5[Middleware: Auth, Validation, Rate Limiting]
    end

    subgraph Data Layer
        C1[(SQLite via Prisma/Sequelize ORM)]
        C2[Exams / Subjects / Books Tables]
        C3[Contact Submissions Table]
        C4[Admin Users Table]
        C5[Feature Flags Table]
    end

    subgraph External Services
        D1[Google Analytics GA4]
        D2[Future: Chroma/FAISS Vector Store for RAG chatbot]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
    B1 --> B4
    B1 --> C1
    B2 --> C1
    B3 --> C2
    B4 --> C3
    B2 --> C4
    B1 --> C5
    A1 -.-> D1
    B3 -.future.-> D2
    B5 --> B1
    B5 --> B2
```

---

## 3. Entity Relationship Diagram (ER Diagram)

```mermaid
erDiagram
    EXAM {
        int id PK
        string name
        string category
        string min_qualification
        string frequency
        string description
        datetime created_at
    }
    SUBJECT {
        int id PK
        string name
    }
    BOOK {
        int id PK
        string title
        string author
        string link
    }
    EXAM_SUBJECT {
        int id PK
        int exam_id FK
        int subject_id FK
    }
    SUBJECT_BOOK {
        int id PK
        int subject_id FK
        int book_id FK
    }
    PREP_LEVEL {
        int id PK
        string level_name
        string description
    }
    EXAM_PREP_LEVEL {
        int id PK
        int exam_id FK
        int prep_level_id FK
    }
    CONTACT_SUBMISSION {
        int id PK
        string name
        string email
        string subject
        string message
        boolean is_read
        datetime submitted_at
    }
    ADMIN_USER {
        int id PK
        string email
        string password_hash
        datetime last_login
    }
    FEATURE_FLAG {
        int id PK
        string key
        boolean enabled
    }

    EXAM ||--o{ EXAM_SUBJECT : has
    SUBJECT ||--o{ EXAM_SUBJECT : belongs_to
    SUBJECT ||--o{ SUBJECT_BOOK : recommends
    BOOK ||--o{ SUBJECT_BOOK : recommended_in
    EXAM ||--o{ EXAM_PREP_LEVEL : maps_to
    PREP_LEVEL ||--o{ EXAM_PREP_LEVEL : contains
    ADMIN_USER ||--o{ CONTACT_SUBMISSION : reviews
```

---

## 4. Enhanced Entity Relationship Diagram (EER — with attribute detail & specialization)

The EER extends the ER model by showing that `EXAM` can specialize into different **posting types**, capturing the "Major Posts" and "Exam Frequency" nuance from the exam data table, plus optional attributes for future extensibility.

```mermaid
erDiagram
    EXAM {
        int id PK
        string name
        string category "SSC / UPSC / RRB / IBPS / State / Police"
        string min_qualification
        string frequency
        string official_link "nullable, added later"
        boolean is_active
    }
    EXAM_POST {
        int id PK
        int exam_id FK
        string post_name
        string post_level "Group A/B/C/D"
    }
    EXAM_PATTERN {
        int id PK
        int exam_id FK
        string stage_name "Tier 1 / Tier 2 / PET / Interview"
        string stage_order
    }
    CURRENT_AFFAIRS_POST {
        int id PK
        string title
        text content
        datetime published_at
        string tag "future module"
    }

    EXAM ||--o{ EXAM_POST : offers
    EXAM ||--o{ EXAM_PATTERN : has_stages
    EXAM ||--o{ CURRENT_AFFAIRS_POST : "tagged_in (future)"
```

> **Note:** `CURRENT_AFFAIRS_POST` is intentionally included as a "future module" entity to demonstrate the schema can grow without breaking existing tables — new tables link back to `EXAM` via foreign keys rather than modifying it.

---

## 5. User Flow Diagram

### 5.1 Student Visitor Flow

```mermaid
flowchart TD
    Start([Student lands on Home]) --> Hero[Views Hero + Value Prop]
    Hero --> Choice{What do they want?}
    Choice -->|Explore Exams| Dir[Exam Directory - filter by qualification/category]
    Choice -->|Learn about platform| About[About Us / Information About Me]
    Choice -->|Has a question| Chat[Opens Sidebar Chatbot]
    Choice -->|Wants to reach out| Contact[Contact Us Page]

    Dir --> Detail[Exam Detail Page]
    Detail --> Books[Views Subjects + Book Recommendations]
    Books --> CTA{Still has doubts?}
    CTA -->|Yes| Chat
    CTA -->|Yes| Contact

    Chat --> Resolved{Answer helpful?}
    Resolved -->|Yes| End1([Continues browsing])
    Resolved -->|No| Contact

    Contact --> Form[Fills Name/Email/Message]
    Form --> Submit[Submits Form]
    Submit --> DB[(Stored in SQLite)]
    Submit --> Confirm[Sees confirmation message]
    Confirm --> End2([Session ends / continues browsing])
```

### 5.2 Admin Flow

```mermaid
flowchart TD
    A([Admin visits /admin]) --> B[Login Page]
    B --> C{Credentials valid?}
    C -->|No| B
    C -->|Yes| D[Admin Dashboard]
    D --> E[View Contact Submissions List]
    D --> F[Manage Exam Data - Add/Edit/Delete]
    D --> G[Toggle Feature Flags]
    E --> H[Mark as Read/Archived]
    F --> I[(Writes to SQLite)]
    G --> I
```

---

## 6. Extensibility Notes (ties back to PRD Section 2.4)
- All new pages/features (e.g., Mock Tests, Blog, Current Affairs) are added as **new Express route modules** + **new Prisma models**, following the same pattern as `EXAM` — no existing table needs to change.
- The **Feature Flag** table lets the admin panel turn modules on/off without a redeploy.
- If the project later migrates from SQLite to **Supabase/Postgres**, only the Prisma `datasource` config changes — schema and application code stay the same.
- If a **graph-based recommendation feature** is added later (e.g., "exams similar to this one"), it can run as a separate **Neo4j** instance fed from the same SQLite data via a sync job, without disrupting the core app.
