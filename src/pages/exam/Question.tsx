import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Question } from '@/utils/types/exam'

type CreateQuestionProps = 
{
    onAdd?: (question: Question) => void
}

export default function Question({ onAdd }: CreateQuestionProps) 
{
    return <CreateQuestion onAdd={onAdd} />
}

export function CreateQuestion({ onAdd }: CreateQuestionProps) 
{
    const [text, setText] = useState('')
    const [type, setType] = useState<Question['type']>('multiple_choice')
    const [answer, setAnswer] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) 
    {
        event.preventDefault()

        if (!text.trim()) 
        {
            return
        }

        const newQuestion: Question =
        {
            id: Date.now().toString(),
            text: text.trim(),
            type,
            answer: answer.trim() || undefined,
        }

        onAdd?.(newQuestion)
        setText('')
        setType('multiple_choice')
        setAnswer('')
    }
    switch (type)
    {
        case 'multiple_choice':
            return (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Question" />

                    <select className="border rounded-md p-2" value={type} onChange={(event) => setType(event.target.value as Question['type'])}>
                        <option value="multiple_choice">Choix</option>
                        <option value="exact_answer">Réponses possibles</option>
                    </select>
                    <Button type="submit">Submit</Button>
                </form>
            )
        case 'exact_answer':
            return (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Question" />

                    <select className="border rounded-md p-2" value={type} onChange={(event) => setType(event.target.value as Question['type'])}>
                        <option value="multiple_choice">Choix</option>
                        <option value="exact_answer">Réponse</option>
                    </select>

                    <Input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Réponse" />
                    <Button type="submit">Submit</Button>
                </form>
            )
    }
}