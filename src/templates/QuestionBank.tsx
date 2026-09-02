import { useState } from "react";
import Layout from "../components/Layout";
import { questions as initialQuestions } from "../data/questions";
import type { Question } from "../data/questions";
import "../styles/QuestionBank.css";

type QuestionBankProps = {
  onNavigate: (screen: string) => void;
};

function QuestionBank({ onNavigate }: QuestionBankProps) {
  const [questions, setQuestions] =
    useState<Question[]>(initialQuestions);

  const [showForm, setShowForm] = useState(false);

  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [subject, setSubject] = useState("Java");

  const [difficulty, setDifficulty] = useState<
    "Easy" | "Medium" | "Hard"
  >("Easy");

  const handleCreateQuestion = () => {
    if (
      !questionText.trim() ||
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim() ||
      !optionD.trim() ||
      !correctAnswer
    ) {
      alert(
        "Please enter the question, all four options, and select the correct answer."
      );
      return;
    }

    const newQuestion: Question = {
      id: questions.length + 1,
      text: questionText.trim(),
      options: [
        optionA.trim(),
        optionB.trim(),
        optionC.trim(),
        optionD.trim(),
      ],
      correctAnswer,
      subject,
      difficulty,
      marks: 2,
    };

    setQuestions([...questions, newQuestion]);

    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");

    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);

    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");
  };

  return (
    <Layout role="Admin">
      <div className="question-bank-page">

        {/* Page Header */}
        <div className="question-bank-header">
          <div>
            <h1 className="question-bank-title">
              Question Bank
            </h1>

            <p className="question-bank-subtitle">
              Create and manage questions available for assessments.
            </p>
          </div>

          <div className="question-bank-actions">
            <button
              className="secondary-button"
              onClick={() => onNavigate("admin")}
            >
              ← Back to Dashboard
            </button>

            <button
              className="primary-button"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Add Question"}
            </button>
          </div>
        </div>

        {/* Create Question Form */}
        {showForm && (
          <section className="create-question-section">

            <div className="section-heading">
              <div>
                <h2 className="section-title">
                  Create Question
                </h2>

                <p className="section-description">
                  Add a multiple-choice question to the question bank.
                </p>
              </div>
            </div>

            <div className="question-form-card">

              {/* Question */}
              <div className="form-group">
                <label htmlFor="question-text">
                  Question
                </label>

                <textarea
                  id="question-text"
                  className="form-textarea"
                  placeholder="Enter the question..."
                  value={questionText}
                  onChange={(e) =>
                    setQuestionText(e.target.value)
                  }
                  rows={3}
                />
              </div>

              {/* Options */}
              <div className="options-section">

                <div className="options-heading">
                  <h3>Answer Options</h3>

                  <span>
                    Select the correct answer below
                  </span>
                </div>

                <div className="options-grid">

                  <div className="form-group">
                    <label htmlFor="option-a">
                      Option A
                    </label>

                    <input
                      id="option-a"
                      className="form-input"
                      placeholder="Enter option A"
                      value={optionA}
                      onChange={(e) =>
                        setOptionA(e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="option-b">
                      Option B
                    </label>

                    <input
                      id="option-b"
                      className="form-input"
                      placeholder="Enter option B"
                      value={optionB}
                      onChange={(e) =>
                        setOptionB(e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="option-c">
                      Option C
                    </label>

                    <input
                      id="option-c"
                      className="form-input"
                      placeholder="Enter option C"
                      value={optionC}
                      onChange={(e) =>
                        setOptionC(e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="option-d">
                      Option D
                    </label>

                    <input
                      id="option-d"
                      className="form-input"
                      placeholder="Enter option D"
                      value={optionD}
                      onChange={(e) =>
                        setOptionD(e.target.value)
                      }
                    />
                  </div>

                </div>
              </div>

              {/* Configuration */}
              <div className="question-config">

                <div className="form-group">
                  <label htmlFor="correct-answer">
                    Correct Answer
                  </label>

                  <select
                    id="correct-answer"
                    className="form-select"
                    value={correctAnswer}
                    onChange={(e) =>
                      setCorrectAnswer(e.target.value)
                    }
                  >
                    <option value="">
                      Select correct answer
                    </option>

                    <option value={optionA}>
                      A - {optionA || "Option A"}
                    </option>

                    <option value={optionB}>
                      B - {optionB || "Option B"}
                    </option>

                    <option value={optionC}>
                      C - {optionC || "Option C"}
                    </option>

                    <option value={optionD}>
                      D - {optionD || "Option D"}
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject
                  </label>

                  <select
                    id="subject"
                    className="form-select"
                    value={subject}
                    onChange={(e) =>
                      setSubject(e.target.value)
                    }
                  >
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="SQL">SQL</option>
                    <option value="Backend">Backend</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    className="form-select"
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(
                        e.target.value as
                          | "Easy"
                          | "Medium"
                          | "Hard"
                      )
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

              </div>

              {/* Form Actions */}
              <div className="form-actions">

                <button
                  className="secondary-button"
                  onClick={handleCancelForm}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  onClick={handleCreateQuestion}
                >
                  Create Question
                </button>

              </div>

            </div>
          </section>
        )}

        {/* Question List */}
        <section className="questions-section">

          <div className="questions-section-header">
            <div>
              <h2 className="section-title">
                Questions
              </h2>

              <p className="section-description">
                Questions currently available in the question bank.
              </p>
            </div>

            <div className="question-count">
              {questions.length}
              <span>questions</span>
            </div>
          </div>

          <div className="question-list">

            {questions.map((question, index) => (
              <div
                className="question-bank-card"
                key={question.id}
              >

                {/* Card Header */}
                <div className="question-card-header">

                  <div className="question-number">
                    Q{index + 1}
                  </div>

                  <div className="question-card-tags">
                    <span className="subject-badge">
                      {question.subject}
                    </span>

                    <span
                      className={`difficulty-badge difficulty-${question.difficulty.toLowerCase()}`}
                    >
                      {question.difficulty}
                    </span>

                    <span className="marks-badge">
                      {question.marks}{" "}
                      {question.marks === 1
                        ? "mark"
                        : "marks"}
                    </span>
                  </div>

                </div>

                {/* Question Text */}
                <h3 className="question-card-title">
                  {question.text}
                </h3>

                {/* Options */}
                <div className="question-options">

                  <div className="question-option">
                    <span className="option-label">
                      A
                    </span>

                    <span>
                      {question.options[0]}
                    </span>
                  </div>

                  <div className="question-option">
                    <span className="option-label">
                      B
                    </span>

                    <span>
                      {question.options[1]}
                    </span>
                  </div>

                  <div className="question-option">
                    <span className="option-label">
                      C
                    </span>

                    <span>
                      {question.options[2]}
                    </span>
                  </div>

                  <div className="question-option">
                    <span className="option-label">
                      D
                    </span>

                    <span>
                      {question.options[3]}
                    </span>
                  </div>

                </div>

                {/* Correct Answer */}
                <div className="correct-answer">
                  <span className="correct-answer-label">
                    Correct Answer
                  </span>

                  <strong>
                    {question.correctAnswer}
                  </strong>
                </div>

              </div>
            ))}

          </div>

        </section>

      </div>
    </Layout>
  );
}

export default QuestionBank;