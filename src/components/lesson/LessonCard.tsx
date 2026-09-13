import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Lesson } from "@/utils/types/lesson"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "../ui/button"
import { router } from "@/utils/router"

interface LessonCardProps {
  Lesson: Lesson
  maxLen?: number
  className?: string
}

export default function LessonCard({
  Lesson,
  maxLen = 120,
  className,
}: LessonCardProps) {
  const [showMore, setShowMore] = useState(false)
  const text = Lesson.description
  className += ' w-full max-w-sm'
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center p-2 text-lg font-semibold">
          {Lesson.title}
        </CardTitle>
        <CardDescription>
          <span>
            {text
              ? showMore
                ? text
                : `${text.substring(0, maxLen)}`
              : "no description"}
          </span>
          {text && text.length > maxLen && (
            <Button variant="outline" onClick={() => setShowMore(!showMore)}>
              {showMore ? "↑" : "..."}
            </Button>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {Lesson.tags.map((tag) => {
            return (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <h1>Lesson created by: </h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            return router.navigate(`/profile/${Lesson.author}`)
          }}
        >
          {Lesson.author}
        </Button>
      </CardFooter>
    </Card>
  )
}
