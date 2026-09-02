import { useEffect, useState } from "react";
import type { Assessment } from "../data/assessments";
import { questions } from "../data/questions";

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
        <div>
            <h1>{assessment.title}</h1>

            <h2>Time Remaining: {formattedTime}</h2>

            <p>
                Question {currentQuestionIndex + 1} of {" "}
                {assessmentQuestions.length}
            </p>

            <hr />

            <h2>{currentQuestion.text}</h2>

            <div>
                {currentQuestion.options.map((option) => (
                    <div key={option}>
                        <label>
                            <input type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option}
                            checked={
                                answers[currentQuestion.id] === option
                            }
                            onChange={() => handleAnswerSelect(option)}
                            />

                            {" "}

                            {option}
                        </label>
                    </div>
                ))}
            </div>

            <hr />

            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                Previous
            </button>

            {currentQuestionIndex <
            assessmentQuestions.length - 1 ? (
                <button onClick={handleNext}>
                Next Question
                </button>
            ) : (
                <button onClick={handleSubmit}>
                Submit Assessment
                </button>
            )}

            <hr />

            <p>
                Answered:{" "}
                {
                Object.keys(answers).length
                }{" "}
                / {assessmentQuestions.length}
            </p>
        </div>
    );
}

export default AssessmentPage;