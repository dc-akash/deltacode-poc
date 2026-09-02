export type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
    subject: string;
    difficulty: "Easy" | "Medium" | "Hard";
    marks: number;
};

export const questions: Question[] = [
    {
    id: 1,
    text: "Which collection stores key-value pairs in Java?",
    options: ["ArrayList", "HashMap", "Stack", "Queue"],
    correctAnswer: "HashMap",
    subject: "Java",
    difficulty: "Easy",
    marks: 2,
  },
  {
    id: 2,
    text: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctAnswer: "extends",
    subject: "Java",
    difficulty: "Easy",
    marks: 2,
  },
  {
    id: 3,
    text: "What is the primary purpose of an interface?",
    options: [
      "Store data",
      "Define a contract",
      "Create database tables",
      "Handle exceptions",
    ],
    correctAnswer: "Define a contract",
    subject: "Java",
    difficulty: "Medium",
    marks: 2,
  },
  {
    id: 4,
    text: "Which component manages memory in the JVM?",
    options: ["Compiler", "Garbage Collector", "JAR", "JDBC"],
    correctAnswer: "Garbage Collector",
    subject: "Java",
    difficulty: "Medium",
    marks: 2,
  },
  {
    id: 5,
    text: "Which HTTP method is commonly used to create a resource?",
    options: ["GET", "POST", "DELETE", "PATCH"],
    correctAnswer: "POST",
    subject: "Backend",
    difficulty: "Easy",
    marks: 2,
  },
  {
    id: 6,
    text: "Which SQL clause is used to filter grouped results?",
    options: ["WHERE", "ORDER BY", "HAVING", "GROUP BY"],
    correctAnswer: "HAVING",
    subject: "SQL",
    difficulty: "Medium",
    marks: 2,
  },
];