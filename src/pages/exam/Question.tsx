import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Question, QuestionChoice } from '@/utils/types/exam'

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
    const [choices, setChoices] = useState<QuestionChoice[]>([])
    const [currentChoice, setCurrentChoice] = useState('')

    function resetForm() 
    {
        setText('')
        setType('multiple_choice')
        setAnswer('')
        setAnswers([])
        setCurrentAnswer('')
        setChoices([])
        setCurrentChoice('')
    }

    function handleTypeChange(nextType: Question['type'])
    {
        setType(nextType)
        setAnswer('')
        setCurrentAnswer('')
        if (nextType === 'exact_answer')
        {
            setChoices([])
            setCurrentChoice('')
        }
        else
        {
            setAnswers([])
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) 
    {
        event.preventDefault()

        if (!text.trim()) 
        {
            return
        }

        if (type === 'multiple_choice')
        {
            if (choices.length < 2 || !choices.some((choice) => choice.isCorrect))
            {
                return
            }
        }
        else if (answers.length === 0)
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
            choices: type === 'multiple_choice' && choices.length > 0 ? choices : undefined,
        }

        onAdd?.(newQuestion)
        resetForm()
    }

    function addChoice() {
        const trimmedChoice = currentChoice.trim()

        if (!trimmedChoice) {
            return
        }

        setChoices((previousChoices) => [
            ...previousChoices,
            {
                id: Date.now().toString() + Math.random().toString(16).slice(2),
                text: trimmedChoice,
                isCorrect: false,
            },
        ])
        setCurrentChoice('')
    }

    function toggleChoiceCorrect(choiceId: string) {
        setChoices((previousChoices) => previousChoices.map((choice) => (
            choice.id === choiceId ? { ...choice, isCorrect: !choice.isCorrect } : choice
        )))
    }

    function removeChoice(choiceId: string) {
        setChoices((previousChoices) => previousChoices.filter((choice) => choice.id !== choiceId))
    }

    switch (type)
    {
        case 'multiple_choice':
            return (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Question" />

                    <select className="border rounded-md p-2" value={type} onChange={(event) => handleTypeChange(event.target.value as Question['type'])}>
                        <option value="multiple_choice">Choix</option>
                        <option value="exact_answer">Réponses possibles</option>
                    </select>

                    <div className="flex gap-2">
                        <Input
                            value={currentChoice}
                            onChange={(event) => setCurrentChoice(event.target.value)}
                            placeholder="Ajouter un choix de réponse"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault()
                                    addChoice()
                                }
                            }}
                        />
                        <Button type="button" onClick={addChoice}>
                            +
                        </Button>
                    </div>

                    {choices.length > 0 && (
                        <div className="border rounded-md p-2 bg-gray-50">
                            <p className="font-semibold text-sm mb-2">Choix disponibles:</p>
                            {choices.map((choice) => (
                                <div key={choice.id} className="flex justify-between items-center gap-2 mb-2">
                                    <label className="flex items-center gap-2 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={choice.isCorrect}
                                            onChange={() => toggleChoiceCorrect(choice.id)}
                                        />
                                        <span>{choice.text}</span>
                                    </label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeChoice(choice.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button type="submit" disabled={choices.length < 2 || !choices.some((choice) => choice.isCorrect)}>
                        Submit
                    </Button>
                </form>
            )
        case 'exact_answer':
            return (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Question" />

                    <select className="border rounded-md p-2" value={type} onChange={(event) => handleTypeChange(event.target.value as Question['type'])}>
                        <option value="multiple_choice">Choix</option>
                        <option value="exact_answer">Réponses possibles</option>
                    </select>

                    <div className="flex gap-2">
                        <Input 
                            value={currentAnswer} 
                            onChange={(event) => setCurrentAnswer(event.target.value)} 
                            placeholder="Ajouter une réponse possible" 
                            onKeyDown={(event) => {
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