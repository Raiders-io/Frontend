import { useEffect, useState } from "react"
import ExamPaperView from "@/components/exam/ExamPaper"
import { examApi, type ExamPaper as ExamPaperData } from "@/utils/lib/exam_api"

type ExamOption = { id: string; title: string | null }

export default function ExamPaper() {
  const [exams, setExams] = useState<ExamOption[]>([])
  const [paper, setPaper] = useState<ExamPaperData | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

  useEffect(() => {
    examApi
      .listExams()
      .then(({ data }) => setExams(data))
      .catch(() => setMessage("Unable to load exams."))
  }, [])

  async function startExam(examId: string) {
    try {
      const { data } = await examApi.startPaper(examId)
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
      <h1 className="text-3xl font-bold">Exams</h1>
      {!paper && (
        <div className="divide-y divide-gray-300/50 rounded-md border">
          {exams.map((exam) => (
            <button
              className="block w-full px-4 py-3 text-left transition-colors first:rounded-t-md last:rounded-b-md hover:bg-muted/50"
              key={exam.id}
              type="button"
              onClick={() => startExam(exam.id)}
            >
              {exam.title || "Untitled exam"}
            </button>
          ))}
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
