import LessonForm from "@/components/lesson/LessonForm"
import { lessonService } from "@/services/lesson_service"
import type { CreateLessonPayload } from "@/utils/schema/lessonSchema"
// import FileListWidget from "@/components/FileListWidget"

/**
 * The page only owns what is specific to "creating a lesson":
 * layout + what happens on submit.
 */
export default function LessonCreationPage() {
  const handleSubmit = async (values: CreateLessonPayload) => {
    console.log("Submitting Lesson:", values)
    try {
      await lessonService.createLesson(values)
    } catch (error) {
      console.error("Error creating lesson:", error)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <LessonForm
          mode="create"
          onSubmit={handleSubmit}
          // renderAttachmentPicker={(p) => <FileListWidget mode="compact" {...p} />}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
 * Lesson page (edit / read-only) - same component, different props:
 *
 * export default function LessonPage({ params }: { params: { id: string } }) {
 *   const { lesson, isLoading, canEdit } = useLesson(params.id)
 *
 *   return (
 *     <LessonForm
 *       mode="edit"
 *       initialValues={lesson}          // can arrive late, the form re-syncs
 *       loading={isLoading}
 *       readOnly={!canEdit}
 *       onSubmit={(v) => lessonService.updateLesson(params.id, v)}
 *       footerActions={<Button variant="destructive">Delete</Button>}
 *     />
 *   )
 * }
 * ------------------------------------------------------------------ */
