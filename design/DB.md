# DeltaCode - Planned Database Design

## 1. Database

```text
Database: PostgreSQL
```

The schema below is the planned target structure. The current POC may implement only a subset initially.

---

## 2. Entity Relationship Overview

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Assessment      Audit/ownership
 │
 ▼
AssessmentQuestion
 │
 ▼
Question
 │
 └──────────► MCQQuestion

Candidate
 │
 ▼
Attempt
 │
 └──────────► AttemptAnswer
                  │
                  ▼
               Question
```

More explicitly:

```text
User 1 ─────── * Assessment

Assessment 1 ─────── * AssessmentQuestion * ─────── 1 Question

Question 1 ─────── 1 MCQQuestion

Candidate 1 ─────── * Attempt

Assessment 1 ─────── * Attempt

Attempt 1 ─────── * AttemptAnswer

Question 1 ─────── * AttemptAnswer
```

---

## 3. users

```text
users
├── id                  BIGINT / INTEGER PK
├── name                VARCHAR(...)
├── email               VARCHAR(...) UNIQUE
├── password_hash       VARCHAR(...)
├── role                VARCHAR / ENUM
├── is_active           BOOLEAN
├── created_at          TIMESTAMP WITH TIME ZONE
└── updated_at          TIMESTAMP WITH TIME ZONE
```

Indexes/constraints:
- PK on `id`
- Unique index on `email`
- Index on `role` if required for admin queries
- Index on `is_active` only if query patterns justify it

Passwords are stored only as secure password hashes.

---

## 4. questions

```text
questions
├── id                  BIGINT / INTEGER PK
├── question_text       TEXT NOT NULL
├── question_type       ENUM / VARCHAR NOT NULL
├── subject             ENUM / VARCHAR NOT NULL
├── difficulty          ENUM / VARCHAR NOT NULL
├── marks               INTEGER NOT NULL
├── is_active            BOOLEAN NOT NULL DEFAULT TRUE
├── created_at          TIMESTAMP WITH TIME ZONE
└── updated_at          TIMESTAMP WITH TIME ZONE
```

Current question types:

```text
MCQ
CODING
SUBJECTIVE
```

The POC implements MCQ first.

Recommended indexes:
- `question_type`
- `subject`
- `difficulty`
- `created_at`
- Composite indexes only after observing real query patterns

For search over large question banks, PostgreSQL full-text search or a dedicated search strategy can be considered later.

---

## 5. mcq_questions

Current logical design:

```text
mcq_questions
├── question_id         FK → questions.id
├── option_a            TEXT NOT NULL
├── option_b            TEXT NOT NULL
├── option_c            TEXT NOT NULL
├── option_d            TEXT NOT NULL
└── correct_option      VARCHAR(...)
```

Relationship:

```text
questions.id
      │
      ▼
