import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { questions as initialQuestions } from "../data/questions";
import type { Question } from "../data/questions";
import "../styles/QuestionBank.css";

type QuestionBankProps = {
  onNavigate: (screen: string) => void;
};

type Difficulty = "Easy" | "Medium" | "Hard";

function QuestionBank({ onNavigate }: QuestionBankProps) {
  const [questions, setQuestions] =
    useState<Question[]>(initialQuestions);

  const [showForm, setShowForm] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedQuestions, setSelectedQuestions] =
    useState<number[]>([]);

  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [subject, setSubject] = useState("Java");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("Easy");

  /* =========================
     Question Creation
     ========================= */

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

    resetForm();
  };

  const resetForm = () => {
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");
    setShowForm(false);
  };

  /* =========================
     Filtering / Sorting
     ========================= */

  const filteredQuestions = useMemo(() => {
    const result = questions.filter((question) => {
      const matchesSearch =
        question.text
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.subject
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesSubject =
        subjectFilter === "All" ||
        question.subject === subjectFilter;

      const matchesDifficulty =
        difficultyFilter === "All" ||
        question.difficulty === difficultyFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesDifficulty
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.id - b.id;

        case "difficulty":
          return (
            difficultyRank(a.difficulty) -
            difficultyRank(b.difficulty)
          );

        case "marks":
          return b.marks - a.marks;

        case "newest":
        default:
          return b.id - a.id;
      }
    });
  }, [
    questions,
    searchQuery,
    subjectFilter,
    difficultyFilter,
    sortBy,
  ]);

  function difficultyRank(value: Difficulty) {
    if (value === "Easy") return 1;
    if (value === "Medium") return 2;
    return 3;
  }

  /* =========================
     Analytics
     ========================= */

  const easyCount = questions.filter(
    (q) => q.difficulty === "Easy"
  ).length;

  const mediumCount = questions.filter(
    (q) => q.difficulty === "Medium"
  ).length;

  const hardCount = questions.filter(
    (q) => q.difficulty === "Hard"
  ).length;

  const javaCount = questions.filter(
    (q) => q.subject === "Java"
  ).length;

  const pythonCount = questions.filter(
    (q) => q.subject === "Python"
  ).length;

  const sqlCount = questions.filter(
    (q) => q.subject === "SQL"
  ).length;

  /* =========================
     Selection
     ========================= */

  const toggleQuestion = (id: number) => {
    setSelectedQuestions((current) =>
      current.includes(id)
        ? current.filter((questionId) => questionId !== id)
        : [...current, id]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = filteredQuestions.map(
      (question) => question.id
    );

    const allSelected = visibleIds.every((id) =>
      selectedQuestions.includes(id)
    );

    if (allSelected) {
      setSelectedQuestions((current) =>
        current.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedQuestions((current) => [
        ...new Set([...current, ...visibleIds]),
      ]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSubjectFilter("All");
    setDifficultyFilter("All");
    setSortBy("newest");
  };

  return (
    <Layout role="Admin">
      <div className="question-bank-page">

        {/* =========================
            Header
           ========================= */}

        <div className="question-bank-header">
          <div>
            <div className="question-bank-eyebrow">
              CONTENT WORKSPACE
            </div>

            <h1 className="question-bank-title">
              Question Bank
            </h1>

            <p className="question-bank-subtitle">
              Create, organize and optimize questions used
              across your assessments.
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
              className="ai-button"
              onClick={() => setShowAiPanel(!showAiPanel)}
            >
              ✦ AI Insights
            </button>

            <button
              className="primary-button"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Add Question"}
            </button>
          </div>
        </div>

        {/* =========================
            Overview Stats
           ========================= */}

        <div className="question-stats-grid">

          <div className="question-stat-card">
            <div className="question-stat-icon">
              ?
            </div>

            <div>
              <span>Total Questions</span>
              <strong>{questions.length}</strong>
              <small>Available in bank</small>
            </div>
          </div>

          <div className="question-stat-card">
            <div className="question-stat-icon">
              ◈
            </div>

            <div>
              <span>Subjects</span>
              <strong>4</strong>
              <small>Java, Python, SQL & Backend</small>
            </div>
          </div>

          <div className="question-stat-card">
            <div className="question-stat-icon">
              ◇
            </div>

            <div>
              <span>Difficulty Mix</span>

              <strong>
                {easyCount}
                <small className="inline-small">
                  {" "}
                  Easy
                </small>
              </strong>

              <small>
                {mediumCount} Medium · {hardCount} Hard
              </small>
            </div>
          </div>

          <div className="question-stat-card ai-stat-card">
            <div className="question-stat-icon ai-icon">
              ✦
            </div>

            <div>
              <span>AI Quality Score</span>

              <strong>
                92<span className="score-percent">%</span>
              </strong>

              <small>
                Good question-bank health
              </small>
            </div>
          </div>

        </div>

        {/* =========================
            AI Insights
           ========================= */}

        {showAiPanel && (
          <section className="ai-insights-card">

            <div className="ai-insights-main">

              <div className="ai-insights-icon">
                <span className="ai-core">
                  ✦
                </span>

                <span className="ai-ring ai-ring-one" />
                <span className="ai-ring ai-ring-two" />
              </div>

              <div>
                <div className="ai-insights-label">
                  AI QUESTION BANK ANALYSIS
                </div>

                <h2>
                  Your question bank looks healthy
                </h2>

                <p>
                  AI analysis indicates good coverage across
                  subjects and difficulty levels. A few areas
                  could be improved before the next hiring drive.
                </p>
              </div>

            </div>

            <div className="ai-recommendations">

              <div className="ai-recommendation positive">
                <span>✓</span>
                <div>
                  <strong>Good difficulty balance</strong>
                  <small>
                    Easy, medium and hard questions are represented.
                  </small>
                </div>
              </div>

              <div className="ai-recommendation warning">
                <span>!</span>
                <div>
                  <strong>Add more SQL questions</strong>
                  <small>
                    SQL currently represents a smaller portion of the bank.
                  </small>
                </div>
              </div>

              <div className="ai-recommendation">
                <span>✧</span>
                <div>
                  <strong>2 possible duplicates detected</strong>
                  <small>
                    AI can review similar questions before publishing.
                  </small>
                </div>
              </div>

            </div>

            <button
              className="ai-analyze-button"
              onClick={() =>
                alert("AI analysis is a POC feature.")
              }
            >
              Run AI Analysis →
            </button>

          </section>
        )}

        {/* =========================
            Create Question
           ========================= */}

        {showForm && (
          <section className="create-question-section">

            <div className="section-heading">
              <div>
                <div className="section-label">
                  QUESTION CREATOR
                </div>

                <h2 className="section-title">
                  Create Question
                </h2>

                <p className="section-description">
                  Add a multiple-choice question to your question bank.
                </p>
              </div>
            </div>

            <div className="question-form-card">

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

              <div className="options-section">

                <div className="options-heading">
                  <h3>Answer Options</h3>

                  <span>
                    Select the correct answer below
                  </span>
                </div>

                <div className="options-grid">

                  {[
                    ["option-a", "Option A", optionA, setOptionA],
                    ["option-b", "Option B", optionB, setOptionB],
                    ["option-c", "Option C", optionC, setOptionC],
                    ["option-d", "Option D", optionD, setOptionD],
                  ].map(
                    ([id, label, value, setter]) => (
                      <div
                        className="form-group"
                        key={id as string}
                      >
                        <label htmlFor={id as string}>
                          {label as string}
                        </label>

                        <input
                          id={id as string}
                          className="form-input"
                          placeholder={`Enter ${label}`}
                          value={value as string}
                          onChange={(e) =>
                            (
                              setter as React.Dispatch<
                                React.SetStateAction<string>
                              >
                            )(e.target.value)
                          }
                        />
                      </div>
                    )
                  )}

                </div>
              </div>

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
                        e.target.value as Difficulty
                      )
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

              </div>

              <div className="form-actions">

                <button
                  className="secondary-button"
                  onClick={resetForm}
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

        {/* =========================
            Question Workspace
           ========================= */}

        <section className="questions-section">

          <div className="questions-section-header">

            <div>
              <div className="section-label">
                QUESTION LIBRARY
              </div>

              <h2 className="section-title">
                Questions
              </h2>

              <p className="section-description">
                Search, filter and organize your assessment questions.
              </p>
            </div>

            <div className="question-count">
              <strong>{filteredQuestions.length}</strong>
              <span>
                of {questions.length} questions
              </span>
            </div>

          </div>

          {/* Search / Filter Toolbar */}

          <div className="question-toolbar">

            <div className="question-search">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search questions or subjects..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />

              {!searchQuery && (
                <span className="search-shortcut">
                  Ctrl K
                </span>
              )}

              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              )}

            </div>

            <select
              className="toolbar-select"
              value={subjectFilter}
              onChange={(e) =>
                setSubjectFilter(e.target.value)
              }
            >
              <option value="All">
                All Subjects
              </option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="SQL">SQL</option>
              <option value="Backend">Backend</option>
            </select>

            <select
              className="toolbar-select"
              value={difficultyFilter}
              onChange={(e) =>
                setDifficultyFilter(e.target.value)
              }
            >
              <option value="All">
                All Difficulty
              </option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              className="toolbar-select sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="difficulty">
                Difficulty
              </option>

              <option value="marks">
                Highest Marks
              </option>
            </select>

          </div>

          {/* Selection Bar */}

          <div className="question-list-toolbar">

            <label className="select-all-control">
              <input
                type="checkbox"
                checked={
                  filteredQuestions.length > 0 &&
                  filteredQuestions.every((question) =>
                    selectedQuestions.includes(question.id)
                  )
                }
                onChange={toggleAllVisible}
              />

              <span>
                Select all
              </span>
            </label>

            <div className="selection-actions">

              {selectedQuestions.length > 0 && (
                <>
                  <span className="selected-count">
                    {selectedQuestions.length} selected
                  </span>

                  <button
                    className="small-toolbar-button"
                    onClick={() =>
                      alert(
                        "Selected questions can be added to an assessment."
                      )
                    }
                  >
                    + Add to Assessment
                  </button>

                  <button
                    className="small-toolbar-button"
                    onClick={() => setSelectedQuestions([])}
                  >
                    Clear
                  </button>
                </>
              )}

              {(searchQuery ||
                subjectFilter !== "All" ||
                difficultyFilter !== "All") && (
                <button
                  className="reset-filter-button"
                  onClick={clearFilters}
                >
                  Reset filters
                </button>
              )}

            </div>

          </div>

          {/* Questions */}

          <div className="question-list">

            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => {

                console.log(index);

                const selected =
                  selectedQuestions.includes(question.id);

                return (
                  <div
                    className={`question-bank-card ${
                      selected
                        ? "question-card-selected"
                        : ""
                    }`}
                    key={question.id}
                  >

                    <div className="question-card-top">

                      <div className="question-card-left">

                        <input
                          type="checkbox"
                          className="question-checkbox"
                          checked={selected}
                          onChange={() =>
                            toggleQuestion(question.id)
                          }
                        />

                        <div className="question-number">
                          Q{question.id}
                        </div>

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

                    <h3 className="question-card-title">
                      {question.text}
                    </h3>

                    <div className="question-options">

                      {question.options.map(
                        (option, optionIndex) => (
                          <div
                            className={`question-option ${
                              option === question.correctAnswer
                                ? "correct-option"
                                : ""
                            }`}
                            key={optionIndex}
                          >
                            <span className="option-label">
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </span>

                            <span>
                              {option}
                            </span>

                            {option ===
                              question.correctAnswer && (
                              <span className="option-correct">
                                ✓
                              </span>
                            )}
                          </div>
                        )
                      )}

                    </div>

                    <div className="question-card-footer">

                      <div className="correct-answer">

                        <span className="correct-answer-label">
                          Correct Answer
                        </span>

                        <strong>
                          {question.correctAnswer}
                        </strong>

                      </div>

                      <div className="question-card-actions">

                        <button
                          className="question-action-button"
                          onClick={() =>
                            alert(
                              "Question preview is a POC feature."
                            )
                          }
                        >
                          👁 Preview
                        </button>

                        <button
                          className="question-action-button"
                          onClick={() =>
                            alert(
                              "Question editing can be connected here."
                            )
                          }
                        >
                          Edit
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              <div className="question-empty-state">

                <div className="empty-search-icon">
                  ⌕
                </div>

                <h3>
                  No questions found
                </h3>

                <p>
                  Try changing your search or filters to
                  find the questions you're looking for.
                </p>

                <button
                  className="secondary-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>
            )}

          </div>

        </section>

        {/* =========================
            Subject Coverage
           ========================= */}

        <section className="coverage-section">

          <div className="coverage-card">

            <div className="coverage-header">

              <div>
                <div className="section-label">
                  CONTENT COVERAGE
                </div>

                <h2 className="section-title">
                  Subject Distribution
                </h2>

                <p className="section-description">
                  Understand how your question bank is distributed.
                </p>
              </div>

            </div>

            <div className="coverage-grid">

              <div className="coverage-chart">

                {[
                  ["Java", javaCount],
                  ["Python", pythonCount],
                  ["SQL", sqlCount],
                  [
                    "Backend",
                    questions.filter(
                      (q) => q.subject === "Backend"
                    ).length,
                  ],
                ].map(([name, count]) => {

                  const percentage =
                    questions.length > 0
                      ? Math.round(
                          (Number(count) /
                            questions.length) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className="coverage-row"
                      key={name as string}
                    >

                      <div className="coverage-row-top">

                        <span>
                          {name as string}
                        </span>

                        <strong>
                          {Number(count)}
                          <small>
                            {" "}
                            ({percentage}%)
                          </small>
                        </strong>

                      </div>

                      <div className="coverage-track">

                        <div
                          className="coverage-value"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="difficulty-overview">

                <div className="difficulty-overview-header">
                  <span>
                    Difficulty Mix
                  </span>

                  <strong>
                    {questions.length}
                  </strong>
                </div>

                <div className="difficulty-bars">

                  <div className="difficulty-item">
                    <div>
                      <span className="difficulty-dot easy-dot" />
                      Easy
                    </div>

                    <strong>
                      {easyCount}
                    </strong>
                  </div>

                  <div className="difficulty-item">
                    <div>
                      <span className="difficulty-dot medium-dot" />
                      Medium
                    </div>

                    <strong>
                      {mediumCount}
                    </strong>
                  </div>

                  <div className="difficulty-item">
                    <div>
                      <span className="difficulty-dot hard-dot" />
                      Hard
                    </div>

                    <strong>
                      {hardCount}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>
    </Layout>
  );
}

export default QuestionBank;