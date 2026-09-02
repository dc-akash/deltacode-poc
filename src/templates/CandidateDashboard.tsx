import Layout from "../components/Layout";
import type { Assessment } from "../data/assessments";
import "../styles/CandidateDashboard.css";

type CandidateDashboardProps = {
  assessments: Assessment[];
  onNavigate: (screen: string) => void;
};

function CandidateDashboard({
  assessments,
  onNavigate,
}: CandidateDashboardProps) {
  const publishedAssessments = assessments.filter(
    (assessment) => assessment.status === "Published"
  );

  return (
    <Layout role="Candidate">
      <div className="candidate-header">
        <h1 className="candidate-title">
          Available Assessments
        </h1>

        <p className="candidate-subtitle">
          Select an assessment and begin when you are ready.
        </p>
      </div>

      <div className="available-assessments">
        {publishedAssessments.map((assessment) => (
          <div
            className="candidate-assessment-card"
            key={assessment.id}
          >
            <div className="candidate-assessment-top">
              <div>
                <h2 className="candidate-assessment-title">
                  {assessment.title}
                </h2>

                <p className="candidate-assessment-description">
                  {assessment.description}
                </p>
              </div>

              <span className="available-badge">
                AVAILABLE
              </span>
            </div>

            <div className="candidate-assessment-footer">
              <div className="assessment-info">
                <span>
                  ⏱ {assessment.durationMinutes} minutes
                </span>

                <span>
                  ◉ {assessment.questionIds.length} questions
                </span>
              </div>

              <button
                className="start-button"
                onClick={() =>
                  onNavigate(`assessment-${assessment.id}`)
                }
              >
                Start Assessment →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="back-section">
        <button
          className="secondary-button"
          onClick={() => onNavigate("landing")}
        >
          ← Back
        </button>
      </div>
    </Layout>
  );
}

export default CandidateDashboard;