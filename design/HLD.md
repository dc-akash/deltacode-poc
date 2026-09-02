# DeltaCode - High-Level Design (HLD)

## 1. Purpose

DeltaCode is an internal online assessment platform for company placement drives. The initial POC supports MCQ-based assessments and is designed so additional question types and AI capabilities can be added later.

### Primary goals
- Reduce dependency on generic external assessment platforms.
- Provide an internal question bank and assessment workflow.
- Randomly select questions for candidates.
- Provide secure candidate authentication and assessment attempts.
- Add AI-assisted cheating/anomaly detection in a later phase.
- Keep the implementation production-oriented while remaining lightweight for the POC.

---

## 2. Scope

### Phase 1 / POC
- Admin authentication and role-based access.
- Candidate registration/details.
- Question bank.
- MCQ questions.
- Question creation and listing.
- Assessment creation.
- Randomized question selection.
- Assessment timer.
- Candidate submission.
- Automatic MCQ scoring.
- Result viewing.
- Basic audit information.

### Future extensions
- Coding questions.
- Subjective/written questions.
- Excel question import.
- AI-generated/question-quality assistance.
- AI-assisted cheating/anomaly detection.
- Advanced analytics and dashboards.
- Notifications/integrations.

---

## 3. High-Level Architecture

```text
                           ┌──────────────────────────┐
                           │        Admin UI          │
                           │ React + TypeScript/Vite  │
                           └────────────┬─────────────┘
                                        │ HTTPS
                                        │
                           ┌────────────▼─────────────┐
                           │      Candidate UI        │
                           │ React + TypeScript/Vite  │
                           └────────────┬─────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       FastAPI Backend        │
                         │                              │
                         │  Authentication / RBAC       │
                         │  Question Bank               │
                         │  Assessment                  │
                         │  Candidate / Attempt         │
                         │  Result / Scoring            │
                         │  AI Integration              │
                         └──────────────┬───────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
             ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
             │ PostgreSQL  │    │ AI Service   │    │ File/Object │
             │             │    │ Python       │    │ Storage     │
             │ Application │    │ AI models    │    │ Excel/etc.  │
             │ data        │    │ anomaly      │    │             │
             └─────────────┘    │ detection    │    └─────────────┘
                                └─────────────┘
```

---

## 4. Backend Layered Architecture

```text
API / Presentation Layer
        │
        ▼
Routes / Controllers
        │
        ▼
Schemas / DTOs
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
SQLAlchemy ORM
        │
        ▼
PostgreSQL
```

### Responsibilities

**Routes**
- HTTP endpoints.
- Request/response handling.
- Authentication/authorization dependencies.
- Convert domain exceptions to HTTP responses.

**Schemas**
- Request validation.
- Response contracts.
- Pagination/filter DTOs.
- Prevent direct exposure of database models.

**Services**
- Business logic.
- Assessment rules.
- Question selection.
- Scoring.
- Transaction boundaries where appropriate.

**Repositories**
- Database access.
- Filtering.
- Pagination.
- CRUD queries.
- No business rules.

**Models**
- SQLAlchemy persistence models.
- Relationships.
- Database constraints.

---

## 5. Technology Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

### Database
- PostgreSQL

### Authentication/Security
- JWT
- Password hashing
- Role-based access control
- HTTPS in deployed environments

### AI
- Python
- Local/open-source model or organization-approved AI service
- AI inference isolated behind a service/interface so the core application is not tightly coupled to one model

### Testing
- Pytest
- FastAPI test client
- Integration tests for database flows

### DevOps
- Git
- Docker
- CI/CD pipeline
- Environment-based configuration

---

## 6. Core Application Modules

```text
app/
├── core/
│   ├── config.py
│   ├── security.py
│   ├── enums.py
│   └── pagination.py
│
├── db/
│   ├── base.py
│   ├── session.py
│   └── migrations/
│
├── users/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── routes.py
│
├── questions/
│   ├── models/
│   │   ├── question.py
│   │   └── mcq.py
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── routes.py
│
├── assessments/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── routes.py
│
├── candidates/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── routes.py
│
├── attempts/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── routes.py
│
├── results/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── routes.py
│
└── ai/
    ├── interfaces/
    ├── services/
    ├── models/
    └── routes.py
```

---

## 7. Assessment Flow

```text
Admin
  │
  ▼
Create Assessment
  │
  ├── Set title
  ├── Set duration
  ├── Configure question count
  └── Configure filters/question pool
  │
  ▼
Publish Assessment
  │
  ▼
Candidate starts assessment
  │
  ▼
System creates Attempt
  │
  ▼
Questions selected/randomized
  │
  ▼
Candidate answers MCQs
  │
  ▼
Submit / Timer expires
  │
  ▼
Scoring Service
  │
  ▼
Result
```

---

## 8. AI Cheating Detection - Planned Architecture

AI should not directly decide that a candidate is cheating.

Instead, the system should collect multiple signals and produce an anomaly/risk score.

```text
Candidate Activity
       │
       ├── Tab/window events
       ├── Focus changes
       ├── Unusual answer timing
       ├── Rapid question switching
       ├── Repeated patterns
       └── Optional approved proctoring signals
                    │
                    ▼
             Signal Collector
                    │
                    ▼
              Feature Builder
                    │
                    ▼
             AI/ML Detector
                    │
                    ▼
             Risk / Anomaly Score
                    │
                    ▼
             Admin Review Queue
```

The initial AI POC should focus on explainable anomaly detection rather than automated punishment.

Example:

```text
Candidate: C102
Risk score: 0.82

Signals:
- 17 focus changes
- 8 unusually fast answers
- Repeated answer timing pattern
- Multiple assessment interruptions

Recommendation:
Manual review required
```

---

## 9. Security Architecture

```text
Client
  │
  │ HTTPS
  ▼
FastAPI
  │
  ├── JWT validation
  ├── Role authorization
  ├── Input validation
  ├── Rate limiting (future)
  └── Audit logging
       │
       ▼
   PostgreSQL
```

Important principles:
- Passwords are never stored in plaintext.
- Passwords are sent only during authentication over HTTPS.
- JWT signatures prevent payload tampering.
- Sensitive configuration is stored outside source code.
- Admin APIs require authorization.
- Candidate access is restricted to their own attempts/results.
- AI signals should be treated as sensitive assessment data.

---

## 10. Deployment - Target

```text
                    Internet / Corporate Network
                              │
                              ▼
                       Reverse Proxy
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
          Frontend Static              FastAPI
             Assets                    Backend
                                           │
                                  ┌────────┴────────┐
                                  ▼                 ▼
                              PostgreSQL        AI Service
```

For the POC, these components can be deployed together or run locally. Production deployment should separate application, database, and AI workloads as required by organizational policy.

---

## 11. Scalability Path

The initial POC should remain simple. If adoption grows:

1. Add database indexes based on real query patterns.
2. Add connection pooling/tuning.
3. Introduce Redis for caching/session-related workloads where justified.
4. Move long-running AI processing to background workers.
5. Add object storage for uploaded files.
6. Separate AI inference from the main API.
7. Introduce observability and centralized logging.
8. Scale API instances horizontally.

---

## 12. Design Principles

- Modular monolith first.
- Clear separation of concerns.
- Database access through repositories.
- Business logic in services.
- Request/response contracts through Pydantic schemas.
- Prefer composition for question-type extensions.
- Avoid premature microservices.
- AI should be an independent capability, not tightly coupled to core assessment logic.
- Build for future question types without implementing unnecessary complexity today.
