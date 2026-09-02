import type { Assessment } from "../data/assessments";

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
        <div>
            <h1>DeltaCode</h1>
            <h2>Candidate Dashboard</h2>
            <p>Welcome, Candidate</p>

            <hr />

            <h2>Available Assessments</h2>

            {publishedAssessments.length === 0 ? (
                <p>No assessments are currently available.</p>
            ) : (
                publishedAssessments.map((assessment) => (
                    <div key={assessment.id}>
                        <h3>{assessment.title}</h3>

                        <p>{assessment.description}</p>

                        <p>
                            Duration: {assessment.durationMinutes} minutes
                        </p>

                        <p>
                            Question: {assessment.questionIds.length}
                        </p>

                        <button onClick={() => onNavigate(`assessment-${assessment.id}`)}>
                            Start Assessment
                        </button>
                        <hr />
                    </div>
                ))
            )}

            <button onClick={() => onNavigate("landing")}>
                Back
            </button>
        </div>
    );
}

export default CandidateDashboard;