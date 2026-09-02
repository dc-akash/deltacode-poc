import { useState } from "react";
import Layout from "../components/Layout";
import { questions } from "../data/questions";
import type { Assessment } from "../data/assessments";
import "../styles/CreateAssessment.css";

type CreateAssessmentProps = {
    onNavigate: (screen: string) => void;
    assessments: Assessment[];
    setAssessments: React.Dispatch<React.SetStateAction<Assessment[]>>;
};

function CreateAssessment({
    onNavigate,
    assessments,
    setAssessments,
}: CreateAssessmentProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(10);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

    const toggleQuestion = (questionId: number) => {
        if (selectedQuestions.includes(questionId)) {
            setSelectedQuestions(
                selectedQuestions.filter((id) => id !== questionId)
            );
        } else {
            setSelectedQuestions([
                ...selectedQuestions,
                questionId,
            ]);
        }
    };

    const handlePublish = () => {
        if (!title.trim() || selectedQuestions.length === 0) {
            alert(
                "Please enter a title and select at least one question."
            );
            return;
        }

        const newAssessment: Assessment = {
            id: assessments.length + 1,
            title: title.trim(),
            description: description.trim(),
            durationMinutes: duration,
            questionIds: selectedQuestions,
            status: "Published",
        };

        setAssessments([...assessments, newAssessment]);

        alert("Assessment published successfully!");

        onNavigate("admin");
    };

    return (
        <Layout role="Admin">
            <div className="create-assessment-page">

                {/* Page Header */}
                <div className="create-header">
                    <div>
                        <h1 className="create-title">
                            Create Assessment
                        </h1>

                        <p className="create-subtitle">
                            Create and publish an assessment by defining
                            its details and selecting questions.
                        </p>
                    </div>

                    <button
                        className="secondary-button"
                        onClick={() => onNavigate("admin")}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Assessment Details */}
                <section className="create-section">
                    <div className="section-heading">
                        <div>
                            <h2 className="create-section-title">
                                Assessment Details
                            </h2>

                            <p className="section-description">
                                Provide the basic information for this assessment.
                            </p>
                        </div>
                    </div>

                    <div className="details-card">

                        <div className="form-group">
                            <label htmlFor="assessment-title">
                                Assessment Title
                            </label>

                            <input
                                id="assessment-title"
                                type="text"
                                className="form-input"
                                placeholder="e.g. Java Fundamentals Assessment"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="assessment-description">
                                Description
                            </label>

                            <textarea
                                id="assessment-description"
                                className="form-textarea"
                                placeholder="Describe the purpose of this assessment..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows={4}
                            />
                        </div>

                        <div className="form-group duration-group">
                            <label htmlFor="assessment-duration">
                                Duration
                            </label>

                            <div className="duration-input-wrapper">
                                <input
                                    id="assessment-duration"
                                    type="number"
                                    className="form-input duration-input"
                                    min="1"
                                    value={duration}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);

                                        if (value >= 1 || e.target.value === "") {
                                            setDuration(value);
                                        }
                                    }}
                                />

                                <span className="duration-unit">
                                    minutes
                                </span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Question Selection */}
                <section className="create-section">

                    <div className="section-heading question-heading">
                        <div>
                            <h2 className="create-section-title">
                                Select Questions
                            </h2>

                            <p className="section-description">
                                Choose the questions candidates will see in this assessment.
                            </p>
                        </div>

                        <div className="selection-counter">
                            <span className="counter-number">
                                {selectedQuestions.length}
                            </span>

                            <span className="counter-label">
                                selected
                            </span>
                        </div>
                    </div>

                    <div className="question-list">
                        {questions.map((question) => {
                            const isSelected =
                                selectedQuestions.includes(question.id);

                            return (
                                <div
                                    key={question.id}
                                    className={`question-card ${
                                        isSelected
                                            ? "question-card-selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleQuestion(question.id)
                                    }
                                >
                                    <div className="question-card-content">

                                        <div className="question-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    toggleQuestion(question.id)
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
                                                    {question.subject}
                                                </span>

                                                <span className="meta-separator">
                                                    •
                                                </span>

                                                <span>
                                                    {question.difficulty}
                                                </span>

                                                <span className="meta-separator">
                                                    •
                                                </span>

                                                <span>
                                                    {question.marks} mark
                                                    {question.marks !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </section>

                {/* Assessment Summary */}
                <section className="assessment-summary">

                    <div className="summary-item">
                        <span className="summary-label">
                            Selected Questions
                        </span>

                        <strong className="summary-value">
                            {selectedQuestions.length}
                        </strong>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-item">
                        <span className="summary-label">
                            Duration
                        </span>

                        <strong className="summary-value">
                            {duration || 0} minutes
                        </strong>
                    </div>

                    <div className="summary-actions">
                        <button
                            className="secondary-button"
                            onClick={() => onNavigate("admin")}
                        >
                            Cancel
                        </button>

                        <button
                            className="primary-button publish-button"
                            onClick={handlePublish}
                        >
                            Publish Assessment
                        </button>
                    </div>

                </section>

            </div>
        </Layout>
    );
}

export default CreateAssessment;