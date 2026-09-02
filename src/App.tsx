import { useState } from "react";
import AdminDashboard from "./templates/AdminDashboard";
import CandidateDashboard from "./templates/CandidateDashboard";
import QuestionBank from "./templates/QuestionBank";
import CreateAssessment from "./templates/CreateAssessment";
import { assessments as initialAssessments } from "./data/assessments";
import type { Assessment } from "./data/assessments";
import AssessmentPage from "./templates/AssessmentPage";
import ResultPage from "./templates/ResultPage";
import LandingPage from "./templates/LandingPage";

function App() {
  const [currentScreen, setCurrentScreen] = useState("landing");

  const [assessments, setAssessments] =
    useState<Assessment[]>(initialAssessments);

  if (currentScreen === "admin") {
    return (
      <AdminDashboard
        assessments={assessments}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === "question-bank") {
    return (
      <QuestionBank
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === "create-assessment") {
    return (
      <CreateAssessment
        onNavigate={setCurrentScreen}
        assessments={assessments}
        setAssessments={setAssessments}
      />
    );
  }

  if (currentScreen.startsWith("result-")) {
    const resultData = currentScreen
      .replace("result-", "")
      .split("-")
      .map(Number);

      const [
        score,
        totalMarks,
        correctAnswers,
        totalQuestions,
      ] = resultData;

      return (
        <ResultPage
          score={score}
          totalMarks={totalMarks}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          onNavigate={setCurrentScreen}
        />
      );
  }

  if (currentScreen.startsWith("assessment-")) {
    const assessmentId = Number(
      currentScreen.replace("assessment-", "")
    );

    const selectedAssessment = assessments.find(
      (assessment) => assessment.id === assessmentId
    );

    if (!selectedAssessment) {
      return <div>Assessment not found.</div>;
    }

    return (
      <AssessmentPage
        assessment={selectedAssessment}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === "candidate") {
    return (
      <CandidateDashboard 
        assessments={assessments}
        onNavigate={setCurrentScreen}
      />
    )
  }

  return (
    <LandingPage
      onNavigate={setCurrentScreen}
    />    
  )
}

export default App;