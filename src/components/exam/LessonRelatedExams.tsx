import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PATHS } from "@/utils/router/paths"
import { lessonExamService } from "@/services/lesson_exam_service"
import { examApi } from "@/utils/lib/exam_api/requests"
import type { ExamSummary } from "@/utils/types/exam"

export function LessonRelatedExams({ lessonUuid }: { lessonUuid: string }) {
  const navigate = useNavigate()
  const [exams, setExams] = useState<ExamSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [startingExamId, setStartingExamId] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    lessonExamService
      .list(lessonUuid, controller.signal)
      .then(setExams)
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Could not load exams for lesson", error)
          setExams([])
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [lessonUuid])

  async function startExam(examId: string) {
    if (startingExamId) return
    setStartingExamId(examId)
    setStartError(null)
    try {
      const { data } = await examApi.startPaper(examId)
      navigate(PATHS.examPaperView(data.id))
    } catch (error) {
      setStartError(error instanceof Error ? error.message : "Unable to start the exam.")
    } finally {
      setStartingExamId(null)
    }
  }

  return (
    <section className="rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Lesson related</h2>
        <Link className="underline" to={PATHS.examAuthoringForLesson(lessonUuid)}>
          Create an exam
        </Link>
      </div>
      {loading ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading exams…</p>
      ) : exams.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No exams linked to this lesson.</p>
      ) : (
        <>
          <ul className="mt-3 space-y-2">
            {exams.map((exam) => (
              <li key={exam.id}>
                <button
                  type="button"
                  className="underline disabled:opacity-50"
                  onClick={() => void startExam(exam.id)}
                  disabled={startingExamId !== null}
                >
                  {startingExamId === exam.id ? "Starting exam…" : exam.title ?? "Untitled exam"}
                </button>
              </li>
            ))}
          </ul>
          {startError && (
            <p role="alert" className="mt-3 text-sm text-destructive">{startError}</p>
          )}
        </>
      )}
    </section>
  )
}
