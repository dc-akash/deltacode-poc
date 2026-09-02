import Layout from "../components/Layout";
import "../styles/ResultPage.css";

type ResultPageProps = {
  score: number;
  totalMarks: number;
  correctAnswers: number;
  totalQuestions: number;
  onNavigate: (screen: string) => void;
};

function ResultPage({
  onNavigate,
}: ResultPageProps) {
  return (
    <Layout role="Candidate">
      <div className="result-page">

        <div className="result-header">
          <div className="result-icon">
            ✓
          </div>

          <h1 className="result-title">
            Assessment Submitted
          </h1>

          <p className="result-subtitle">
            Your assessment has been successfully submitted.
          </p>
        </div>

        <div className="submission-card">
          <div className="submission-card-content">
            <h2>Thank you for completing the assessment.</h2>

            <p>
              Your responses have been recorded and are now
              under evaluation.
            </p>

            <p>
              You will be informed about the next steps through
              the appropriate communication channel.
            </p>
          </div>
        </div>

        <div className="result-actions">
          <button
            className="result-button"
            onClick={() => onNavigate("candidate")}
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </Layout>
  );
}

export default ResultPage;