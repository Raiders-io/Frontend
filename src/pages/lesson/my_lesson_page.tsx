import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
  Filter,
  LayoutGrid,
} from "lucide-react"
import LessonActions from "@/components/lesson/LessonActions"
import FileLessonsView from "@/components/lesson/FileLessonsView"

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
        const lessonsData = await lessonService.getAllLessons()
        setLessons(lessonsData)

        // Collect all unique files from all lessons
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

  const handleTogglePrivacy = async (lessonUUID: string) => {
    try {
      const lesson = lessons.find((l) => l.UUID === lessonUUID)
      if (!lesson) return

      await lessonService.updateLessonById(lessonUUID, {
        privacy: !lesson.isPrivate,
      })

      setLessons((prev) =>
        prev.map((l) =>
          l.UUID === lessonUUID ? { ...l, isPrivate: !l.isPrivate } : l
        )
      )
    } catch (error) {
      console.error("Error toggling privacy:", error)
    }
  }

  const handleDelete = async (lessonUUID: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return
    try {
      await lessonService.deleteLessonById(lessonUUID)
      setLessons((prev) => prev.filter((l) => l.UUID !== lessonUUID))
    } catch (error) {
      console.error("Error deleting lesson:", error)
    }
  }

  const filteredLessons = lessons.filter((lesson) => {
    if (viewMode === "public") return !lesson.isPrivate
    if (viewMode === "private") return lesson.isPrivate
    return true
  })

  const publicCount = lessons.filter((l) => !l.isPrivate).length
  const privateCount = lessons.filter((l) => l.isPrivate).length

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading your lessons...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Lessons</h1>
            <p className="text-sm text-muted-foreground">
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} total
            </p>
          </div>
          <Link to="/lesson/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Lesson
            </Button>
          </Link>
        </div>
      </header>

      {/* Controls */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("all")}
              className="gap-1.5"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              All ({lessons.length})
            </Button>
            <Button
              variant={viewMode === "public" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("public")}
              className="gap-1.5"
            >
              <Globe className="h-3.5 w-3.5" />
              Public ({publicCount})
            </Button>
            <Button
              variant={viewMode === "private" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("private")}
              className="gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              Private ({privateCount})
            </Button>
            <Button
              variant={viewMode === "by-file" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("by-file")}
              className="gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              By File
            </Button>
          </div>

          {viewMode === "by-file" && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
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
            </div>
          )}
        </div>

        {/* Content */}
        {viewMode === "by-file" ? (
          <FileLessonsView
            lessons={lessons}
            files={files}
            selectedFilename={selectedFilename}
          />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.UUID}
                  lesson={lesson}
                  variant="preview"
                  actions={
                    <LessonActions
                      lesson={lesson}
                      onTogglePrivacy={handleTogglePrivacy}
                      onDelete={handleDelete}
                    />
                  }
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-muted p-4">
                  <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No lessons found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {viewMode === "all"
                    ? "Create your first lesson to get started."
                    : `You don't have any ${viewMode} lessons yet.`}
                </p>
                <Link to="/lesson/new">
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Create Lesson
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}