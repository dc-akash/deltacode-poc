import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import "../styles/AssessmentResults.css";

type CandidateResult = {
  id: number;
  name: string;
  email: string;
  score: number;
  correct: number;
  total: number;
  timeTaken: string;
  status: "Passed" | "Failed";
  submitted: string;
  integrity: "Low Risk" | "Review";
  skills: {
    java: number;
    spring: number;
    sql: number;
    dsa: number;
  };
};

type AssessmentResultsProps = {
  onNavigate: (screen: string) => void;
};

const candidates: CandidateResult[] = [
  {
    id: 1,
    name: "Kirti Verma",
    email: "kirti.verma@email.com",
    score: 96,
    correct: 48,
    total: 50,
    timeTaken: "42m 18s",
    status: "Passed",
    submitted: "Today, 10:42 AM",
    integrity: "Low Risk",
    skills: {
      java: 98,
      spring: 94,
      sql: 92,
      dsa: 96,
    },
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya.singh@email.com",
    score: 92,
    correct: 46,
    total: 50,
    timeTaken: "47m 32s",
    status: "Passed",
    submitted: "Today, 10:18 AM",
    integrity: "Low Risk",
    skills: {
      java: 94,
      spring: 92,
      sql: 88,
      dsa: 91,
    },
  },
  {
    id: 3,
    name: "Arjun Mehta",
    email: "arjun.mehta@email.com",
    score: 89,
    correct: 44,
    total: 50,
    timeTaken: "51m 04s",
    status: "Passed",
    submitted: "Today, 09:55 AM",
    integrity: "Low Risk",
    skills: {
      java: 91,
      spring: 87,
      sql: 86,
      dsa: 92,
    },
  },
  {
    id: 4,
    name: "Neha Joshi",
    email: "neha.joshi@email.com",
    score: 84,
    correct: 42,
    total: 50,
    timeTaken: "55m 12s",
    status: "Passed",
    submitted: "Today, 09:31 AM",
    integrity: "Low Risk",
    skills: {
      java: 87,
      spring: 84,
      sql: 82,
      dsa: 83,
    },
  },
  {
    id: 5,
    name: "Vikram Kapoor",
    email: "vikram.kapoor@email.com",
    score: 78,
    correct: 39,
    total: 50,
    timeTaken: "52m 46s",
    status: "Passed",
    submitted: "Today, 09:08 AM",
    integrity: "Low Risk",
    skills: {
      java: 81,
      spring: 79,
      sql: 74,
      dsa: 78,
    },
  },
  {
    id: 6,
    name: "Karan Verma",
    email: "karan.verma@email.com",
    score: 58,
    correct: 29,
    total: 50,
    timeTaken: "59m 44s",
    status: "Failed",
    submitted: "Yesterday, 06:41 PM",
    integrity: "Review",
    skills: {
      java: 61,
      spring: 54,
      sql: 58,
      dsa: 59,
    },
  },
  {
    id: 7,
    name: "Ananya Gupta",
    email: "ananya.gupta@email.com",
    score: 72,
    correct: 36,
    total: 50,
    timeTaken: "57m 02s",
    status: "Passed",
    submitted: "Yesterday, 05:32 PM",
    integrity: "Low Risk",
    skills: {
      java: 74,
      spring: 71,
      sql: 69,
      dsa: 75,
    },
  },
  {
    id: 8,
    name: "Rohan Malhotra",
    email: "rohan.malhotra@email.com",
    score: 46,
    correct: 23,
    total: 50,
    timeTaken: "60m 00s",
    status: "Failed",
    submitted: "Yesterday, 04:18 PM",
    integrity: "Review",
    skills: {
      java: 49,
      spring: 43,
      sql: 45,
      dsa: 47,
    },
  },
];

const scoreBuckets = [
  { label: "0–20", count: 0 },
  { label: "21–40", count: 0 },
  { label: "41–60", count: 2 },
  { label: "61–70", count: 1 },
  { label: "71–80", count: 1 },
  { label: "81–90", count: 2 },
  { label: "91–100", count: 2 },
];

