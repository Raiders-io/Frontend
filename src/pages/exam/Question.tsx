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
    const [answers, setAnswers] = useState<string[]>([])
    const [currentAnswer, setCurrentAnswer] = useState('')

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
            answers: type === 'exact_answer' && answers.length > 0 ? answers : undefined,
        }

        onAdd?.(newQuestion)
        setText('')
        setType('multiple_choice')
        setAnswer('')
        setAnswers([])
        setCurrentAnswer('')
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
                        <option value="exact_answer">Réponses possibles</option>
                    </select>

                    <div className="flex gap-2">
                        <Input 
                            value={currentAnswer} 
                            onChange={(event) => setCurrentAnswer(event.target.value)} 
                            placeholder="Ajouter une réponse possible" 
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault()
                                    if (currentAnswer.trim()) {
                                        setAnswers([...answers, currentAnswer.trim()])
                                        setCurrentAnswer('')
                                    }
                                }
                            }}
                        />
                        <Button 
                            type="button"
                            onClick={() => {
                                if (currentAnswer.trim()) {
                                    setAnswers([...answers, currentAnswer.trim()])
                                    setCurrentAnswer('')
                                }
                            }}
                        >
                            +
                        </Button>
                    </div>

                    {answers.length > 0 && (
                        <div className="border rounded-md p-2 bg-gray-50">
                            <p className="font-semibold text-sm mb-2">Réponses acceptées:</p>
                            {answers.map((ans, index) => (
                                <div key={index} className="flex justify-between items-center mb-1">
                                    <span>{ans}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAnswers(answers.filter((_, i) => i !== index))}
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button type="submit" disabled={answers.length === 0}>Submit</Button>
                </form>
            )
    }
}