import StatCard from "../components/StatCard";
import type { Assessment } from "../data/assessments";

type AdminDashboardProps = {
  assessments: Assessment[];
  onNavigate: (screen: string) => void;
};

function AdminDashboard({
  assessments,
  onNavigate,
}: AdminDashboardProps) {
  return (
    <div>
      <h1>AssessAI</h1>

      <h2>Admin Dashboard</h2>

      <p>Welcome, Admin</p>

      <div>
        <StatCard title="Questions" value={25} />
        <StatCard
          title="Assessments"
          value={assessments.length}
        />
        <StatCard title="Candidates" value={42} />
        <StatCard title="Attempts" value={87} />
      </div>

      <hr />

      <h2>Assessments</h2>

      {assessments.map((assessment) => (
        <div key={assessment.id}>
          <h3>{assessment.title}</h3>

          <p>{assessment.description}</p>

          <p>
            {assessment.durationMinutes} minutes |{" "}
            {assessment.questionIds.length} questions
          </p>

          <p>
            Status: <strong>{assessment.status}</strong>
          </p>

          <hr />
        </div>
      ))}

      <button onClick={() => onNavigate("question-bank")}>
        Question Bank
      </button>

      <button
        onClick={() => onNavigate("create-assessment")}
      >
        Create Assessment
      </button>

      <button onClick={() => onNavigate("landing")}>
        Back
      </button>
    </div>
  );
}

export default AdminDashboard;