const skills = [
  ["Java", 84],
  ["Data Structures", 81],
  ["Spring Boot", 79],
  ["SQL", 76],
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function AssessmentResults({
  onNavigate,
}: AssessmentResultsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Passed" | "Failed"
  >("All");

  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateResult | null>(null);

  const passedCandidates = candidates.filter(
    (candidate) => candidate.status === "Passed"
  );

  const failedCandidates = candidates.filter(
    (candidate) => candidate.status === "Failed"
  );

  const averageScore = Math.round(
    candidates.reduce(
      (sum, candidate) => sum + candidate.score,
      0
    ) / candidates.length
  );

  const topCandidate = [...candidates].sort(
    (a, b) => b.score - a.score
  )[0];

  const passRate = Math.round(
    (passedCandidates.length / candidates.length) * 100
  );

  const averageTime = "53m 14s";

  const filteredCandidates = useMemo(() => {
    const query = search.toLowerCase().trim();

    return candidates
      .filter((candidate) => {
        const matchesSearch =
          candidate.name.toLowerCase().includes(query) ||
          candidate.email.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          candidate.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.score - a.score);
  }, [search, statusFilter]);

  const candidateRank = selectedCandidate
    ? [...candidates]
        .sort((a, b) => b.score - a.score)
        .findIndex(
          (candidate) =>
            candidate.id === selectedCandidate.id
        ) + 1
    : 0;

  return (
    <Layout role="Admin">
      <div className="results-page">

        {/* Ambient background */}
        <div className="results-orb results-orb-one" />
        <div className="results-orb results-orb-two" />

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="results-header results-reveal">
          <div>
            <div className="results-eyebrow">
              <span className="eyebrow-pulse" />
              ASSESSMENT INTELLIGENCE
            </div>

            <h1 className="results-title">
              Assessment Results
              <span className="title-dot">.</span>
            </h1>

            <p className="results-subtitle">
              Review candidate performance, rankings and
              assessment intelligence in one place.
            </p>
          </div>

          <div className="results-header-actions">
            <button
              className="results-secondary-button"
              onClick={() =>
                onNavigate("admin-dashboard")
              }
            >
              <span>←</span>
              Dashboard
            </button>

            <button className="results-primary-button">
              <span className="button-shine" />
              Export Results
              <span>↓</span>
            </button>
          </div>
        </header>

        {/* =====================================================
            ASSESSMENT HERO
        ===================================================== */}

        <section className="assessment-selector-card results-reveal delay-1">
          <div className="assessment-selector-main">
            <div className="assessment-selector-icon">
              <span>☷</span>
              <i />
            </div>

            <div>
              <span className="selector-label">
                SELECTED ASSESSMENT
              </span>

              <h2>
                Java Backend Developer Assessment
              </h2>

              <div className="selector-meta">
                <span>Published</span>
                <i />
                <span>50 Questions</span>
                <i />
                <span>60 Minutes</span>
                <i />
                <span>Cutoff 60%</span>
              </div>
            </div>
          </div>

          <button className="assessment-dropdown">
            Change Assessment
            <span>⌄</span>
          </button>
        </section>

        {/* =====================================================
            KPI STATS
        ===================================================== */}

        <div className="results-stats-grid results-reveal delay-2">

          <StatCard
            title="Candidates"
            value={candidates.length}
            subtitle="Assessment participants"
            icon="◎"
            trend="+8 this drive"
          />

          <StatCard
            title="Completed"
            value={candidates.length}
            subtitle="100% completion rate"
            icon="✓"
            trend="On track"
          />

          <StatCard
            title="Passed"
            value={passedCandidates.length}
            subtitle={`${passRate}% pass rate`}
            icon="↗"
            trend="+6 qualified"
          />

          <StatCard
            title="Average Score"
            value={`${averageScore}%`}
            subtitle="Across all candidates"
            icon="◌"
            trend="+4.2% vs previous"
          />

          <StatCard
            title="Top Score"
            value={`${topCandidate.score}%`}
            subtitle={topCandidate.name}
            icon="★"
            trend="Rank #1"
          />
        </div>

        {/* =====================================================
            PERFORMANCE ANALYTICS
        ===================================================== */}

        <div className="results-analytics-grid results-reveal delay-3">

          {/* Score Distribution */}
          <section className="results-card score-distribution-card">

            <div className="results-card-header">
              <div>
                <span className="section-label">
                  PERFORMANCE
                </span>

                <h2>Score Distribution</h2>

                <p>
                  Candidate performance across score bands.
                </p>
              </div>

              <span className="cutoff-pill">
                Cutoff 60%
              </span>
            </div>

            <div className="distribution-chart">
              {scoreBuckets.map((bucket, index) => {
                const maxCount = 2;

                const height =
                  bucket.count === 0
                    ? 5
                    : (bucket.count / maxCount) * 100;

                const isBelowCutoff =
                  bucket.label === "41–60";

                return (
                  <div
                    className="distribution-column"
                    key={bucket.label}
                    style={{
                      animationDelay: `${index * 70}ms`,
                    }}
                  >
                    <div className="distribution-count">
                      {bucket.count > 0
                        ? bucket.count
                        : ""}
                    </div>

                    <div className="distribution-bar-wrapper">
                      <div
                        className={`distribution-bar ${
                          isBelowCutoff
                            ? "distribution-bar-cutoff"
                            : ""
                        }`}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${
                            index * 80
                          }ms`,
                        }}
                      />
                    </div>

                    <span className="distribution-label">
                      {bucket.label}
                    </span>
                  </div>
                );
              })}

              <div className="cutoff-marker">
                <span>60% CUTOFF</span>
              </div>
            </div>

            <div className="distribution-footer">
              <div>
                <span className="legend-dot passed" />
                Above cutoff
              </div>

              <div>
                <span className="legend-dot failed" />
                Below cutoff
              </div>

              <strong>
                {passedCandidates.length} of{" "}
                {candidates.length} qualified
              </strong>
            </div>
          </section>

          {/* Outcome */}
          <section className="results-card pass-rate-card">

            <div className="results-card-header">
              <div>
                <span className="section-label">
                  OUTCOME
                </span>

                <h2>Candidate Outcome</h2>

                <p>
                  Qualification breakdown.
                </p>
              </div>
            </div>

            <div className="pass-rate-visual">

              <div
                className="pass-rate-ring"
                style={{
                  background: `conic-gradient(
                    var(--dc-pink) 0%,
                    var(--dc-pink) ${passRate}%,
                    #eeeaf0 ${passRate}%,
                    #eeeaf0 100%
                  )`,
                }}
              >
                <div className="pass-rate-ring-glow" />

                <div className="pass-rate-ring-inner">
                  <strong>{passRate}%</strong>
                  <span>Pass Rate</span>
                </div>
              </div>

            </div>

            <div className="outcome-breakdown">

              <div className="outcome-item">
                <div>
                  <span className="outcome-dot passed" />
                  Passed
                </div>

                <strong>
                  {passedCandidates.length}
                </strong>
              </div>

              <div className="outcome-item">
                <div>
                  <span className="outcome-dot failed" />
                  Failed
                </div>

                <strong>
                  {failedCandidates.length}
                </strong>
              </div>

            </div>

            <div className="outcome-message">
              <span className="sparkle">✦</span>

              <p>
                Strong candidate pool. Most participants
                cleared the assessment cutoff.
              </p>
            </div>
          </section>
        </div>

        {/* =====================================================
            LEADERBOARD
        ===================================================== */}

        <section className="results-card leaderboard-section results-reveal">

          <div className="results-card-header leaderboard-header">
            <div>
              <span className="section-label">
                TOP PERFORMERS
              </span>

              <h2>Leaderboard</h2>

              <p>
                Highest scoring candidates from this
                assessment.
              </p>
            </div>

            <div className="leaderboard-summary">
              <span className="summary-icon">⚡</span>

              <div>
                <strong>{averageTime}</strong>
                <small>Avg. completion time</small>
              </div>
            </div>
          </div>

          {/* Podium */}
          <div className="podium">

            {passedCandidates
              .slice(0, 3)
              .map((candidate, index) => (
                <button
                  className={`podium-card podium-${index + 1}`}
                  key={candidate.id}
                  onClick={() =>
                    setSelectedCandidate(candidate)
                  }
                >

                  {index === 0 && (
                    <div className="podium-crown">
                      ♛
                    </div>
                  )}

                  <div className="podium-rank">
                    {index === 0
                      ? "01"
                      : `0${index + 1}`}
                  </div>

                  <div className="podium-avatar">
                    {getInitials(candidate.name)}
                  </div>

                  <h3>{candidate.name}</h3>

                  <span className="podium-score">
                    {candidate.score}%
                  </span>

                  <small>
                    {candidate.correct}/
                    {candidate.total} correct
                  </small>

                  <div className="podium-glow" />
                </button>
              ))}
          </div>

          {/* Remaining top candidates */}
          <div className="leaderboard-table">

            {passedCandidates
              .slice(3)
              .map((candidate, index) => (
                <button
                  className="leaderboard-row"
                  key={candidate.id}
                  onClick={() =>
                    setSelectedCandidate(candidate)
                  }
                >
                  <span className="leaderboard-rank">
                    #{index + 4}
                  </span>

                  <span className="candidate-avatar small">
                    {getInitials(candidate.name)}
                  </span>

                  <span className="leaderboard-name">
                    <strong>
                      {candidate.name}
                    </strong>

                    <small>
                      {candidate.email}
                    </small>
                  </span>

                  <span className="leaderboard-correct">
                    {candidate.correct}/
                    {candidate.total}
                  </span>

                  <span className="leaderboard-time">
                    {candidate.timeTaken}
                  </span>

                  <span className="leaderboard-score">
                    {candidate.score}%
                  </span>

                  <span className="leaderboard-status">
                    <span className="status-dot" />
                    Passed
                  </span>

                  <span className="leaderboard-arrow">
                    →
                  </span>
                </button>
              ))}
          </div>
        </section>

        {/* =====================================================
            ALL CANDIDATES
        ===================================================== */}

        <section className="results-card candidates-section">

          <div className="results-card-header candidates-header">

            <div>
              <span className="section-label">
                ALL SUBMISSIONS
              </span>

              <h2>Candidate Results</h2>

              <p>
                Search, filter and review assessment
                submissions.
              </p>
            </div>

            <div className="candidate-controls">

              <div className="candidate-search">
                <span>⌕</span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search candidates..."
                />

                <span className="search-shortcut">
                  /
                </span>
              </div>

              <div className="status-filters">
                {(
                  ["All", "Passed", "Failed"] as const
                ).map((status) => (
                  <button
                    key={status}
                    className={
                      statusFilter === status
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setStatusFilter(status)
                    }
                  >
                    {status}
                  </button>
                ))}
              </div>

            </div>
          </div>

          <div className="candidate-table-wrapper">

            <table className="candidate-table">

              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Score</th>
                  <th>Correct</th>
                  <th>Time Taken</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Integrity</th>
                  <th />
                </tr>
              </thead>

              <tbody>

                {filteredCandidates.map(
                  (candidate, index) => (
                    <tr
                      key={candidate.id}
                      style={{
                        animationDelay: `${
                          index * 45
                        }ms`,
                      }}
                    >
                      <td>
                        <div className="table-candidate">
                          <span className="candidate-avatar">
                            {getInitials(
                              candidate.name
                            )}
                          </span>

                          <div>
                            <strong>
                              {candidate.name}
                            </strong>

                            <small>
                              {candidate.email}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong className="table-score">
                          {candidate.score}%
                        </strong>
                      </td>

                      <td>
                        {candidate.correct}/
                        {candidate.total}
                      </td>

                      <td>
                        {candidate.timeTaken}
                      </td>

                      <td className="submitted-cell">
                        {candidate.submitted}
                      </td>

                      <td>
                        <span
                          className={`result-status ${
                            candidate.status ===
                            "Passed"
                              ? "passed-status"
                              : "failed-status"
                          }`}
                        >
                          <span />
                          {candidate.status}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`integrity-badge ${
                            candidate.integrity ===
                            "Low Risk"
                              ? "integrity-low"
                              : "integrity-review"
                          }`}
                        >
                          {candidate.integrity ===
                          "Low Risk"
                            ? "✓"
                            : "!"}{" "}
                          {candidate.integrity}
                        </span>
                      </td>

                      <td>
                        <button
                          className="candidate-view-button"
                          onClick={() =>
                            setSelectedCandidate(
                              candidate
                            )
                          }
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  )
                )}

              </tbody>
            </table>

            {filteredCandidates.length === 0 && (
              <div className="candidate-empty">
                <span>⌕</span>

                <h3>No candidates found</h3>

                <p>
                  Try changing your search or status
                  filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            BOTTOM INSIGHTS
        ===================================================== */}

        <div className="results-bottom-grid">

          {/* Skill Analysis */}
          <section className="results-card skill-card">

            <div className="results-card-header">
              <div>
                <span className="section-label">
                  SKILL ANALYSIS
                </span>

                <h2>Assessment Strengths</h2>

                <p>
                  Average performance by competency.
                </p>
              </div>
            </div>

            {skills.map(([skill, score], index) => (
              <div
                className="skill-row"
                key={skill}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="skill-info">
                  <span>{skill}</span>

                  <strong>{score}%</strong>
                </div>

                <div className="skill-track">
                  <div
                    className="skill-value"
                    style={{
                      width: `${score}%`,
                      animationDelay: `${
                        index * 120
                      }ms`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="skill-insight">
              <span>✦</span>

              <p>
                <strong>Java</strong> is the strongest
                competency across the candidate pool.
              </p>
            </div>
          </section>

          {/* AI */}
          <section className="results-card integrity-card">

            <div className="ai-orbit-icon">
              <span className="ai-core">✦</span>
              <span className="ai-ring ai-ring-one" />
              <span className="ai-ring ai-ring-two" />
            </div>

            <div className="integrity-content">

              <div className="ai-label">
                <span className="ai-live-dot" />
                AI INSIGHTS
              </div>

              <h2>Assessment Integrity</h2>

              <p>
                AI-powered monitoring can identify
                suspicious behaviour, unusual answer
                patterns and potential cheating signals
                during assessments.
              </p>

              <div className="integrity-features">
                <span>✓ Tab-switch detection</span>
                <span>✓ Answer pattern analysis</span>
                <span>✓ Suspicious activity scoring</span>
              </div>

              <div className="ai-preview-bar">
                <div className="ai-preview-fill" />
              </div>

              <span className="coming-soon-badge">
                AI ANALYSIS · COMING SOON
              </span>

            </div>
          </section>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="results-footer">
          <button
            onClick={() =>
              onNavigate("admin-dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <span>
            Results last updated just now
          </span>
        </div>

        {/* =====================================================
            CANDIDATE DRAWER
        ===================================================== */}

        {selectedCandidate && (
          <div
            className="candidate-overlay"
            onClick={() =>
              setSelectedCandidate(null)
            }
          >
            <aside
              className="candidate-drawer"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="drawer-header">

                <div className="drawer-profile">

                  <div className="drawer-avatar">
                    {getInitials(
                      selectedCandidate.name
                    )}
                  </div>

                  <div>
                    <span className="section-label">
                      CANDIDATE PROFILE
                    </span>

                    <h2>
                      {selectedCandidate.name}
                    </h2>

                    <p>
                      {selectedCandidate.email}
                    </p>
                  </div>

                </div>

                <button
                  className="drawer-close"
                  onClick={() =>
                    setSelectedCandidate(null)
                  }
                >
                  ×
                </button>

              </div>

              <div className="drawer-score">

                <div className="drawer-score-orb" />

                <div>
                  <span>Overall Score</span>

                  <strong>
                    {selectedCandidate.score}%
                  </strong>
                </div>

                <div className="drawer-qualified">
                  <span>RANK</span>
                  <strong>#{candidateRank}</strong>
                </div>

              </div>

              <div className="drawer-stat-grid">

                <div>
                  <span>Correct</span>

                  <strong>
                    {selectedCandidate.correct}/
                    {selectedCandidate.total}
                  </strong>
                </div>

                <div>
                  <span>Time Taken</span>

                  <strong>
                    {selectedCandidate.timeTaken}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {selectedCandidate.status}
                  </strong>
                </div>

                <div>
                  <span>Submitted</span>

                  <strong>
                    {selectedCandidate.submitted}
                  </strong>
                </div>

              </div>

              <div className="drawer-section">

                <span className="drawer-section-label">
                  SKILL PERFORMANCE
                </span>

                {Object.entries(
                  selectedCandidate.skills
                ).map(([skill, score], index) => (
                  <div
                    className="drawer-skill"
                    key={skill}
                  >
                    <div>
                      <span>
                        {skill === "dsa"
                          ? "Data Structures"
                          : skill === "java"
                          ? "Java"
                          : skill === "spring"
                          ? "Spring Boot"
                          : "SQL"}
                      </span>

                      <strong>{score}%</strong>
                    </div>

                    <div className="drawer-skill-track">
                      <div
                        style={{
                          width: `${score}%`,
                          animationDelay: `${
                            index * 100
                          }ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="drawer-section">

                <span className="drawer-section-label">
                  ASSESSMENT INTEGRITY
                </span>

                <div
                  className={`drawer-integrity ${
                    selectedCandidate.integrity ===
                    "Low Risk"
                      ? "drawer-integrity-low"
                      : "drawer-integrity-review"
                  }`}
                >
                  <span>
                    {selectedCandidate.integrity ===
                    "Low Risk"
                      ? "✓"
                      : "!"}
                  </span>

                  <div>
                    <strong>
                      {selectedCandidate.integrity}
                    </strong>

                    <small>
                      AI integrity analysis
                      placeholder
                    </small>
                  </div>
                </div>
              </div>

              <div className="drawer-actions">

                <button className="drawer-primary">
                  View Answer Sheet →
                </button>

                <button className="drawer-secondary">
                  Move to Shortlist
                </button>

              </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AssessmentResults;