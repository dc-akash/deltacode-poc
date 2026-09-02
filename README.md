# DeltaCode POC

A frontend proof of concept for an internal online assessment platform.

The purpose of this POC is to demonstrate the core workflow of the proposed **DeltaCode / DeltaCode assessment platform** before building the full production architecture.

## Features

### Admin Flow

* Admin dashboard
* Question bank
* Add new MCQ questions
* Create assessments
* Select questions for an assessment
* Configure assessment duration
* Publish assessments

### Candidate Flow

* View available published assessments
* Start an assessment
* Answer MCQ questions
* Navigate between questions
* Track answered questions
* Countdown timer
* Submit assessment
* Automatic scoring
* View assessment results

## Current Workflow

```text
                    DeltaCode
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
        Admin                     Candidate
          │                           │
          ▼                           ▼
    Admin Dashboard          Available Assessments
          │                           │
    ┌─────┴────────┐                  ▼
    ▼              ▼           Start Assessment
Question Bank  Create Assessment       │
    │              │                   ▼
Add Questions  Select Questions     Answer MCQs
                   │                   │
                   ▼                   ▼
                Publish              Submit
                                       │
                                       ▼
                                Automatic Scoring
                                       │
                                       ▼
                                   Result Screen
```

## Technology Stack

* React
* TypeScript
* Vite
* Node.js

## POC Architecture

The current version intentionally uses frontend state and static/mock data.

```text
React Application
       │
       ├── Static Questions
       │
       ├── In-Memory Assessments
       │
       ├── Candidate Answers
       │
       └── Automatic Scoring
```

No backend or database is currently required to run the POC.

The future production architecture can evolve toward:

```text
React Frontend
       │
       ▼
FastAPI Backend
       │
       ▼
Service Layer
       │
       ▼
PostgreSQL Database
       │
       ▼
AI / Anomaly Detection
```

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed.

```bash
node --version
npm --version
```

### Install dependencies

```bash
npm install
```

### Start the application

```bash
npm run dev
```

The application will be available on the localhost URL shown in the terminal.

## Project Structure

```text
deltacode-poc/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   └── StatCard.tsx
│   │
│   ├── data/
│   │   ├── assessments.ts
│   │   └── questions.ts
│   │
│   ├── templates/
│   │   ├── AdminDashboard.tsx
│   │   ├── AssessmentPage.tsx
│   │   ├── CandidateDashboard.tsx
│   │   ├── CreateAssessment.tsx
│   │   ├── QuestionBank.tsx
│   │   └── ResultPage.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
└── README.md
```

## POC Limitations

This is a workflow demonstration and is not intended to be production-ready.

Current limitations include:

* No backend API
* No database persistence
* No real authentication
* Data resets on browser refresh
* Assessment data is stored in frontend memory
* No server-side validation
* No production security controls

## Future Enhancements

* FastAPI backend
* PostgreSQL database
* JWT authentication
* Role-based access control
* Persistent question bank
* Persistent assessments and attempts
* Candidate registration
* Server-side scoring
* Automatic submission when the timer expires
* AI-assisted anomaly detection
* Tab and focus change monitoring
* Admin review dashboard
* Excel question import

## Purpose

The goal of this POC is to quickly validate and demonstrate the complete assessment workflow to stakeholders before investing in the full production implementation.
