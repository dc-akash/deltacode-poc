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
  const publishedAssessments = assessments.filter(
    (assessment) => assessment.status === "Published"
  ).length;

  const draftAssessments = assessments.filter(
    (assessment) => assessment.status !== "Published"
  ).length;

  return (
    <Layout role="Admin">
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <div className="dashboard-eyebrow">
              ADMIN OVERVIEW
            </div>

            <h1 className="dashboard-title">
              Assessment Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Manage assessments, question banks and candidate
              evaluation workflows from one place.
            </p>
          </div>

          <div className="dashboard-actions">
            <button
              className="dashboard-secondary-button"
              onClick={() => onNavigate("question-bank")}
            >
              <span className="button-icon">
                ◫
              </span>
              Question Bank
            </button>

            <button
              className="dashboard-primary-button"
              onClick={() => onNavigate("create-assessment")}
            >
              <span className="button-plus">
                +
              </span>
              Create Assessment
            </button>

            <button
              className="dashboard-primary-button"
              onClick={() => onNavigate("assessment-results")}
            >
              <span className="button-plus">
                +
              </span>
              Results
            </button>
          </div>
        </div>

        <div className="dashboard-welcome-card">
          <div className="welcome-content">
            <span className="welcome-label">
              DELTACODE
            </span>

            <h2>
              Ready for your next hiring drive?
            </h2>

            <p>
              Create assessments, manage your question bank and
              monitor candidate participation from the dashboard.
            </p>

            <button
              className="welcome-action"
              onClick={() => onNavigate("create-assessment")}
            >
              Create new assessment
              <span>→</span>
            </button>
          </div>

          <div className="welcome-visual">
            <div className="welcome-stat welcome-stat-one">
              <span>Published</span>
              <strong>{publishedAssessments}</strong>
            </div>

            <div className="welcome-stat welcome-stat-two">
              <span>Drafts</span>
              <strong>{draftAssessments}</strong>
            </div>

            <div className="welcome-circle welcome-circle-large" />
            <div className="welcome-circle welcome-circle-small" />
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Questions"
            value={25}
            subtitle="Available in question bank"
            icon="?"
            trend="+8 this month"
          />

          <StatCard
            title="Assessments"
            value={assessments.length}
            subtitle={`${publishedAssessments} currently published`}
            icon="▤"
            trend="+2 recently"
          />

          <StatCard
            title="Candidates"
            value={42}
            subtitle="Across all assessments"
            icon="◎"
            trend="+12 new"
          />

          <StatCard
            title="Attempts"
            value={87}
            subtitle="Total assessment attempts"
            icon="↗"
            trend="74% completion"
          />
        </div>

        <div className="dashboard-main-grid">
          <section className="assessment-section">
            <div className="section-header">
              <div>
                <div className="section-label">
                  ASSESSMENTS
                </div>

                <h2 className="section-title">
                  Recent Assessments
                </h2>
              </div>

              <button
                className="text-button"
                onClick={() => onNavigate("create-assessment")}
              >
                Create new
                <span>→</span>
              </button>
            </div>

            <div className="assessment-list">
              {assessments.length > 0 ? (
                assessments.map((assessment, index) => {
                  const progress =
                    assessment.status === "Published"
                      ? Math.min(45 + index * 12, 92)
                      : 0;

                  return (
                    <div
                      className="assessment-card"
                      key={assessment.id}
                    >
                      <div className="assessment-card-main">
                        <div className="assessment-icon">
                          {index + 1}
                        </div>

                        <div className="assessment-content">
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
                              <span className="status-dot-small" />
                              {assessment.status}
                            </span>
                          </div>

                          <div className="assessment-meta">
                            <div className="assessment-meta-item">
                              <span className="meta-label">
                                Duration
                              </span>

                              <strong>
                                {assessment.durationMinutes} min
                              </strong>
                            </div>

                            <div className="assessment-meta-divider" />

                            <div className="assessment-meta-item">
                              <span className="meta-label">
                                Questions
                              </span>

                              <strong>
                                {assessment.questionIds.length}
                              </strong>
                            </div>

                            <div className="assessment-meta-divider" />

                            <div className="assessment-meta-item">
                              <span className="meta-label">
                                Completion
                              </span>

                              <strong>
                                {assessment.status === "Published"
                                  ? `${progress}%`
                                  : "—"}
                              </strong>
                            </div>
                          </div>

                          {assessment.status === "Published" && (
                            <div className="assessment-progress">
                              <div className="assessment-progress-track">
                                <div
                                  className="assessment-progress-value"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        className="assessment-menu-button"
                        aria-label="Assessment options"
                      >
                        •••
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="dashboard-empty-state">
                  <div className="empty-state-icon">
                    +
                  </div>

                  <h3>
                    No assessments yet
                  </h3>

                  <p>
                    Create your first assessment to start
                    evaluating candidates.
                  </p>

                  <button
                    onClick={() =>
                      onNavigate("create-assessment")
                    }
                  >
                    Create Assessment
                  </button>
                </div>
              )}
            </div>
          </section>

          <aside className="dashboard-sidebar">
            <div className="dashboard-side-card">
              <div className="side-card-header">
                <div>
                  <span className="section-label">
                    WORKSPACE
                  </span>

                  <h3>
                    Quick Actions
                  </h3>
                </div>
              </div>

              <div className="quick-actions-list">
                <button
                  className="quick-action"
                  onClick={() =>
                    onNavigate("create-assessment")
                  }
                >
                  <span className="quick-action-icon">
                    +
                  </span>

                  <span className="quick-action-content">
                    <strong>
                      New Assessment
                    </strong>

                    <small>
                      Create and configure an assessment
                    </small>
                  </span>

                  <span className="quick-action-arrow">
                    →
                  </span>
                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    onNavigate("question-bank")
                  }
                >
                  <span className="quick-action-icon">
                    ?
                  </span>

                  <span className="quick-action-content">
                    <strong>
                      Question Bank
                    </strong>

                    <small>
                      Manage assessment questions
                    </small>
                  </span>

                  <span className="quick-action-arrow">
                    →
                  </span>
                </button>

                <button className="quick-action">
                  <span className="quick-action-icon">
                    ◎
                  </span>

                  <span className="quick-action-content">
                    <strong>
                      Candidate Results
                    </strong>

                    <small>
                      Review scores and performance
                    </small>
                  </span>

                  <span className="quick-action-arrow">
                    →
                  </span>
                </button>
              </div>
            </div>

            <div className="dashboard-side-card activity-card">
              <div className="side-card-header">
                <div>
                  <span className="section-label">
                    ACTIVITY
                  </span>

                  <h3>
                    Recent Activity
                  </h3>
                </div>

                <span className="activity-live">
                  Live
                </span>
              </div>

              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-marker">
                    <span />
                  </div>

                  <div>
                    <p>
                      Java Assessment was published
                    </p>

                    <span>
                      12 minutes ago
                    </span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-marker">
                    <span />
                  </div>

                  <div>
                    <p>
                      8 candidates completed an assessment
                    </p>

                    <span>
                      45 minutes ago
                    </span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-marker">
                    <span />
                  </div>

                  <div>
                    <p>
                      5 questions added to Question Bank
                    </p>

                    <span>
                      2 hours ago
                    </span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-marker">
                    <span />
                  </div>

                  <div>
                    <p>
                      New assessment draft created
                    </p>

                    <span>
                      Yesterday
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-side-card overview-card">
              <span className="section-label">
                ASSESSMENT STATUS
              </span>

              <div className="overview-row">
                <div>
                  <span className="overview-dot published-dot" />
                  Published
                </div>

                <strong>
                  {publishedAssessments}
                </strong>
              </div>

              <div className="overview-row">
                <div>
                  <span className="overview-dot draft-dot" />
                  Draft
                </div>

                <strong>
                  {draftAssessments}
                </strong>
              </div>

              <div className="overview-total">
                <span>
                  Total Assessments
                </span>

                <strong>
                  {assessments.length}
                </strong>
              </div>
            </div>
          </aside>
        </div>

        <div className="dashboard-footer-action">
          <button
            className="back-button"
            onClick={() => onNavigate("landing")}
          >
            <span>←</span>
            Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;