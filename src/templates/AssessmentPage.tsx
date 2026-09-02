import { useEffect, useState } from "react";
import type { Assessment } from "../data/assessments";
import { questions } from "../data/questions";
import Layout from "../components/Layout";
import "../styles/AssessmentPage.css";

type AssessmentPageProps = {
    assessment: Assessment;
    onNavigate: (screen: string) => void;
};

function AssessmentPage({
    assessment,
    onNavigate,
}: AssessmentPageProps) {
    const assessmentQuestions = questions.filter((question) => 
        assessment.questionIds.includes(question.id)
    );

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [timeRemaining, setTimeRemaining] = useState(
        assessment.durationMinutes * 60
    );

    useEffect(() => {
        if (timeRemaining <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((previousTime) => previousTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;

    const[answers, setAnswers] = useState<Record<number, string>>({});

    const currentQuestion = assessmentQuestions[currentQuestionIndex];

    const handleAnswerSelect = (answer: string) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: answer,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < assessmentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        let score = 0;
        let correctAnswers = 0;

        assessmentQuestions.forEach((question) => {
            const selectedAnswer = answers[question.id];

            if (selectedAnswer === question.correctAnswer) {
                score += question.marks;
                correctAnswers++;
            }
         });

        const totalMarks = assessmentQuestions.reduce(
            (total, question) => total + question.marks,
            0
        );

        onNavigate(
            `result-${score}-${totalMarks}-${correctAnswers}-${assessmentQuestions.length}`
        );
    };

    return (
        <Layout role="Candidate">
            <div className="assessment-page-header">
                <div>
                    <h1 className="assessment-page-title">
                    {assessment.title}
                    </h1>

                    <p className="question-counter">
                    Question {currentQuestionIndex + 1} of{" "}
                    {assessmentQuestions.length}
                    </p>
                </div>

                <div className="timer">
                    ⏱ {formattedTime}
                </div>
            </div>

            <div className="progress-container">
                <div className="progress-info">
                    <span>Assessment Progress</span>

                    <span>
                    {Math.round(
                        ((currentQuestionIndex + 1) /
                        assessmentQuestions.length) *
                        100
                    )}%
                    </span>
                </div>

                <div className="progress-bar">
                    <div
                    className="progress-fill"
                    style={{
                        width: `${
                        ((currentQuestionIndex + 1) /
                            assessmentQuestions.length) *
                        100
                        }%`,
                    }}
                    />
                </div>
            </div>

            <div className="question-card">
                <p className="question-label">
                    QUESTION {currentQuestionIndex + 1}
                </p>

                <h2 className="question-text">
                    {currentQuestion.text}
                </h2>

                <div className="options-container">
                    {currentQuestion.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index);

                        return (
                        <button
                            key={option}
                            type="button"
                            className={`option ${
                            answers[currentQuestion.id] === option
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleAnswerSelect(option)}
                        >
                            <span className="option-letter">
                            {optionLetter}
                            </span>

                            <span>{option}</span>
                        </button>
                        );
                    })}
                </div>
            </div>

            <hr />

            <div className="assessment-navigation">

                <button
                    className="nav-button"
                    disabled={currentQuestionIndex === 0}
                    onClick={handlePrevious}
                >
                    ← Previous
                </button>

                {currentQuestionIndex ===
                assessmentQuestions.length - 1 ? (

                    <button
                    className="submit-button"
                    onClick={handleSubmit}
                    >
                    Submit Assessment
                    </button>

                ) : (

                    <button
                    className="nav-button"
                    onClick={handleNext}
                    >
                    Next →
                    </button>

                )}

            </div>

            <p>
                Answered:{" "}
                {
                Object.keys(answers).length
                }{" "}
                / {assessmentQuestions.length}
            </p>
        </Layout>
    );
}

export default AssessmentPage;