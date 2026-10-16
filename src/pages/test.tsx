import LessonCard from "@/components/lesson/LessonCard"
import { mockLesson } from "@/utils/mock"

export default function TestPage() {
  const lesson = mockLesson

  return (
    <div>
      <h1> This is a test page it should be removed from the final project</h1>
      <div className="flex">
        <LessonCard Lesson={lesson[0]} />
      </div>
    </div>
  )
}
