export type Assessment = {
    id: number;
    title: string;
    description: string;
    durationMinutes: number;
    questionIds: number[];
    status: "Draft" | "Published";
};

export const assessments: Assessment[] = [
      {
    id: 1,
    title: "Java Backend Assessment",
    description: "Basic Java and backend screening assessment.",
    durationMinutes: 10,
    questionIds: [1, 2, 3, 4, 5],
    status: "Published",
  },
  {
    id: 2,
    title: "Python Developer Screening",
    description: "Python fundamentals assessment.",
    durationMinutes: 15,
    questionIds: [1, 3, 5],
    status: "Draft",
  },
];