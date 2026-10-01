import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ExamPaperView from '@/components/exam/ExamPaper'
import { examApi, type ExamPaper as ExamPaperData } from '@/utils/lib/exam_api'

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
            {paper && (
                <ExamPaperView
                    paper={paper}
                    answers={answers}
                    onAnswerChange={(answerId, answer) => setAnswers((current) => ({ ...current, [answerId]: answer }))}
                    onSubmit={handleSubmit}
                />
            )}
            {message && <p role="status">{message}</p>}
        </main>
    )
}