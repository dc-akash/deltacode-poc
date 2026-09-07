import "../styles/LandingPage.css";
import deltaCapitaLogo from "../assets/delta-capita-logo.png";

type LandingPageProps = {
  onNavigate: (screen: string) => void;
};

function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="landing-page">

      {/* =========================
          NAVBAR
         ========================= */}
      <header className="landing-header">

        <div className="landing-brand">
          <div className="landing-logo">
            {/* Replace with your actual logo */}
            <img
              src={deltaCapitaLogo}
              alt="Delta Capita"
            />
          </div>

          <div className="landing-brand-divider" />

          <div className="landing-product-info">
            <span className="landing-product-name">
              DeltaCode
            </span>

            <span className="landing-product-label">
              Internal Hiring Platform
            </span>
          </div>
        </div>

        <div className="landing-header-right">

          <div className="platform-status">
            <span className="status-dot" />
            Platform Online
          </div>

          <button
            className="header-admin-button"
            onClick={() => onNavigate("admin")}
          >
            Admin Portal
            <span>→</span>
          </button>

        </div>

      </header>


      {/* =========================
          HERO
         ========================= */}
      <main>

        <section className="landing-hero">

          <div className="hero-background-glow hero-glow-one" />
          <div className="hero-background-glow hero-glow-two" />

          <div className="hero-grid" />

          <div className="landing-hero-inner">

            {/* LEFT */}
            <div className="landing-hero-content">

              <div className="landing-eyebrow">
                <span className="eyebrow-dot" />
                INTERNAL TALENT ASSESSMENT PLATFORM
              </div>

              <h1 className="landing-title">
                Assess.
                <br />

                <span className="title-muted">
                  Evaluate.
                </span>

                <br />

                <span className="title-accent">
                  Understand.
                </span>
              </h1>

              <p className="landing-description">
                A modern internal hiring platform built to create
                assessments, evaluate candidates and transform
                assessment data into meaningful hiring insights.
              </p>


              <div className="landing-actions">

                <button
                  className="landing-primary-button"
                  onClick={() => onNavigate("admin")}
                >
                  <span>Open Admin Portal</span>
                  <span className="button-arrow">→</span>
                </button>

                <button
                  className="landing-secondary-button"
                  onClick={() => onNavigate("candidate")}
                >
                  Candidate Demo
                  <span>↗</span>
                </button>

              </div>


              <div className="hero-meta">

                <div className="hero-meta-item">
                  <span className="meta-icon">✓</span>
                  <span>Secure assessments</span>
                </div>

                <div className="hero-meta-item">
                  <span className="meta-icon">◉</span>
                  <span>Real-time evaluation</span>
                </div>

                <div className="hero-meta-item">
                  <span className="meta-icon">✦</span>
                  <span>AI-ready architecture</span>
                </div>

              </div>

            </div>


            {/* RIGHT - PRODUCT PREVIEW */}
            <div className="hero-visual">

              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />

              <div className="dashboard-preview">

                <div className="preview-header">

                  <div>
                    <span className="preview-label">
                      ASSESSMENT OVERVIEW
                    </span>

                    <h3>
                      Engineering Drive
                    </h3>
                  </div>

                  <div className="preview-menu">
                    •••
                  </div>

                </div>


                <div className="preview-stats">

                  <div className="preview-stat">
                    <span>Total Candidates</span>
                    <strong>248</strong>
                    <small className="positive">
                      +18.4%
                    </small>
                  </div>

                  <div className="preview-stat">
                    <span>Completed</span>
                    <strong>186</strong>
                    <small className="positive">
                      75%
                    </small>
                  </div>

                </div>


                <div className="preview-chart">

                  <div className="chart-heading">
                    <span>Candidate Performance</span>
                    <span>Last 7 days</span>
                  </div>

                  <div className="chart-bars">

                    <span style={{ height: "38%" }} />
                    <span style={{ height: "52%" }} />
                    <span style={{ height: "45%" }} />
                    <span style={{ height: "68%" }} />
                    <span style={{ height: "61%" }} />
                    <span style={{ height: "82%" }} />
                    <span style={{ height: "92%" }} />

                  </div>

                  <div className="chart-labels">
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>
                  </div>

                </div>


                <div className="preview-bottom">

                  <div className="candidate-mini-list">

                    <div className="candidate-row">
                      <div className="candidate-avatar avatar-one">
                        AR
                      </div>

                      <div>
                        <strong>Alex Roberts</strong>
                        <span>Java Assessment</span>
                      </div>

                      <b>92%</b>
                    </div>

                    <div className="candidate-row">
                      <div className="candidate-avatar avatar-two">
                        SK
                      </div>

                      <div>
                        <strong>Sarah Khan</strong>
                        <span>Spring Boot</span>
                      </div>

                      <b>88%</b>
                    </div>

                  </div>

                </div>

              </div>


              {/* FLOATING AI CARD */}
              <div className="floating-insight-card">

                <div className="insight-icon">
                  ✦
                </div>

                <div>
                  <span>AI Insight</span>
                  <strong>
                    High potential candidate
                  </strong>
                </div>

              </div>


              {/* FLOATING SCORE */}
              <div className="floating-score-card">

                <div className="score-circle">
                  87
                </div>

                <div>
                  <span>Avg. Score</span>
                  <strong>+12.6%</strong>
                </div>

              </div>

            </div>

          </div>


          <div className="hero-scroll">
            <span>EXPLORE PLATFORM</span>
            <div className="scroll-line" />
          </div>

        </section>


        {/* =========================
            CAPABILITIES
           ========================= */}
        <section className="landing-capabilities">

          <div className="section-heading">

            <div className="section-eyebrow">
              PLATFORM CAPABILITIES
            </div>

            <h2>
              Everything you need to
              <span> evaluate better.</span>
            </h2>

            <p>
              Designed for internal hiring teams with a focus on
              simplicity, insights and a seamless candidate experience.
            </p>

          </div>


          <div className="capability-grid">

            <div className="capability-card capability-featured">

              <div className="capability-icon">
                ◈
              </div>

              <div>
                <span className="capability-number">
                  01
                </span>

                <h3>
                  Smart Assessments
                </h3>

                <p>
                  Create structured assessments with randomized
                  questions, configurable scoring and time limits.
                </p>
              </div>

              <div className="capability-arrow">
                →
              </div>

            </div>


            <div className="capability-card">

              <div className="capability-icon">
                ◉
              </div>

              <span className="capability-number">
                02
              </span>

              <h3>
                Candidate Insights
              </h3>

              <p>
                Move beyond scores with performance trends,
                behavioural signals and assessment analytics.
              </p>

            </div>


            <div className="capability-card">

              <div className="capability-icon">
                ✦
              </div>

              <span className="capability-number">
                03
              </span>

              <h3>
                AI Ready
              </h3>

              <p>
                Architecture designed to support future AI-powered
                candidate analysis and assessment intelligence.
              </p>

            </div>


            <div className="capability-card">

              <div className="capability-icon">
                ◇
              </div>

              <span className="capability-number">
                04
              </span>

              <h3>
                Hiring Analytics
              </h3>

              <p>
                Understand candidate performance through dashboards,
                rankings and actionable assessment data.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            DARK CTA
           ========================= */}
        <section className="landing-cta">

          <div className="cta-glow" />

          <div className="cta-content">

            <span className="section-eyebrow cta-eyebrow">
              DELTACODE
            </span>

            <h2>
              Build a smarter
              <span> hiring process.</span>
            </h2>

            <p>
              Explore the platform and see how assessment-driven
              hiring can become simpler, faster and more insightful.
            </p>

            <button
              className="cta-button"
              onClick={() => onNavigate("admin")}
            >
              Explore Admin Portal
              <span>→</span>
            </button>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
         ========================= */}
      <footer className="landing-footer">

        <div className="footer-left">
          <strong>DELTA CAPITA</strong>
          <span>•</span>
          <span>DeltaCode POC</span>
        </div>

        <div className="footer-right">
          <span>
            Created by:
          </span>

          <a
            href="https://www.linkedin.com/in/akash-rawat-a06096208/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Akash
            <span>↗</span>
          </a>
        </div>

      </footer>

    </div>
  );
}

export default LandingPage;