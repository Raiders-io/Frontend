import { useState } from 'react'
import type { ExamType } from '@/utils/types/exam'
import { ExamQuestion } from '@/components/exam/ExamQuestion'

export default function ExamPaper()
{
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string> | null>(null)

    function handleAnswerChange(questionId: string, answer: string)
    {
        setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: answer }))
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
                        <ExamQuestion
                            key={question.id}
                            question={question}
                            number={index + 1}
                            answer={answers[question.id] ?? ''}
                            onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
                        />
                    ))}
                </ol>
                <button className="rounded-md border px-4 py-2" type="submit">Submit</button>
            </form>
            {submittedAnswers && (
                <pre className="rounded-md border p-4">{JSON.stringify(submittedAnswers, null, 2)}</pre>
            )}
        </main>
    )
}