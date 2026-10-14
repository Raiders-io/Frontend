import { initExam } from '@/components/exam/InitExam'
import { CreateQuestion } from '@/pages/exam/Question'
import { DisplayQuestion } from '@/components/exam/DisplayQuestion'
import type { Question } from '@/utils/types/exam'
import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'


export default function ExamAuthoring()
{
    const { t } = useTranslation()
    const [questions, setQuestions] = useState<Question[]>([])

    function handleAddQuestion(question: Question) 
    {
        setQuestions((previousQuestions) => [...previousQuestions, question])
    }

    return (
    <>
    <h1>{t('examAuthoring', 'Exam Authoring')}</h1>
    {initExam()}
    <p><Trans i18nKey="questionsAjoutesLengthQuestionslengthBr">Questions ajoutées : {{ length: questions.length }}
        <br /></Trans>{questions.map((question) => (
            <div key={question.id}>
                <br />
                <strong>{t('questionPos', 'Question {{pos}}:', { pos: question.pos })}</strong> {question.text}
                <br />
                <strong>{t('type', 'Type:')}</strong> {question.type}
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