mcq_questions.question_id
```

The logical relationship is one-to-one.

### Important implementation note

For the current working POC, keep the existing schema/migration stable rather than performing another structural refactor immediately. If the team later approves the shared-primary-key design, `question_id` can become both PK and FK:

```text
mcq_questions
├── question_id PK + FK → questions.id
├── option_a
├── option_b
├── option_c
├── option_d
└── correct_option
```

This change should be handled as a deliberate migration, not as an ad-hoc model change.

---

## 6. assessments

```text
assessments
├── id                  BIGINT / INTEGER PK
├── title               VARCHAR(...) NOT NULL
├── description         TEXT
├── duration_minutes    INTEGER NOT NULL
├── total_questions     INTEGER NOT NULL
├── status              VARCHAR / ENUM NOT NULL
├── starts_at           TIMESTAMP WITH TIME ZONE
├── ends_at             TIMESTAMP WITH TIME ZONE
├── created_by          FK → users.id
├── created_at          TIMESTAMP WITH TIME ZONE
└── updated_at          TIMESTAMP WITH TIME ZONE
```

Statuses:

```text
DRAFT
PUBLISHED
CLOSED
ARCHIVED
```

---

## 7. assessment_questions

This is the junction table between assessments and questions.

```text
assessment_questions
├── assessment_id       FK → assessments.id
├── question_id         FK → questions.id
├── question_order      INTEGER
├── marks_override      INTEGER NULL
└── created_at          TIMESTAMP WITH TIME ZONE
```

Recommended primary key:

```text
PRIMARY KEY (assessment_id, question_id)
```

Recommended indexes:
- `(assessment_id)`
- `(question_id)`

---

## 8. candidates

```text
candidates
├── id                  BIGINT / INTEGER PK
├── name                VARCHAR(...) NOT NULL
├── email               VARCHAR(...)
├── phone               VARCHAR(...)
├── external_identifier VARCHAR(...)
├── created_at          TIMESTAMP WITH TIME ZONE
└── updated_at          TIMESTAMP WITH TIME ZONE
```

A unique constraint on email/external identifier should depend on the company's actual candidate identification process.

---

## 9. attempts

```text
attempts
├── id                  BIGINT / INTEGER PK
├── assessment_id       FK → assessments.id
├── candidate_id        FK → candidates.id
├── started_at          TIMESTAMP WITH TIME ZONE
├── submitted_at        TIMESTAMP WITH TIME ZONE NULL
├── status              VARCHAR / ENUM
├── score               NUMERIC NULL
└── created_at          TIMESTAMP WITH TIME ZONE
```

Statuses:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
EXPIRED
```

Recommended constraint/index:

```text
INDEX (assessment_id, candidate_id)
```

If the business rule is one attempt per candidate per assessment, enforce it with:

```text
UNIQUE (assessment_id, candidate_id)
```

If multiple attempts are allowed later, do not add that constraint.

---

## 10. attempt_answers

```text
attempt_answers
├── id                  BIGINT / INTEGER PK
├── attempt_id          FK → attempts.id
├── question_id         FK → questions.id
├── selected_option     VARCHAR(...)
├── is_correct           BOOLEAN
├── marks_awarded        NUMERIC
└── answered_at          TIMESTAMP WITH TIME ZONE
```

Recommended unique constraint:

```text
UNIQUE (attempt_id, question_id)
```

if one answer per question per attempt is allowed.

This prevents duplicate answers for the same question.

---

## 11. AI Anomaly Results

For the initial POC, AI results can be stored separately from core assessment tables.

```text
ai_anomaly_results
├── id                  BIGINT / INTEGER PK
├── attempt_id          FK → attempts.id
├── risk_score          NUMERIC
├── risk_level          VARCHAR / ENUM
├── model_name          VARCHAR(...)
├── model_version       VARCHAR(...)
├── signals             JSONB
├── explanation         TEXT
├── created_at          TIMESTAMP WITH TIME ZONE
└── updated_at          TIMESTAMP WITH TIME ZONE
```

Example `signals`:

```json
{
  "focus_changes": 17,
  "rapid_answers": 8,
  "interruptions": 3
}
```

This makes the AI layer replaceable without changing the assessment schema.

---

## 12. Optional Activity Events

If the AI POC needs event-level data, use an append-oriented table:

```text
assessment_activity_events
├── id                  BIGINT / INTEGER PK
├── attempt_id          FK → attempts.id
├── event_type          VARCHAR(...)
├── event_timestamp     TIMESTAMP WITH TIME ZONE
├── metadata             JSONB
└── created_at          TIMESTAMP WITH TIME ZONE
```

Possible events:

```text
FOCUS_LOST
FOCUS_GAINED
TAB_SWITCH
QUESTION_OPENED
QUESTION_ANSWERED
QUESTION_CHANGED
ASSESSMENT_INTERRUPTED
ASSESSMENT_RESUMED
```

Do not collect additional surveillance data unless explicitly approved by the organization and required for the use case.

---

## 13. Future CodingQuestion

If coding questions are introduced:

