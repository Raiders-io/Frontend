import { CreateQuestion } from '@/pages/exam/Question'
import { DisplayQuestion } from '@/components/exam/DisplayQuestion'
import type { Question } from '@/utils/types/exam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { examApi, toQuestion } from '@/utils/lib/exam_api'
import { GripVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function ExamAuthoring()
{
    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [draggedQuestionIndex, setDraggedQuestionIndex] = useState<number | null>(null)

    async function handleAddQuestion(question: Question)
    {
        try {
            const { data } = await examApi.createQuestion({
                title: question.text,
                questionType: question.type === 'multiple_choice' ? 'MCQ' : question.type === 'exact_answer' ? 'TEXT' : 'DEFAULT',
                goodAnswers: question.type === 'multiple_choice'
                    ? question.choices?.filter((choice) => choice.isCorrect).map((choice) => choice.text) ?? []
                    : question.answers ?? [],
                badAnswers: question.choices?.filter((choice) => !choice.isCorrect).map((choice) => choice.text) ?? [],
            })
            setQuestions((previousQuestions) => [...previousQuestions, toQuestion(data, previousQuestions.length + 1)])
            setMessage('Question créée.')
        } catch {
            setMessage('La création de la question a échoué.')
        }
    }

    function handleDropQuestion(targetIndex: number)
    {
        setQuestions((previousQuestions) => {
            if (draggedQuestionIndex === null || draggedQuestionIndex === targetIndex) return previousQuestions

            const reorderedQuestions = [...previousQuestions]
            const [movedQuestion] = reorderedQuestions.splice(draggedQuestionIndex, 1)
            reorderedQuestions.splice(targetIndex, 0, movedQuestion)
            return reorderedQuestions.map((question, questionIndex) => ({ ...question, pos: questionIndex + 1 }))
        })
        setDraggedQuestionIndex(null)
    }

    async function handleRemoveQuestion(question: Question)
    {
        try {
            await examApi.deleteQuestion(Number(question.id))
            setQuestions((previousQuestions) => previousQuestions
                .filter((currentQuestion) => currentQuestion.id !== question.id)
                .map((currentQuestion, index) => ({ ...currentQuestion, pos: index + 1 })))
            setMessage('Question supprimée.')
        } catch {
            setMessage('La suppression de la question a échoué.')
        }
    }

    async function handleCreateExam(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault()
        if (!title.trim() || questions.length === 0) return
        try {
            await examApi.createExam({
                title: title.trim(),
                questions: questions.map((question, index) => ({ id: Number(question.id), position: index + 1, points: 1 })),
            })
            setMessage('Examen créé.')
            setTitle('')
        } catch {
            setMessage('La création de l’examen a échoué.')
        }
    }

    return (
        <main className="flex flex-col gap-6 p-6">
            <h1 className="text-3xl font-bold">Exam Authoring</h1>
            <form className="flex flex-col gap-3" onSubmit={handleCreateExam}>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nom de l'examen" />
                <Button type="submit" disabled={!title.trim() || questions.length === 0}>Créer l'examen</Button>
            </form>
            <section>
                <p>Questions ajoutées : {questions.length}</p>
                {questions.map((question, index) => (
                    <div
                        key={question.id}
                        draggable
                        onDragStart={() => setDraggedQuestionIndex(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleDropQuestion(index)}
                        onDragEnd={() => setDraggedQuestionIndex(null)}
                        className="cursor-grab active:cursor-grabbing"
                        aria-label={`Question ${question.pos}, glisser pour déplacer`}
                    >
                        <div className="flex items-center gap-2">
                            <GripVertical aria-hidden="true" className="text-muted-foreground" />
                            <strong>Question {question.pos}:</strong> {question.text}
                        </div>
                        <br />
                        <strong>Type:</strong> {question.type}
                        <DisplayQuestion question={question} />
                        <div className="flex gap-2 py-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                aria-label="Supprimer la question"
                                title="Supprimer la question"
                                onClick={() => void handleRemoveQuestion(question)}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    </div>
                ))}
            </section>
            <CreateQuestion onAdd={handleAddQuestion} />
            {message && <p role="status">{message}</p>}
        </main>
    )
}