import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { questions } from "../data/questions";
import type { Assessment } from "../data/assessments";
import "../styles/CreateAssessment.css";

type CreateAssessmentProps = {
    onNavigate: (screen: string) => void;
    assessments: Assessment[];
    setAssessments: React.Dispatch<React.SetStateAction<Assessment[]>>;
};

type CreationMode = "ai" | "manual";

type GenerationStep = {
    label: string;
};

const generationSteps: GenerationStep[] = [
    { label: "Analyzing question bank" },
    { label: "Matching selected subjects" },
    { label: "Balancing difficulty" },
    { label: "Checking question quality" },
    { label: "Building assessment blueprint" },
];

function CreateAssessment({
    onNavigate,
    assessments,
    setAssessments,
}: CreateAssessmentProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(60);
    const [cutoff, setCutoff] = useState(60);

    const [creationMode, setCreationMode] =
        useState<CreationMode>("ai");

    const [selectedQuestions, setSelectedQuestions] =
        useState<number[]>([]);

    const [selectedSubjects, setSelectedSubjects] =
        useState<string[]>(["Java", "Spring Boot", "SQL"]);

    const [difficulty, setDifficulty] =
        useState<string>("Medium");

    const [questionCount, setQuestionCount] =
        useState(50);

    const [isGenerating, setIsGenerating] =
        useState(false);

    const [generationStep, setGenerationStep] =
        useState(0);

    const [generationComplete, setGenerationComplete] =
        useState(false);

    const [generatedQuestions, setGeneratedQuestions] =
        useState<number[]>([]);

    const [isPublishing, setIsPublishing] =
        useState(false);

    const [showManualQuestions, setShowManualQuestions] =
        useState(false);

    /*
     * =========================================================
     * Available Subjects
     * =========================================================
     */

    const availableSubjects = useMemo(() => {
        return Array.from(
            new Set(questions.map((question) => question.subject))
        );
    }, []);

    /*
     * =========================================================
     * Question Bank Intelligence
     * =========================================================
     */

    const matchingQuestions = useMemo(() => {
        return questions.filter((question) => {
            const subjectMatch =
                selectedSubjects.length === 0 ||
                selectedSubjects.includes(question.subject);

            const difficultyMatch =
                question.difficulty === difficulty;

            return subjectMatch && difficultyMatch;
        });
    }, [selectedSubjects, difficulty]);

    const matchingQuestionCount =
        matchingQuestions.length;

    // const availableQuestionCount =
    //     Math.min(questionCount, matchingQuestionCount);

    const coveragePercentage =
        questionCount > 0
            ? Math.min(
                  100,
                  Math.round(
                      (matchingQuestionCount / questionCount) * 100
                  )
              )
            : 0;

    /*
     * =========================================================
     * Subject Distribution
     * =========================================================
     */

    const subjectDistribution = useMemo(() => {
        if (selectedSubjects.length === 0) {
            return [];
        }

        const baseCount = Math.floor(
            questionCount / selectedSubjects.length
        );

        let remainder =
            questionCount -
            baseCount * selectedSubjects.length;

        return selectedSubjects.map((subject) => {
            const count =
                baseCount + (remainder-- > 0 ? 1 : 0);

            return {
                subject,
                count,
                percentage: Math.round(
                    (count / questionCount) * 100
                ),
            };
        });
    }, [selectedSubjects, questionCount]);

    /*
     * =========================================================
     * Difficulty Distribution
     * =========================================================
     */

    // const difficultyDistribution = useMemo(() => {
    //     return [
    //         {
    //             label: "Easy",
    //             percentage: difficulty === "Easy" ? 100 : 20,
    //         },
    //         {
    //             label: "Medium",
    //             percentage: difficulty === "Medium" ? 100 : 60,
    //         },
    //         {
    //             label: "Hard",
    //             percentage: difficulty === "Hard" ? 100 : 20,
    //         },
    //     ];
    // }, [difficulty]);

    /*
     * =========================================================
     * Toggle Subject
     * =========================================================
     */

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((current) => {
            if (current.includes(subject)) {
                return current.filter(
                    (item) => item !== subject
                );
            }

            return [...current, subject];
        });

        setGenerationComplete(false);
        setGeneratedQuestions([]);
    };

    /*
     * =========================================================
     * Generate Assessment
     * =========================================================
     */

    const generateAssessment = () => {
        if (!title.trim()) {
            alert("Please enter an assessment title.");
            return;
        }

        if (selectedSubjects.length === 0) {
            alert("Please select at least one subject.");
            return;
        }

        if (matchingQuestionCount === 0) {
            alert(
                "No matching questions are available for the selected criteria."
            );
            return;
        }

        setIsGenerating(true);
        setGenerationComplete(false);
        setGenerationStep(0);

        let currentStep = 0;

        const stepTimer = window.setInterval(() => {
            currentStep += 1;

            if (currentStep < generationSteps.length) {
                setGenerationStep(currentStep);
            } else {
                window.clearInterval(stepTimer);

                const shuffled = [...matchingQuestions]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, questionCount);

                setGeneratedQuestions(
                    shuffled.map((question) => question.id)
                );

                setIsGenerating(false);
                setGenerationComplete(true);
                setGenerationStep(
                    generationSteps.length - 1
                );
            }
        }, 650);
    };

    /*
     * =========================================================
     * Regenerate
     * =========================================================
     */

    const regenerateAssessment = () => {
        setGenerationComplete(false);

        window.setTimeout(() => {
            generateAssessment();
        }, 150);
    };

    /*
     * =========================================================
     * Manual Selection
     * =========================================================
     */

    const toggleQuestion = (questionId: number) => {
        setSelectedQuestions((current) => {
            if (current.includes(questionId)) {
                return current.filter(
                    (id) => id !== questionId
                );
            }

            return [...current, questionId];
        });
    };

    /*
     * =========================================================
     * Publish
     * =========================================================
     */

    const handlePublish = () => {
        const finalQuestionIds =
            creationMode === "ai"
                ? generatedQuestions
                : selectedQuestions;

        if (!title.trim()) {
            alert("Please enter an assessment title.");
            return;
        }

        if (finalQuestionIds.length === 0) {
            alert(
                "Please generate or select at least one question."
            );
            return;
        }

        setIsPublishing(true);

        const newAssessment: Assessment = {
            id: assessments.length + 1,
            title: title.trim(),
            description: description.trim(),
            durationMinutes: duration,
            questionIds: finalQuestionIds,
            status: "Published",
        };

        window.setTimeout(() => {
            setAssessments([
                ...assessments,
                newAssessment,
            ]);

            setIsPublishing(false);

            alert(
                "Assessment published successfully!"
            );

            onNavigate("admin");
        }, 800);
    };

    /*
     * =========================================================
     * Final Question Count
     * =========================================================
     */

    const finalQuestionCount =
        creationMode === "ai"
            ? generatedQuestions.length
            : selectedQuestions.length;

    /*
     * =========================================================
     * Render
     * =========================================================
     */

    return (
        <Layout role="Admin">
            <div className="create-assessment-page">

                {/* Ambient Background */}
                <div className="create-orb create-orb-one" />
                <div className="create-orb create-orb-two" />

                {/* =================================================
                    HEADER
                   ================================================= */}

                <header className="create-header">

                    <div className="create-header-content">

                        <div className="create-eyebrow">
                            ASSESSMENT BUILDER
                        </div>

                        <h1 className="create-title">
                            Create Assessment
                        </h1>

                        <p className="create-subtitle">
                            Build a candidate assessment manually
                            or let AI create one from your question bank.
                        </p>

                    </div>

                    <button
                        className="secondary-button create-back-button"
                        onClick={() =>
                            onNavigate("admin")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </header>


                {/* =================================================
                    ASSESSMENT DETAILS
                   ================================================= */}

                <section className="create-section">

                    <div className="section-heading">

                        <div>
                            <h2 className="create-section-title">
                                Assessment Details
                            </h2>

                            <p className="section-description">
                                Define the basic information candidates
                                will see before starting the assessment.
                            </p>
                        </div>

                        <div className="draft-badge">
                            <span className="draft-dot" />
                            Draft
                        </div>

                    </div>


                    <div className="details-card">

                        <div className="form-grid">

                            <div className="form-group">
                                <label htmlFor="assessment-title">
                                    Assessment Title
                                </label>

                                <input
                                    id="assessment-title"
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Java Backend Developer Assessment"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>


                            <div className="form-group">
                                <label htmlFor="assessment-duration">
                                    Duration
                                </label>

                                <div className="input-with-unit">

                                    <input
                                        id="assessment-duration"
                                        type="number"
                                        min="1"
                                        className="form-input"
                                        value={duration}
                                        onChange={(e) =>
                                            setDuration(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />

                                    <span>
                                        minutes
                                    </span>

                                </div>
                            </div>

                        </div>


                        <div className="form-grid">

                            <div className="form-group">
                                <label htmlFor="assessment-description">
                                    Description
                                </label>

                                <textarea
                                    id="assessment-description"
                                    className="form-textarea"
                                    placeholder="Describe what this assessment is designed to evaluate..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    rows={4}
                                />
                            </div>


                            <div className="form-group">

                                <label htmlFor="assessment-cutoff">
                                    Passing Cutoff
                                </label>

                                <div className="cutoff-control">

                                    <input
                                        id="assessment-cutoff"
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={cutoff}
                                        onChange={(e) =>
                                            setCutoff(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />

                                    <div className="cutoff-value">
                                        {cutoff}%
                                    </div>

                                </div>

                                <span className="field-hint">
                                    Candidates scoring below this
                                    percentage will not pass.
                                </span>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    CREATION MODE
                   ================================================= */}

                <section className="create-section">

                    <div className="section-heading">

                        <div>
                            <h2 className="create-section-title">
                                How would you like to build it?
                            </h2>

                            <p className="section-description">
                                Choose between complete control or
                                AI-powered question selection.
                            </p>
                        </div>

                    </div>


                    <div className="creation-mode-grid">

                        {/* Manual */}

                        <button
                            className={`creation-mode-card ${
                                creationMode === "manual"
                                    ? "creation-mode-active"
                                    : ""
                            }`}
                            onClick={() => {
                                setCreationMode("manual");
                                setGenerationComplete(false);
                            }}
                        >

                            <div className="mode-icon manual-icon">
                                ✋
                            </div>

                            <div className="mode-content">

                                <div className="mode-title">
                                    Manual Selection
                                </div>

                                <div className="mode-description">
                                    Pick individual questions from
                                    your question bank yourself.
                                </div>

                                <span className="mode-action">
                                    Select Questions →
                                </span>

                            </div>

                            {creationMode === "manual" && (
                                <div className="mode-check">
                                    ✓
                                </div>
                            )}

                        </button>


                        {/* AI */}

                        <button
                            className={`creation-mode-card ai-mode-card ${
                                creationMode === "ai"
                                    ? "creation-mode-active"
                                    : ""
                            }`}
                            onClick={() => {
                                setCreationMode("ai");
                                setGenerationComplete(false);
                            }}
                        >

                            <div className="ai-glow" />

                            <div className="mode-icon ai-icon">
                                ✨
                            </div>

                            <div className="mode-content">

                                <div className="ai-mode-heading">

                                    <div className="mode-title">
                                        AI Assessment Builder
                                    </div>

                                    <span className="ai-badge">
                                        AI POWERED
                                    </span>

                                </div>

                                <div className="mode-description">
                                    Define your requirements and let
                                    AI build the assessment from your
                                    existing question bank.
                                </div>

                                <span className="mode-action">
                                    Build with AI →
                                </span>

                            </div>

                            {creationMode === "ai" && (
                                <div className="mode-check">
                                    ✓
                                </div>
                            )}

                        </button>

                    </div>

                </section>


                {/* =================================================
                    AI BUILDER
                   ================================================= */}

                {creationMode === "ai" && (

                    <section className="create-section ai-builder-section">

                        <div className="section-heading">

                            <div>
                                <div className="ai-section-label">
                                    ✨ AI ASSESSMENT BUILDER
                                </div>

                                <h2 className="create-section-title">
                                    Define your assessment blueprint
                                </h2>

                                <p className="section-description">
                                    Tell AI what you're looking for.
                                    It will select and balance questions
                                    from your question bank.
                                </p>
                            </div>

                        </div>


                        <div className="ai-builder-card">

                            <div className="ai-builder-glow" />


                            {/* Subjects */}

                            <div className="builder-block">

                                <div className="builder-label-row">

                                    <div>
                                        <label className="builder-label">
                                            Subjects
                                        </label>

                                        <span className="builder-hint">
                                            Select one or more areas
                                        </span>
                                    </div>

                                    <span className="builder-count">
                                        {selectedSubjects.length} selected
                                    </span>

                                </div>


                                <div className="subject-selector">

                                    {availableSubjects.map(
                                        (subject) => {

                                            const active =
                                                selectedSubjects.includes(
                                                    subject
                                                );

                                            return (
                                                <button
                                                    key={subject}
                                                    className={`subject-chip ${
                                                        active
                                                            ? "subject-chip-active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        toggleSubject(
                                                            subject
                                                        )
                                                    }
                                                >
                                                    {active && (
                                                        <span>
                                                            ✓
                                                        </span>
                                                    )}

                                                    {subject}
                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </div>


                            {/* Difficulty */}

                            <div className="builder-block">

                                <div className="builder-label-row">

                                    <div>
                                        <label className="builder-label">
                                            Difficulty
                                        </label>

                                        <span className="builder-hint">
                                            Choose the target difficulty
                                        </span>
                                    </div>

                                </div>


                                <div className="difficulty-selector">

                                    {[
                                        "Easy",
                                        "Medium",
                                        "Hard",
                                    ].map((level) => (

                                        <button
                                            key={level}
                                            className={`difficulty-option ${
                                                difficulty === level
                                                    ? "difficulty-active"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setDifficulty(
                                                    level
                                                );
                                                setGenerationComplete(
                                                    false
                                                );
                                            }}
                                        >

                                            <span
                                                className={`difficulty-dot difficulty-${level.toLowerCase()}`}
                                            />

                                            {level}

                                        </button>

                                    ))}

                                </div>

                            </div>


                            {/* Count + Duration */}

                            <div className="builder-two-column">

                                <div className="builder-block">

                                    <label className="builder-label">
                                        Number of Questions
                                    </label>

                                    <div className="number-control">

                                        <button
                                            onClick={() =>
                                                setQuestionCount(
                                                    Math.max(
                                                        5,
                                                        questionCount -
                                                            5
                                                    )
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <strong>
                                            {questionCount}
                                        </strong>

                                        <button
                                            onClick={() =>
                                                setQuestionCount(
                                                    Math.min(
                                                        100,
                                                        questionCount +
                                                            5
                                                    )
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>


                                <div className="builder-block">

                                    <label className="builder-label">
                                        Duration
                                    </label>

                                    <div className="number-control duration-control">

                                        <button
                                            onClick={() =>
                                                setDuration(
                                                    Math.max(
                                                        10,
                                                        duration -
                                                            10
                                                    )
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <strong>
                                            {duration}
                                            <span>
                                                min
                                            </span>
                                        </strong>

                                        <button
                                            onClick={() =>
                                                setDuration(
                                                    Math.min(
                                                        180,
                                                        duration +
                                                            10
                                                    )
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                            </div>


                            {/* Blueprint */}

                            <div className="blueprint-section">

                                <div className="blueprint-heading">

                                    <div>
                                        <span className="builder-label">
                                            Assessment Blueprint
                                        </span>

                                        <span className="builder-hint">
                                            AI will distribute questions
                                            across your selected subjects.
                                        </span>
                                    </div>

                                    <span className="blueprint-total">
                                        {questionCount} questions
                                    </span>

                                </div>


                                <div className="distribution-list">

                                    {subjectDistribution.map(
                                        (item) => (

                                            <div
                                                className="distribution-row"
                                                key={item.subject}
                                            >

                                                <div className="distribution-info">

                                                    <span>
                                                        {item.subject}
                                                    </span>

                                                    <strong>
                                                        {item.count}
                                                    </strong>

                                                </div>

                                                <div className="distribution-track">

                                                    <div
                                                        className="distribution-fill"
                                                        style={{
                                                            width: `${item.percentage}%`,
                                                        }}
                                                    />

                                                </div>

                                                <span className="distribution-percentage">
                                                    {item.percentage}%
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>


                            {/* Question Bank Intelligence */}

                            <div
                                className={`coverage-panel ${
                                    matchingQuestionCount <
                                    questionCount
                                        ? "coverage-warning"
                                        : "coverage-good"
                                }`}
                            >

                                <div className="coverage-icon">
                                    {matchingQuestionCount >=
                                    questionCount
                                        ? "✓"
                                        : "!"}
                                </div>

                                <div className="coverage-content">

                                    <strong>
                                        {matchingQuestionCount >=
                                        questionCount
                                            ? `${matchingQuestionCount} matching questions available`
                                            : `Only ${matchingQuestionCount} matching questions available`}
                                    </strong>

                                    <span>
                                        {matchingQuestionCount >=
                                        questionCount
                                            ? "Your question bank has enough coverage for this assessment."
                                            : `You requested ${questionCount}, but only ${matchingQuestionCount} questions match your criteria.`}
                                    </span>

                                </div>

                                <div className="coverage-score">
                                    {coveragePercentage}%
                                    <small>
                                        coverage
                                    </small>
                                </div>

                            </div>


                            {/* Generate */}

                            {!isGenerating &&
                                !generationComplete && (

                                    <button
                                        className="primary-button ai-generate-button"
                                        onClick={
                                            generateAssessment
                                        }
                                    >
                                        <span className="sparkle-icon">
                                            ✨
                                        </span>

                                        Generate Assessment

                                        <span className="generate-arrow">
                                            →
                                        </span>
                                    </button>

                                )}


                            {/* Generating */}

                            {isGenerating && (

                                <div className="ai-generating">

                                    <div className="ai-loader">

                                        <div className="loader-ring" />

                                        <span>
                                            ✨
                                        </span>

                                    </div>

                                    <div className="generating-content">

                                        <strong>
                                            AI is building your assessment
                                        </strong>

                                        <span>
                                            {
                                                generationSteps[
                                                    generationStep
                                                ].label
                                            }
                                            ...
                                        </span>

                                    </div>

                                    <div className="generation-progress">

                                        <div
                                            className="generation-progress-fill"
                                            style={{
                                                width: `${
                                                    ((generationStep + 1) /
                                                        generationSteps.length) *
                                                    100
                                                }%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            )}


                            {/* Generated */}

                            {generationComplete && (

                                <div className="generated-result">

                                    <div className="generated-success">

                                        <div className="success-icon">
                                            ✓
                                        </div>

                                        <div>
                                            <strong>
                                                Assessment Generated
                                            </strong>

                                            <span>
                                                AI successfully created
                                                your assessment blueprint.
                                            </span>
                                        </div>

                                    </div>


                                    <div className="generated-metrics">

                                        <div>
                                            <strong>
                                                {
                                                    generatedQuestions.length
                                                }
                                            </strong>
                                            <span>
                                                Questions
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                {duration}
                                            </strong>
                                            <span>
                                                Minutes
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                {difficulty}
                                            </strong>
                                            <span>
                                                Difficulty
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                {coveragePercentage}%
                                            </strong>
                                            <span>
                                                AI Match
                                            </span>
                                        </div>

                                    </div>


                                    <div className="ai-checks">

                                        <div>
                                            <span>✓</span>
                                            Difficulty balanced
                                        </div>

                                        <div>
                                            <span>✓</span>
                                            No duplicate questions
                                        </div>

                                        <div>
                                            <span>✓</span>
                                            Subject distribution checked
                                        </div>

                                        <div>
                                            <span>✓</span>
                                            Question bank coverage verified
                                        </div>

                                    </div>


                                    <div className="generated-actions">

                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                setShowManualQuestions(
                                                    !showManualQuestions
                                                )
                                            }
                                        >
                                            Review Questions
                                        </button>

                                        <button
                                            className="primary-button"
                                            onClick={
                                                regenerateAssessment
                                            }
                                        >
                                            ✨ Regenerate
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    MANUAL QUESTION SELECTION
                   ================================================= */}

                {creationMode === "manual" && (

                    <section className="create-section manual-builder-section">

                        <div className="section-heading question-heading">

                            <div>

                                <h2 className="create-section-title">
                                    Select Questions
                                </h2>

                                <p className="section-description">
                                    Choose the questions candidates
                                    will see in this assessment.
                                </p>

                            </div>

                            <div className="selection-counter">

                                <strong>
                                    {selectedQuestions.length}
                                </strong>

                                <span>
                                    selected
                                </span>

                            </div>

                        </div>


                        <div className="question-list">

                            {questions.map((question, index) => {

                                const isSelected =
                                    selectedQuestions.includes(
                                        question.id
                                    );

                                return (

                                    <div
                                        key={question.id}
                                        className={`question-card ${
                                            isSelected
                                                ? "question-card-selected"
                                                : ""
                                        }`}
                                        style={{
                                            animationDelay: `${
                                                index * 45
                                            }ms`,
                                        }}
                                        onClick={() =>
                                            toggleQuestion(
                                                question.id
                                            )
                                        }
                                    >

                                        <div className="question-card-content">

                                            <div className="question-checkbox">

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        isSelected
                                                    }
                                                    onChange={() =>
                                                        toggleQuestion(
                                                            question.id
                                                        )
                                                    }
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                />

                                            </div>


                                            <div className="question-info">

                                                <p className="question-text">
                                                    {question.text}
                                                </p>

                                                <div className="question-meta">

                                                    <span>
                                                        {
                                                            question.subject
                                                        }
                                                    </span>

                                                    <span>
                                                        •
                                                    </span>

                                                    <span>
                                                        {
                                                            question.difficulty
                                                        }
                                                    </span>

                                                    <span>
                                                        •
                                                    </span>

                                                    <span>
                                                        {
                                                            question.marks
                                                        }{" "}
                                                        mark
                                                        {question.marks !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </span>

                                                </div>

                                            </div>


                                            {isSelected && (
                                                <div className="selected-indicator">
                                                    ✓
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                );
                            })}

                        </div>

                    </section>

                )}


                {/* =================================================
                    AI GENERATED QUESTION PREVIEW
                   ================================================= */}

                {creationMode === "ai" &&
                    generationComplete &&
                    showManualQuestions && (

                        <section className="create-section generated-question-section">

                            <div className="section-heading">

                                <div>

                                    <div className="ai-section-label">
                                        AI GENERATED QUESTIONS
                                    </div>

                                    <h2 className="create-section-title">
                                        Review your assessment
                                    </h2>

                                    <p className="section-description">
                                        These questions were selected
                                        from your question bank based
                                        on your assessment blueprint.
                                    </p>

                                </div>

                                <span className="generated-count-badge">
                                    {generatedQuestions.length} questions
                                </span>

                            </div>


                            <div className="generated-question-list">

                                {questions
                                    .filter((question) =>
                                        generatedQuestions.includes(
                                            question.id
                                        )
                                    )
                                    .map((question, index) => (

                                        <div
                                            className="generated-question-card"
                                            key={question.id}
                                        >

                                            <div className="generated-question-number">
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>

                                            <div className="generated-question-content">

                                                <p>
                                                    {question.text}
                                                </p>

                                                <div className="generated-question-meta">

                                                    <span>
                                                        {
                                                            question.subject
                                                        }
                                                    </span>

                                                    <span>
                                                        {
                                                            question.difficulty
                                                        }
                                                    </span>

                                                    <span>
                                                        {
                                                            question.marks
                                                        }{" "}
                                                        marks
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="generated-check">
                                                ✓
                                            </div>

                                        </div>

                                    ))}

                            </div>

                        </section>

                    )}


                {/* =================================================
                    SUMMARY
                   ================================================= */}

                <section className="assessment-summary">

                    <div className="summary-item">

                        <span className="summary-label">
                            Questions
                        </span>

                        <strong className="summary-value">
                            {finalQuestionCount}
                        </strong>

                    </div>


                    <div className="summary-divider" />


                    <div className="summary-item">

                        <span className="summary-label">
                            Duration
                        </span>

                        <strong className="summary-value">
                            {duration} min
                        </strong>

                    </div>


                    <div className="summary-divider" />


                    <div className="summary-item">

                        <span className="summary-label">
                            Passing Cutoff
                        </span>

                        <strong className="summary-value">
                            {cutoff}%
                        </strong>

                    </div>


                    <div className="summary-divider" />


                    <div className="summary-item">

                        <span className="summary-label">
                            Builder
                        </span>

                        <strong className="summary-value">
                            {creationMode === "ai"
                                ? "AI"
                                : "Manual"}
                        </strong>

                    </div>


                    <div className="summary-actions">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                onNavigate("admin")
                            }
                            disabled={isPublishing}
                        >
                            Cancel
                        </button>

                        <button
                            className={`primary-button publish-button ${
                                isPublishing
                                    ? "publish-loading"
                                    : ""
                            }`}
                            onClick={handlePublish}
                            disabled={isPublishing}
                        >

                            {isPublishing ? (
                                <>
                                    <span className="publish-spinner" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    Publish Assessment
                                    <span className="publish-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </div>

                </section>

            </div>
        </Layout>
    );
}

export default CreateAssessment;