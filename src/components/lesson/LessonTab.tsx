import type { Lesson } from "@/utils/types/lesson";
// import Skeleton from '@components/utils/skeleton'
import { useState } from "react";
import LessonCard from "./LessonCard";

interface LessonTabProps {
  Lessons: Lesson[]
  className?: string
}

export default function LessonTab({
  Lessons,
  className,
}: LessonTabProps) {
  const [loading, setLoading] = useState(false)
  className += 'grid grid-cols-3'
  return (
    <div className={className}>
      {Lessons.map((Lesson) => {
        return <LessonCard Lesson={Lesson}/>
      })}
    </div>
  )
}