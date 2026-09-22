import CodeEditor from '@/components/exam/CodeEditor'
import type { Question } from '@/utils/types/exam'

type ExamQuestionProps = 
{
    question: Question
    number: number
    answer: string
    onAnswerChange: (answer: string) => void
}

export function ExamQuestion({ question, number, answer, onAnswerChange }: ExamQuestionProps)
{
    return (
        <li className="rounded-md border p-4">
            <p className="font-semibold">{number}. {question.text}</p>

            {question.choices && (
                <ul className="mt-2 flex flex-col gap-1">
                    {question.choices.map((choice) => (
                        <li key={choice.id}>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={choice.id}
                                    checked={answer === choice.id}
                                    onChange={(event) => onAnswerChange(event.target.value)}
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
                    value={answer}
                    onChange={(event) => onAnswerChange(event.target.value)}
                    placeholder="Answer..."
                />
            )}

            {question.type === 'c_code' && (
                <CodeEditor value={answer} onChange={onAnswerChange} language={"c"}/>
            )}
        </li>
    )
}