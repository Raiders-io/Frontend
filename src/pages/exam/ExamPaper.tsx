import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { examApi, toQuestion, type ExamPaper as ExamPaperData } from '@/utils/lib/exam_api'
import type { Question } from '@/utils/types/exam'

type ExamOption = { id: number; title: string | null }

export default function ExamPaper()
{
    const [exams, setExams] = useState<ExamOption[]>([])
    const [selectedExam, setSelectedExam] = useState('')
    const [paper, setPaper] = useState<ExamPaperData | null>(null)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [message, setMessage] = useState('')

    useEffect(() => {
        examApi.listExams()
            .then(({ data }) => setExams(data))
            .catch(() => setMessage('Impossible de charger les examens.'))
    }, [])

    async function startExam()
    {
        if (!selectedExam) return
        try {
            const { data } = await examApi.startPaper(Number(selectedExam))
            const paperResponse = await examApi.getPaper(data.id)
            setPaper(paperResponse.data)
            setMessage('')
        } catch {
            setMessage('Impossible de démarrer l\'examen. Vérifiez votre authentification.')
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault()
        if (!paper) return
        try {
            await examApi.updatePaper(paper.id, paper.answers.map((answer) => ({
                id: answer.id,
                answer: answers[answer.id] ?? '',
            })))
            setMessage('Réponses envoyées.')
        } catch {
            setMessage('L’envoi des réponses a échoué.')
        }
    }

    return (
        <main className="flex flex-col gap-6 p-6">
            <h1 className="text-3xl font-bold">Exam Paper</h1>
            {!paper && <div className="flex gap-3">
                <select className="rounded-md border p-2" value={selectedExam} onChange={(event) => setSelectedExam(event.target.value)}>
                    <option value="">Choisir un examen</option>
                    {exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
                </select>
                <Button type="button" onClick={startExam} disabled={!selectedExam}>Démarrer</Button>
            </div>}
            {paper && <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold">{paper.exam?.title}</h2>
                {paper.answers.map((answer, index) => {
                    const backendQuestion = answer.examsQuestion?.question
                    if (!backendQuestion) return null
                    const question: Question = toQuestion(backendQuestion, index + 1)
                    return <label className="flex flex-col gap-2" key={answer.id}>
                        <span className="font-semibold">{index + 1}. {question.text}</span>
                        <input className="rounded-md border p-2" value={answers[answer.id] ?? ''} onChange={(event) => setAnswers((current) => ({ ...current, [answer.id]: event.target.value }))} />
                    </label>
                })}
                <Button type="submit">Envoyer les réponses</Button>
            </form>}
            {message && <p role="status">{message}</p>}
        </main>
    )
}