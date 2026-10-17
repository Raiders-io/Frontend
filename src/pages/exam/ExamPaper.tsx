import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ExamPaperView from "@/components/exam/ExamPaper"
import { examApi, type ExamPaper as ExamPaperData } from "@/utils/lib/exam_api"

export default function ExamPaper() {
  const { id } = useParams<{ id: string }>()
  const [paper, setPaper] = useState<ExamPaperData | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!id) return

    examApi
      .getPaper(id)
      .then(({ data }) => {
        setPaper(data)
        setAnswers(
          Object.fromEntries(
            data.answers.map((answer) => [answer.id, answer.answer ?? ""]),
          ),
        )
      })
      .catch(() => setMessage("Unable to load this exam paper."))
  }, [id])

  if (!id) {
    return <p role="alert">No exam paper ID provided.</p>
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
      setMessage(`Your score is ${data.score.toFixed(0)}%.`)
    } catch {
      setMessage("Failed to submit answers.")
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      {!paper && !message && <p>Loading exam paper...</p>}
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