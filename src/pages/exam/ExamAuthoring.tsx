import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateQuestion } from '@/pages/exam/Question'

export default function ExamAuthoring()
{
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