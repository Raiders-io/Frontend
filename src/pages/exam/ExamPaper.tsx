import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ExamPaperView from "@/components/exam/ExamPaper"
import { examApi, type ExamPaper as ExamPaperData } from "@/utils/lib/exam_api"
import { DisplayResult } from "@/components/exam/DisplayResult"

type ExamOption = { id: number; title: string | null }

export default function ExamPaper() {
  const [exams, setExams] = useState<ExamOption[]>([])
  const [selectedExam, setSelectedExam] = useState("")
  const [paper, setPaper] = useState<ExamPaperData | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [message, setMessage] = useState("")

  useEffect(() => {
    examApi
      .listExams()
      .then(({ data }) => setExams(data))
      .catch(() => setMessage("Unable to load exams."))
  }, [])

  async function startExam() {
    if (!selectedExam) return
    try {
      const { data } = await examApi.startPaper(Number(selectedExam))
      const paperResponse = await examApi.getPaper(data.id)
      setPaper(paperResponse.data)
      setMessage("")
    } catch {
      setMessage(
        "Unable to start the exam. Check your authentication.",
      )
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!paper) return

    try {
      const { data } = await examApi.updatePaper(
        paper.id,
        paper.answers.map((answer) => ({
          id: answer.id,
          answer: answers[answer.id] ?? "",
        })),
      )
      const goodAnswersId = data.goodAnswersId
      const totalPoints = data.totalPoints
      setMessage("Answers submitted.")
      setMessage(
        `You got ${goodAnswersId.length} correct answers out of ${totalPoints}.`,
      )
      setMessage(`Your score is ${data.score.toFixed(0)}%.`)
    } catch {
      setMessage("Failed to submit answers.")
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Exam Paper</h1>
      {!paper && (
        <div className="flex gap-3">
          <select
            className="rounded-md border p-2"
            value={selectedExam}
            onChange={(event) => setSelectedExam(event.target.value)}
          >
            <option value="">Choose an exam</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          <Button type="button" onClick={startExam} disabled={!selectedExam}>
            Start
          </Button>
        </div>
      )}
      {paper && (
        <ExamPaperView
          paper={paper}
          answers={answers}
          onAnswerChange={(answerId, answer) =>
            setAnswers((current) => ({ ...current, [answerId]: answer }))
          }
          onSubmit={handleSubmit}
        />
      )}
      {message && <p role="status">{message}</p>}
    </main>
  )
}
