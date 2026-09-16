import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function initExam()
{
    return (
        <div className="flex flex-col gap-4">
            <Input placeholder="Exam Name" />
            <Input placeholder="Exam Description" />
            <Button>Submit</Button>
        </div>
    )
}