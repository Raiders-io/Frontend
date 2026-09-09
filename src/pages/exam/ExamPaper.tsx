import { useState } from 'react'
import type { ExamType } from '@/utils/types/exam'

const exam: ExamType = {
    name: 'feur',
    description: 'et coubeh en même temps c\'est ça qui est fou',
    questions: [
        {
            id: 'question-1',
            text: 'Quelle est la capitale de la République du Feuristan ?',
            type: 'multiple_choice',
            choices: [
                { id: 'choice-1', text: 'Feurs', isCorrect: true },
                { id: 'choice-2', text: 'Coubeh', isCorrect: false },
                { id: 'choice-3', text: 'Charbonnières-Lès-Bains', isCorrect: false },
            ],
        },
        {
            id: 'question-2',
            text: 'Combien y a t-il de vers dans l\'Iliade ?',
            type: 'exact_answer',
            answers: ['15693', '15693 vers', '15 693'],
        },
    ],
}

export default function ExamPaper()
{
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string> | null>(null)

    function handleAnswerChange(questionId: string, answer: string)
    {
        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [questionId]: answer,
        }))
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault()
        setSubmittedAnswers(answers)
    }

    return (
        <main className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">{exam.name}</h1>
                {exam.description && <p className="mt-2">{exam.description}</p>}
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <ol className="flex flex-col gap-4">
                {exam.questions.map((question, index) => (
                    <li key={question.id} className="rounded-md border p-4">
                        <p className="font-semibold">
                            {index + 1}. {question.text}
                        </p>

                        {question.choices && (
                            <ul className="mt-2 flex flex-col gap-1">
                                {question.choices.map((choice) => (
                                    <li key={choice.id}>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={choice.id}
                                                checked={answers[question.id] === choice.id}
                                                onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                                            />
                                            {choice.text}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {question.type === 'exact_answer' && (
                            <input
                                className="mt-2 w-full rounded-md border p-2"
                                type="text"
                                value={answers[question.id] ?? ''}
                                onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                                placeholder="Votre réponse"
                            />
                        )}
                    </li>
                ))}
                </ol>

                <button className="rounded-md border px-4 py-2" type="submit">
                    Envoyer mes réponses
                </button>
            </form>

            {submittedAnswers && (
                <pre className="rounded-md border p-4">
                    {JSON.stringify(submittedAnswers, null, 2)}
                </pre>
            )}
        </main>
    )
}