import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateQuestion } from '@/pages/exam/Question'
import type { Question } from '@/utils/types/exam'

export default function ExamAuthoring()
{
    const [questions, setQuestions] = useState<Question[]>([])

    return (
    <>
    <h1>Exam Authoring</h1>
    {createExam()}
    <CreateQuestion />
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