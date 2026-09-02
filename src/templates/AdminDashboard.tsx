import StatCard from "../components/StatCard";
import Layout from "../components/Layout";
import type { Assessment } from "../data/assessments";
import "../styles/AdminDashboard.css";

type AdminDashboardProps = {
  assessments: Assessment[];
  onNavigate: (screen: string) => void;
};

function AdminDashboard({
  assessments,
  onNavigate,
}: AdminDashboardProps) {
  return (
    <Layout role="Admin">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Assessment Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage assessments, questions and candidate
            evaluation workflows.
          </p>
        </div>

        <div className="dashboard-actions">
          <button
            className="secondary-button"
            onClick={() => onNavigate("question-bank")}
          >
            Question Bank
          </button>

          <button
            className="primary-button"
            onClick={() => onNavigate("create-assessment")}
          >
            + Create Assessment
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Questions"
          value={25}
        />

        <StatCard
          title="Assessments"
          value={assessments.length}
        />

        <StatCard
          title="Candidates"
          value={42}
        />

        <StatCard
          title="Attempts"
          value={87}
        />
      </div>

      <section className="assessment-section">
        <h2 className="section-title">
          Assessments
        </h2>

        <div className="assessment-list">
          {assessments.map((assessment) => (
            <div
              className="assessment-card"
              key={assessment.id}
            >
              <div className="assessment-card-top">
                <div>
                  <h3 className="assessment-title">
                    {assessment.title}
                  </h3>

                  <p className="assessment-description">
                    {assessment.description}
                  </p>
                </div>

                <span
                  className={`status-badge ${
                    assessment.status === "Published"
                      ? "status-published"
                      : "status-draft"
                  }`}
                >
                  {assessment.status.toUpperCase()}
                </span>
              </div>

              <div className="assessment-meta">
                {assessment.durationMinutes} minutes
                {" • "}
                {assessment.questionIds.length} questions
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: "40px" }}>
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

export default AdminDashboard;