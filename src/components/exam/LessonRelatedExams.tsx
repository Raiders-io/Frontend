import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PATHS } from "@/utils/router/paths"
import { lessonExamService } from "@/services/lesson_exam_service"
import type { ExamSummary } from "@/utils/types/exam"

export function LessonRelatedExams({ lessonUuid }: { lessonUuid: string }) {
  const [exams, setExams] = useState<ExamSummary[]>([])
  const [loading, setLoading] = useState(true)

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
        <ul className="mt-3 space-y-2">
          {exams.map((exam) => (
            <li key={exam.id}>
              <Link className="underline" to={PATHS.examPaperView(exam.id)}>
                {exam.title ?? "Untitled exam"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
