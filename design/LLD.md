# DeltaCode - Low-Level Design (LLD)

## 1. Backend Package Structure

```text
app/
├── main.py
│
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
│   │   └── user.py
│   ├── schemas/
│   ├── repositories/
│   │   └── user_repository.py
│   ├── services/
│   │   └── user_service.py
│   └── routes.py
│
├── questions/
│   ├── models/
│   │   ├── question.py
│   │   └── mcq.py
│   ├── schemas/
│   │   ├── base.py
│   │   ├── mcq.py
│   │   ├── response.py
│   │   ├── filter.py
│   │   └── question_summary.py
│   ├── repositories/
│   │   └── question_repository.py
│   ├── services/
│   │   └── question_service.py
│   ├── dependencies.py
│   └── routes.py
│
├── assessments/
├── candidates/
├── attempts/
├── results/
└── ai/
```

---

## 2. Core Enums

```text
QuestionType
├── MCQ
├── CODING
└── SUBJECTIVE

Difficulty
├── EASY
├── MEDIUM
└── HARD

Subject
├── JAVA
├── PYTHON
├── SQL
└── APTITUDE

UserRole
├── ADMIN
└── CANDIDATE
```

The application currently implements MCQ, but the question type enum intentionally allows future types.

---

## 3. Question Domain Model

### Question

```text
Question
├── id
├── question_text
├── question_type
├── subject
├── difficulty
├── marks
├── is_active
├── created_at
└── updated_at
```

### MCQQuestion

```text
MCQQuestion
├── question_id
├── option_a
├── option_b
├── option_c
├── option_d
└── correct_option
```

Relationship:

```text
Question 1 ───────── 1 MCQQuestion
```

The question type determines which detail model is applicable.

Future:

```text
Question
   │
   ├── MCQQuestion
   ├── CodingQuestion
   └── SubjectiveQuestion
```

---

## 4. Question Creation Flow

```text
POST /questions
       │
       ▼
MCQQuestionCreate
       │
       ▼
QuestionRoute
       │
       ▼
QuestionService.create_mcq_question()
       │
       ├── Validate business rules
       │
       ├── Create Question
       │
       ├── Flush Question
       │
       ├── Create MCQQuestion using question.id
       │
       ├── Commit transaction
       │
       └── Return response
       │
       ▼
MCQQuestionResponse
```

A single service operation owns the transaction. Repositories do not commit independently.

---

## 5. Question Listing Flow

```text
GET /questions
       │
       ├── page
       ├── size
       ├── search
       ├── subject
       ├── difficulty
       └── question_type
       │
       ▼
QuestionFilter
       │
       ▼
QuestionService.list_questions()
       │
       ▼
QuestionRepository.list_questions()
       │
       ├── Build filtered query
       ├── Count matching rows
       ├── Order
       ├── OFFSET
       └── LIMIT
       │
       ▼
(list[Question], total)
       │
       ▼
QuestionSummaryResponse
       │
       ▼
PageResponse
```

---

## 6. Pagination

Formula:

```text
offset = (page - 1) * size
```

Example:

```text
page=1, size=10 → offset=0
page=2, size=10 → offset=10
page=3, size=10 → offset=20
```

Database performs pagination using:

```sql
ORDER BY created_at DESC
OFFSET :offset
LIMIT :size
```

The API returns:

```json
{
  "items": [],
  "page": 1,
  "size": 10,
  "total": 75,
  "total_pages": 8
}
```

---

## 7. Question API Contract

### Create

```text
POST /questions
```

Request:

```json
{
  "question_text": "Which collection stores key-value pairs?",
  "question_type": "MCQ",
  "subject": "JAVA",
  "difficulty": "EASY",
  "marks": 2,
  "option_a": "ArrayList",
  "option_b": "HashMap",
  "option_c": "Stack",
  "option_d": "Queue",
  "correct_option": "B"
}
```

### List

```text
GET /questions?page=1&size=10&subject=JAVA&difficulty=EASY
```

### Planned detail endpoint

```text
GET /questions/{question_id}
```

This endpoint should return the full MCQ detail.

### Planned update

```text
PUT /questions/{question_id}
```

### Planned delete

```text
DELETE /questions/{question_id}
```

Deletion should eventually use soft-delete semantics where appropriate.

---

## 8. Assessment Model

```text
Assessment
├── id
├── title
├── description
├── duration_minutes
├── total_questions
├── status
├── starts_at
├── ends_at
├── created_by
├── created_at
└── updated_at
```

Assessment status:

```text
DRAFT
PUBLISHED
CLOSED
ARCHIVED
```

---

## 9. Assessment ↔ Question

An assessment can contain many questions, and a question can potentially be reused across assessments.

Therefore:

```text
Assessment 1 ─────── * AssessmentQuestion * ─────── 1 Question
```

`AssessmentQuestion`:

```text
AssessmentQuestion
├── assessment_id
├── question_id
├── question_order
└── marks_override (optional)
```

