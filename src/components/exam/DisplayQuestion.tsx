import type { Question } from '@/utils/types/exam'
import { useTranslation } from 'react-i18next'

type DisplayQuestionProps =
{
    question: Question
}

export function DisplayQuestion({ question }: DisplayQuestionProps)
{
    const { t } = useTranslation()
    return (
        <div>
            <strong>{t('question', 'Question:')}</strong> {question.text}
            <br />

            <strong>{t('type', 'Type:')}</strong> {question.type}
            <br />

            {question.type === 'multiple_choice' && (
                <>
                    <strong>{t('choix2', 'Choix:')}</strong>
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
                    <strong>{t('rponsesAcceptes', 'Réponses acceptées:')}</strong>
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