```text
coding_questions
├── question_id         FK → questions.id
├── problem_statement   TEXT
├── input_format        TEXT
├── output_format       TEXT
├── constraints         TEXT
└── starter_code        TEXT
```

Potential future supporting tables:

```text
coding_test_cases
├── id
├── question_id
├── input
├── expected_output
└── is_hidden
```

The assessment/question architecture therefore remains extensible without changing the base `questions` table for every question type.

---

## 14. Future SubjectiveQuestion

```text
subjective_questions
├── question_id         FK → questions.id
├── expected_answer     TEXT
├── evaluation_guidance TEXT
└── max_words           INTEGER NULL
```

AI-assisted evaluation can later be implemented as a separate service rather than embedded in the database model.

---

## 15. Audit Fields

For major business entities, use:

```text
created_at
updated_at
```

For entities requiring lifecycle control:

```text
is_active
```

Do not blindly add every audit column to every extension table. Add fields based on actual lifecycle/reporting requirements.

---

## 16. Referential Integrity

Foreign keys should enforce:

```text
assessment_questions.assessment_id
    → assessments.id

assessment_questions.question_id
    → questions.id

mcq_questions.question_id
    → questions.id

attempts.assessment_id
    → assessments.id

attempts.candidate_id
    → candidates.id

attempt_answers.attempt_id
    → attempts.id

attempt_answers.question_id
    → questions.id

ai_anomaly_results.attempt_id
    → attempts.id
```

Deletion behavior should be deliberately chosen for each relationship. Assessment and attempt history should generally not be physically deleted casually.

---

## 17. Database-Level Integrity Rules

Recommended:
- PK on every main entity.
- FK for relationships.
- NOT NULL for required fields.
- UNIQUE constraints where business identity requires them.
- CHECK constraints where useful.
- Enum/data validation for controlled values.
- Server-side timestamps.
- Transactional multi-table writes.

The database should not rely exclusively on application-level validation.

---

## 18. Planned Indexes

Initial:

```text
users
├── UNIQUE(email)

questions
├── INDEX(created_at)
├── INDEX(subject)
├── INDEX(difficulty)
└── INDEX(question_type)

assessment_questions
├── INDEX(assessment_id)
└── INDEX(question_id)

attempts
└── INDEX(assessment_id, candidate_id)

attempt_answers
├── INDEX(attempt_id)
└── INDEX(question_id)

ai_anomaly_results
└── INDEX(attempt_id)

assessment_activity_events
├── INDEX(attempt_id)
└── INDEX(event_timestamp)
```

Indexes should be reviewed using actual query plans and workload before production scaling.

---

## 19. Data Flow

### Question Creation

```text
API
 ↓
QuestionService
 ↓
QuestionRepository
 ↓
questions
 ↓
MCQQuestionRepository
 ↓
mcq_questions
```

Both writes occur within one transaction.

### Assessment Start

```text
Candidate
 ↓
AttemptService
 ↓
Validate assessment
 ↓
Select/randomize questions
 ↓
Persist attempt/question set
 ↓
Return assessment payload
```

### Submission

```text
Candidate
 ↓
AttemptService
 ↓
Persist answers
 ↓
ScoringService
 ↓
Calculate score
 ↓
Persist result
 ↓
Optional AI analysis
```

---

## 20. Database Evolution

All schema changes should be handled using Alembic migrations.

```text
Model Change
     ↓
alembic revision --autogenerate
     ↓
Review generated migration
     ↓
Test migration
     ↓
alembic upgrade head
```

Never treat autogenerated migrations as automatically correct; inspect them before applying.

---

## 21. POC vs Production

### POC
Implement:

```text
users
questions
mcq_questions
assessments
assessment_questions
candidates
attempts
attempt_answers
ai_anomaly_results
```

Only implement fields actually needed for the POC.

### Production hardening
Later evaluate:
- Audit logging.
- Data retention.
- Encryption requirements.
- Backup/recovery.
- Index tuning.
- Partitioning for high-volume event data.
- Object storage.
- Observability.
- Access controls.
- Data privacy requirements.
