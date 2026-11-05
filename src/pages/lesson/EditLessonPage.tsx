import LessonForm from "@/components/lesson/LessonForm";
import { LessonToSchema, type UpdateLessonPayload } from "@/utils/schema/lessonSchema";
import { lessonService } from "@/services/lesson_service";
import type { Lesson } from "@/utils/types/lesson";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function EditLessonPage() {
  const { author, slug } = useParams<{ author: string; slug: string }>()
  const [lesson, setLesson] = useState<Lesson>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)

      try {
        if (!author || !slug)
          throw Error("Missing require routes params")
        const item = await lessonService.getLessonByAuthorAndContent(author, slug)
        setLesson(item)
      } catch (error) {
        setLesson(undefined)
        toast.error(error instanceof Error)
      } finally {
        setLoading(false)
      }
    }

    fetcher()
  }, [author, slug])

  const handleSubmit = async (values: UpdateLessonPayload) => {
    console.log("Submitting Lesson:", values)
    try {
      if (!lesson)
        throw Error("Lesson not found")
      await lessonService.updateLessonById(lesson.lessonId, values)
      toast.success("Lesson updated successfully!")
    } catch (error) {
      console.error("Error creating lesson:", error)
    }
  }

  return (
    <>
      {loading
        ? <div className="flex">
          <h2 className="text-lg font-bold">Loading...</h2>
          <Spinner className="gap-2" />
        </div>
        : lesson ?
          <LessonForm
            mode="edit"
            loading={loading}
            onSubmit={handleSubmit}
            initialValues={LessonToSchema(lesson)}
          />
          : <h2 className="text-lg font-bold" >Failed to load lesson</h2>
      }
    </>
  )
}
