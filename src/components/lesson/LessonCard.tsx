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
  maxLen = 80,
  className,
}: LessonCardProps) {
  const [showMore, setShowMore] = useState(false)
  const text = Lesson.description
  const lessonAddr = `/${Lesson.author}/${Lesson.slug}/`
  return (
    <Card className={`flex h-full flex-col overflow-hidden ${className}`}>
      <CardHeader className="flex-1">
        <CardTitle className="text-center text-lg font-semibold">
          <Button
            variant="ghost"
            className="text-lg font-semibold w-full max-w-sm"
            onClick={() => {
              return router.navigate(lessonAddr)
            }}
          >
            {" "}
            {Lesson.title}
          </Button>
        </CardTitle>
        <CardDescription>
          {text && text.length > 0 ? (
            <div className="flex item-end gap-2 max-h-16">
              <p
                className={`${showMore ? "overflow-y-auto pr-2" : "line-clamp-4 flex-1"}`}
              >
                {text}
              </p>
              {text && text.length > maxLen && (
                <Button
                  className="center"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "↑" : "..."}
                </Button>
              )}
            </div>
          ) : (
            <p className="text-center text-lg">No description</p>
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
      <CardFooter className="mt-auto">
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
