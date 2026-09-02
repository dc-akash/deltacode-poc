import "../styles/LandingPage.css";

type LandingPageProps = {
  onNavigate: (screen: string) => void;
};

function LandingPage({
  onNavigate,
}: LandingPageProps) {
  return (
    <div className="landing-page">

      <header className="landing-header">
        <div className="landing-brand">

          <div className="landing-brand-mark">
            DC
          </div>

          <div>
            <div className="landing-brand-name">
              DELTA CAPITA
            </div>

            <div className="landing-brand-product">
              DeltaCode
            </div>
          </div>

        </div>
      </header>

      <main className="landing-content">

        <div className="landing-tag">
          INTERNAL ASSESSMENT PLATFORM
        </div>

        <h1 className="landing-title">
          Assess.
          <br />
          Evaluate.
          <br />
          <span>Understand.</span>
        </h1>

        <p className="landing-description">
          A modern internal assessment platform designed
          to create assessments, evaluate candidates and
          provide deeper insights into candidate behaviour.
        </p>

        <div className="landing-actions">

          <button
            className="landing-primary-button"
            onClick={() => onNavigate("admin")}
          >
            Admin Portal →
          </button>

          <button
            className="landing-secondary-button"
            onClick={() => onNavigate("candidate")}
          >
            Candidate Demo
          </button>

        </div>

      </main>

      <footer className="landing-footer">
        <span>DELTA CAPITA • DeltaCode POC</span>

        <span>
            Created by:{" "}
            <a
            href="https://www.linkedin.com/in/akash-rawat-a06096208/"
            target="_blank"
            rel="noopener noreferrer"
            >
            Akash
            </a>
        </span>
      </footer>

    </div>
  );
}

export default LandingPage;