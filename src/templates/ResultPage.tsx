type ResultPageProps = {
    score: number;
    totalMarks: number;
    correctAnswers: number;
    totalQuestions: number;
    onNavigate: (screen: string) => void;
};

function ResultPage({
    score,
    totalMarks,
    correctAnswers,
    totalQuestions,
    onNavigate,
}: ResultPageProps) {
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    const incorrectAnswers = totalQuestions - correctAnswers;

    return (
        <div>
            <h1>Assessment Result</h1>

            <hr />

            <h2>
                Score: {score} / {totalMarks}
            </h2>

            <h3>Percentage: {percentage}%</h3>

            <p>
                Correct Answers: {" "}
                <strong>{correctAnswers}</strong>
            </p>

            <p>
                Incorrect / Unanswered: {" "}
                <strong>{incorrectAnswers}</strong>
            </p>

            <hr />

            <h2>Assessment Completed</h2>

            <button onClick={() => onNavigate("candidate")}>
                Back to Dashboard
            </button>
        </div>
    );
}

export default ResultPage;