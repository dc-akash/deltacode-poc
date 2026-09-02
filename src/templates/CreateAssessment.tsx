import { useState } from "react";
import { questions } from "../data/questions";
import type { Assessment } from "../data/assessments";

type CreateAssessmentProps = {
    onNavigate: (screen: string) => void;
    assessments: Assessment[];
    setAssessments: React.Dispatch<React.SetStateAction<Assessment[]>>;
}

function CreateAssessment({ onNavigate, assessments, setAssessments }: CreateAssessmentProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(10);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

    const toggleQuestion = (questionId: number) => {
        if (selectedQuestions.includes(questionId)) {
            setSelectedQuestions(
                selectedQuestions.filter((id) => id !== questionId)
            );
        } else {
            setSelectedQuestions([
                ...selectedQuestions,
                questionId,
            ]);
        }
    };

    const handlePublish = () => {
        if (!title || selectedQuestions.length == 0) {
            alert("Publish enter a title and selected at least one question");
            return;
        }

        const newAssessment: Assessment = {
            id: assessments.length + 1,
            title,
            description,
            durationMinutes: duration,
            questionIds: selectedQuestions,
            status: "Published",
        };

        setAssessments([...assessments, newAssessment]);

        alert("Assessment published successfully!");

        onNavigate("admin");
    };

    return (
        <div>
            <h1>Create Assessment</h1>

            <button onClick={() => onNavigate("admin")}>Back</button>

            <hr />

            <h2>Assessment Details</h2>

            <input 
                placeholder="Assessment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br />
            <br />

            <textarea 
                placeholder="Assessment description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <br />
            <br />

            <label>
                Duration (minutes):
            </label>

            <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
            />

            <hr />

            <h2>Select Questions</h2>

            {questions.map((question) => (
                <div key={question.id}>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={selectedQuestions.includes(question.id)}
                            onChange={() => toggleQuestion(question.id)}
                        />

                        {" "}

                        {question.text}
                    </label>

                    <p>
                        {question.subject} | {question.difficulty} | {" "}
                        {question.marks} markss
                    </p>
                </div>
            ))}

            <hr />
            <p>
                Selected Question:{" "}
                <strong>{selectedQuestions.length}</strong>
            </p>

            <p>
                Duration:{" "}
                <strong>{duration} minutes</strong>
            </p>

            <button onClick={handlePublish}>
                Publish Assessment
            </button>
        </div>
    );
}

export default CreateAssessment;