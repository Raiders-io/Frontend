import { initExam } from '@/components/exam/InitExam'
import { CreateQuestion } from '@/pages/exam/Question'
import { DisplayQuestion } from '@/components/exam/DisplayQuestion'
import type { Question } from '@/utils/types/exam'
import { useState } from 'react'


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
    {initExam()}
    <p>
        Questions ajoutées : {questions.length}
        <br />
        {questions.map((question) => (
            <div key={question.id}>
                <br />
                <strong>Question {question.pos}:</strong> {question.text}
                <br />
                <strong>Type:</strong> {question.type}
                <br />
                <DisplayQuestion question={question} />
                <br />
            </div>
        ))}
    </p>
    <CreateQuestion onAdd={handleAddQuestion} />
    </>
    )
}