For randomized assessments, the selected question set/order should be persisted once the candidate starts the attempt. This prevents the question set from changing during an active attempt.

---

## 10. Candidate Model

```text
Candidate
├── id
├── name
├── email
├── phone (optional)
├── employee/student identifier
├── created_at
└── updated_at
```

Candidate identity should be separated from the authentication/user model where appropriate.

---

## 11. Attempt Model

```text
Attempt
├── id
├── assessment_id
├── candidate_id
├── started_at
├── submitted_at
├── status
├── score
└── created_at
```

Attempt status:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
EXPIRED
```

---

## 12. Candidate Answer Model

```text
AttemptAnswer
├── id
├── attempt_id
├── question_id
├── selected_option
├── is_correct
├── marks_awarded
└── answered_at
```

For MCQ:

```text
selected_option = A | B | C | D
```

The backend must perform final scoring rather than trusting a client-provided score.

---

## 13. Result Flow

```text
Candidate submits
       │
       ▼
AttemptService
       │
       ▼
Load answers + correct answers
       │
       ▼
ScoringService
       │
       ▼
Calculate score
       │
       ▼
Persist result
       │
       ▼
Return result
```

The client should never be allowed to submit:

```text
score = 100
```

and have the backend trust it.

---

## 14. AI Module LLD

AI should be isolated behind an interface.

```text
AI Detection Interface
        │
        ├── RuleBasedDetector
        ├── MLDetector
        └── LLM/ModelDetector
```

Initial POC can use a simple anomaly scoring implementation.

Input:

```text
CandidateActivity
├── focus_changes
├── tab_switches
├── question_time_distribution
├── answer_change_count
├── interruptions
└── other approved signals
```

Output:

```text
AnomalyResult
├── risk_score
├── risk_level
├── signals
└── explanation
```

Example:

```json
{
  "risk_score": 0.82,
  "risk_level": "HIGH",
  "signals": [
    "frequent_focus_changes",
    "unusual_answer_timing"
  ]
}
```

The AI output is a **review signal**, not an automatic cheating verdict.

---

## 15. Repository Responsibilities

Repositories:
- Build database queries.
- Apply filters.
- Perform pagination.
- Load related entities.
- Persist entities.
- Do not contain business decisions.

Example:

```text
QuestionRepository
├── create()
├── get_by_id()
├── list_questions()
├── update()
└── soft_delete()
```

---

## 16. Service Responsibilities

Services:
- Business rules.
- Transaction orchestration.
- Cross-repository operations.
- Validation that depends on business context.
- Scoring.
- Random question selection.
- Assessment lifecycle.

Example:

```text
AssessmentService
├── create_assessment()
├── publish_assessment()
├── start_attempt()
├── select_questions()
└── close_assessment()
```

---

## 17. Transaction Strategy

Preferred pattern:

```text
Route
  ↓
Service
  ├── Repository operation
  ├── Repository operation
  └── Repository operation
  ↓
Commit
```

Repositories should not independently commit.

This ensures a multi-table business operation either succeeds completely or rolls back.

---

## 18. Error Handling

Use domain-specific exceptions:

```text
QuestionNotFoundError
AssessmentNotFoundError
AssessmentClosedError
AttemptAlreadySubmittedError
InvalidQuestionTypeError
```

Routes convert them into HTTP responses.

Example:

```text
QuestionNotFoundError
        ↓
404 Not Found
```

Business logic remains independent of HTTP-specific exceptions.

---

## 19. Validation

### Pydantic
Used for:
- Request validation.
- Response serialization.
- Enum validation.
- Pagination constraints.

### Database
Used for:
- Primary keys.
- Foreign keys.
- NOT NULL constraints.
- Unique constraints.
- Enum/data integrity where appropriate.

### Service
Used for:
- Business rules.

Example:

```text
Question marks > 0
Assessment duration > 0
Candidate cannot submit an already submitted attempt
```

---

## 20. Testing Strategy

```text
Unit Tests
   │
   ├── Services
   ├── Validators
   └── AI scoring logic
        │
        ▼
Integration Tests
   │
   ├── Repository + PostgreSQL
   ├── API + database
   └── Authentication
        │
        ▼
End-to-End Tests
   │
   └── Complete assessment flow
```

Priority for the POC:
1. Authentication tests.
2. Question creation/list/detail tests.
3. Assessment creation tests.
4. Candidate attempt tests.
5. Scoring tests.
6. AI anomaly detection tests.

---

## 21. Production-Oriented Decisions

- Keep the system as a modular monolith initially.
- Avoid microservices until there is a demonstrated need.
- Keep AI behind an abstraction.
- Persist assessment question sets for reproducibility.
- Perform scoring server-side.
- Use database-level constraints for integrity.
- Use pagination at database level.
- Avoid returning database models directly from APIs.
- Use dedicated response DTOs for list/detail endpoints.
- Add indexes based on actual query patterns.
