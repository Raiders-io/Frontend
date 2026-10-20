import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { examApi } from "@/utils/lib/exam_api/requests"

type ExamOption = {
  id: string
  title: string | null
  description: string | null
}

export default function ExamPaperList() {
  const navigate = useNavigate()
  const [exams, setExams] = useState<ExamOption[]>([])
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
      navigate(`/exam/paper/${data.id}`)
    } catch {
      setMessage(
        "Unable to start the exam. Check your authentication.",
      )
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Exams</h1>
      <div className="divide-y divide-gray-300/50 rounded-md border">
        {exams.map((exam) => (
          <button
            className="block w-full px-4 py-3 text-left transition-colors first:rounded-t-md last:rounded-b-md hover:bg-muted/50"
            key={exam.id}
            type="button"
            onClick={() => startExam(exam.id)}
          >
            <span className="block">
              {exam.title || "Untitled exam"}
            </span>
            <span className="block text-sm text-muted-foreground/70">
              {exam.description?.substring(0, 100) || "No description provided."}
            </span>
          </button>
        ))}
      </div>
      {message && <p role="status">{message}</p>}
    </main>
  )
}
