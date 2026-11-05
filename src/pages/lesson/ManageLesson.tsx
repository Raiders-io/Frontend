import { useEffect, useMemo, useState } from "react"
import { lessonService } from "@/services/lesson_service"
import type { Lesson } from "@/utils/types/lesson"
import type { file as FileItem } from "@/utils/types/lesson"
import LessonCard from "@/components/lesson/LessonCard"
import { Button } from "@/components/ui/button"
import {
  Plus,
  FileText,
  Lock,
  Globe,
  LayoutGrid,
} from "lucide-react"
import LessonActions from "@/components/lesson/LessonActions"
import FileLessonsView from "@/components/lesson/FileLessonsView"
import { changePageLessonCreate } from "@/utils/router/changePage"
import SelectPanel from "@/components/search/SelectPanel"

type ViewMode = "all" | "public" | "private" | "by-file"

export default function MyLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await lessonService.getAllLessons()

        const lessonsData = Array.isArray(response)
          ? response
          : (response && Array.isArray((response as any).data) ? (response as any).data : [])
        setLessons(lessonsData)

        const allFiles = new Map<string, FileItem>()
        for (const lesson of lessonsData) {
          if (lesson.files) {
            for (const file of lesson.files) {
              allFiles.set(file.filename, file)
            }
          }
        }
        setFiles(Array.from(allFiles.values()))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTogglePrivacy = async (lessonId: string) => {
    try {
      const lesson = lessons.find(
        (l) => l.lessonId === lessonId
      )
      if (!lesson) return

      await lessonService.updateLessonById(lessonId, {
        privacy: !lesson.isPrivate,
      })
      setLessons((prev) =>
        prev.map((l) =>
          l.lessonId === lessonId
            ? { ...l, isPrivate: !l.isPrivate }
            : l
        )
      )
    } catch (error) {
      console.error("Error toggling privacy:", error)
    }
  }

  const PanelRender = (option: String) => {
    switch (option) {
      case "all":
        return (
          <>
            <LayoutGrid className="h-3.5 w-3.5" />
            All ({lessons.length})
          </>
        )
      case "public":
        return (
          <>
            <Globe className="h-3.5 w-3.5" />
            Public ({publicCount})
          </>
        )
      case "private":
        return (
          <>
            <Lock className="h-3.5 w-3.5" />
            Private ({privateCount})
          </>
        )
      case "by-file":
        return (
          <>
            <FileText className="h-3.5 w-3.5" />
            By File
          </>
        )
    }
  }

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return
    try {
      await lessonService.deleteLessonById(lessonId)
      setLessons((prev) =>
        prev.filter((l) => l.lessonId !== lessonId)
      )
    } catch (error) {
      console.error("Error deleting lesson:", error)
    }
  }

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (viewMode === "public") return !lesson.isPrivate
      if (viewMode === "private") return lesson.isPrivate
      return true
    })
  }, [lessons, viewMode])

  const publicCount = lessons.filter((l) => !l.isPrivate).length
  const privateCount = lessons.filter((l) => l.isPrivate).length

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="rounded-lg border border-border bg-muted/60 p-4 shadow-sm md:p-6 dark:bg-muted/30">
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading your lessons...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && lessons?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-4">
          <LayoutGrid className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No lessons found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first lesson to get started.
        </p>
        <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={changePageLessonCreate}>
          <Plus className="h-4 w-4" />
          Create Lesson
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Enclosedpanel — same surface as search.tsx */}
      <div className="rounded-lg border border-border bg-muted/60 p-4 shadow-sm md:p-6 dark:bg-muted/30">
        {/* Header: title on the left, segmented view toggle on the right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">My Lessons</h1>
            <span className="text-sm text-muted-foreground">
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>

          {/* Segmented control — identical pattern to search.tsx */}
          <SelectPanel
            options={["all", "public", "private", "by-file"]}
            viewMode={viewMode}
            setViewMode={setViewMode}
            render={PanelRender}
          />
        </div>

        {/* File filter (only visible in "by-file" mode) */}
        {viewMode === "by-file" && (
          <div className="mb-6 flex items-center gap-2">
            <select
              value={selectedFilename ?? ""}
              onChange={(e) => setSelectedFilename(e.target.value || null)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All files</option>
              {files.map((file) => (
                <option key={file.filename} value={file.filename}>
                  {file.filename}
                </option>
              ))}
            </select>
            <Button size="sm" className="gap-2" onClick={changePageLessonCreate}>
              <Plus className="h-4 w-4" />
              New Lesson
            </Button>
          </div>
        )}

        {/* New Lesson button (when not in by-file mode) */}
        {viewMode !== "by-file" && (
          <div className="mb-6 flex justify-end">
            <Button size="sm" className="gap-2" onClick={changePageLessonCreate}>
              <Plus className="h-4 w-4" />
              New Lesson
            </Button>
          </div>
        )}

        {/* Content */}
        {viewMode === "by-file" ? (
          <FileLessonsView
            lessons={lessons}
            files={files}
            selectedFilename={selectedFilename}
          />
        ) : (
          <>
            {filteredLessons.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.lessonId}
                    lesson={lesson}
                    variant="small"
                    actions={
                      <LessonActions
                        lesson={lesson}
                        onTogglePrivacy={handleTogglePrivacy}
                        onDelete={handleDelete}
                      />
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-muted p-4">
                  <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No lessons found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {viewMode === "all"
                    ? "Create your first lesson to get started."
                    : `You don't have any ${viewMode} lessons yet.`}
                </p>
                <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={changePageLessonCreate}>
                  <Plus className="h-4 w-4" />
                  Create Lesson
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
