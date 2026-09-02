import { useState } from "react";
import { questions as initialQuestions } from "../data/questions";
import type { Question } from "../data/questions";

type QuestionBankProps = {
  onNavigate: (screen: string) => void;
};

function QuestionBank({ onNavigate }: QuestionBankProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
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
    const newQuestion: Question = {
      id: questions.length + 1,
      text: questionText,
      options: [optionA, optionB, optionC, optionD],
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

  return (
    <div>
      <h1>Question Bank</h1>

      <p>Manage questions available for assessments.</p>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Question"}
      </button>

      <button onClick={() => onNavigate("admin")}>
        Back to Dashboard
      </button>

      {showForm && (
        <div>
          <h2>Create Question</h2>

          <input
            placeholder="Enter question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          <br />

          <input
            placeholder="Option A"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
          />

          <br />

          <input
            placeholder="Option B"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
          />

          <br />

          <input
            placeholder="Option C"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
          />

          <br />

          <input
            placeholder="Option D"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
          />

          <br />

          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            <option value="">Select correct answer</option>
            <option value={optionA}>A</option>
            <option value={optionB}>B</option>
            <option value={optionC}>C</option>
            <option value={optionD}>D</option>
          </select>

          <br />

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="SQL">SQL</option>
            <option value="Backend">Backend</option>
          </select>

          <br />

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(
                e.target.value as "Easy" | "Medium" | "Hard"
              )
            }
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <br />

          <button onClick={handleCreateQuestion}>
            Create Question
          </button>
        </div>
      )}

      <hr />

      <h2>Questions ({questions.length})</h2>

      {questions.map((question) => (
        <div key={question.id}>
          <h3>{question.text}</h3>

          <p>
            {question.subject} | {question.difficulty} |{" "}
            {question.marks} marks
          </p>

          <p>
            A. {question.options[0]}
            <br />
            B. {question.options[1]}
            <br />
            C. {question.options[2]}
            <br />
            D. {question.options[3]}
          </p>

          <p>
            Correct Answer: <strong>{question.correctAnswer}</strong>
          </p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default QuestionBank;