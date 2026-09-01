import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateQuestion } from '@/pages/exam/Question'
import type { Question } from '@/utils/types/exam'

export default function ExamAuthoring()
{
    const [questions, setQuestions] = useState<Question[]>([])

    function handleAddQuestion(question: Question) 
    {
        setQuestions((previousQuestions) => [...previousQuestions, question])
    }

    return (
    <>
    <h1>Exam Authoring</h1>
    {createExam()}
    <p>
        Questions ajoutées : {questions.length}
        <br />
        {questions.map((question) => (
            <div key={question.id}>
                <strong>Question:</strong> {question.text}
                <br />
                <strong>Type:</strong> {question.type}
                <br />
                {question.type === 'exact_answer' && (
                    <>
                        <strong>Réponses acceptées:</strong>
                        <ul className="ml-4 list-disc">
                            {question.answers?.map((ans, index) => (
                                <li key={index}>{ans}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        ))}
    </p>
    <CreateQuestion onAdd={handleAddQuestion} />
    </>
    )
}

export function createExam()
{
    return (
        <div className="flex flex-col gap-4">
            <Input placeholder="Exam Name" />
            <Input placeholder="Exam Description" />
            <Button>Submit</Button>
        </div>
    )
}