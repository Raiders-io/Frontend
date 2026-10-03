import type { Lesson } from "@/utils/types/lesson"
import SkeletonCard from "@/components/ui/skeletonCard"
import LessonCard from "@/components/lesson/LessonCard"
import LessonPagination from "./LessonPagination"
import React from "react"

interface serializeItem<T> {
  kind: string
  data: T
}

interface PaginatedGripProps<T> {
  items: serializeItem<T>[]
  renderItem: (item: serializeItem<T>) => React.ReactNode
  getKey: (item: serializeItem<T>) => React.Key
  className: string
  loading: boolean
  limit: number
}

// export default function PaginatedGrip<T>({
//   items,
//   renderItem,
//   getKey,
//   loading,
//   limit,
//   className,
// }: PaginatedGripProps<T>) {
//   return (
//     <div className={className}>
//       <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] items-stretch">
//         {loading ? (
//           Array.from({ length: limit }).map((_, index) => (
//             <SkeletonCard key={index} className="" />
//           ))
//         ) : items && items.length > 0 ? (
//           items.map((item, index) => {
//             const key = getKey ? getKey(item) : index
//             return <React.Fragment key={key}>{renderItem(item)}</React.Fragment>
//           })
//         ) : (
//           <div className="text-center font-bold text-2xl p-6">
//             <h1>No items found</h1>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

export function SearchResultTab() {
  return <></>
}
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
