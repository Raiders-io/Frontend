import type { Question } from '@/utils/types/exam'

type DisplayQuestionProps =
{
    question: Question
}

export function DisplayQuestion({ question }: DisplayQuestionProps)
{
    return (
        <div>
            <strong>Question:</strong> {question.text}
            <br />

            <strong>Type:</strong> {question.type}
            <br />

            {question.type === 'multiple_choice' && (
                <>
                    <strong>Choix:</strong>
                    <ul className="ml-4 list-disc">
                        {question.choices?.map((choice) => (
                            <li key={choice.id}>
                                {choice.text} {choice.isCorrect ? '✅' : '❌'}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {question.type === 'exact_answer' && (
                <>
                    <strong>Réponses acceptées:</strong>
                    <ul className="ml-4 list-disc">
                        {question.answers?.map((answer, index) => (
                            <li key={index}>{answer}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}
