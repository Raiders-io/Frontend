import type { Lesson } from "@/utils/types/lesson"
import SkeletonCard from "@/components/ui/skeletonCard"
import LessonCard from "@/components/lesson/LessonCard"
import LessonPagination from "./LessonPagination"

interface LessonTabProps {
  Lessons: Lesson[]
  loading: boolean
  currentPage: number
  totalPages: number
  limit: number
  onPageChange: (page: number) => void
  className?: string
}
//Change of design between skeleton and real
export default function LessonTab({
  Lessons,
  loading,
  currentPage,
  totalPages,
  limit,
  onPageChange,
  className,
}: LessonTabProps) {
  return (
    <div className={`${className}`}>
      {totalPages > 1 && (
        <LessonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] items-stretch">
        {loading ? (
          Array.from({ length: limit }).map((_, index) => (
            <SkeletonCard key={index} className="" />
          ))
        ) : Lessons && Lessons.length > 0 ? (
          Lessons.map((Lesson) => {
            return <LessonCard Lesson={Lesson} className="" />
          })
        ) : (
          <div className="text-center font-bold text-2xl p-6">
            <h1>No lessons found</h1>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <LessonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
