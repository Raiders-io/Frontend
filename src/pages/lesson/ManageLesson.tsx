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
  List,
} from "lucide-react"
import LessonActions from "@/components/lesson/LessonActions"
import FileLessonsView from "@/components/lesson/FileLessonsView"
import { changePageLessonCreate } from "@/utils/router/changePage"
import SelectPanel from "@/components/search/SelectPanel"
import BackgroundPanel from "@/components/homemade/BackgroundPanel"
import type { ItemLayout } from "@/components/search/ItemGrid"
import ItemGrid from "@/components/search/ItemGrid"

type ViewMode = "all" | "public" | "private" | "by-file"

export default function MyLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [layout, setLayout] = useState<ItemLayout>('grid')
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await lessonService.getAllLessons()

        const lessonsData = Array.isArray(response) ? response : [];
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

  const PanelRender = (option: string) => {
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
      <BackgroundPanel title="My Lessons">
        <p className="text-muted-foreground">Loading your lessons...</p>
      </BackgroundPanel>
    )
  }

  if (!loading && lessons?.length === 0) {
    return (
      <BackgroundPanel>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-4">
            <LayoutGrid className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No lessons found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first lesson to get started.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 gap-2"
            onClick={changePageLessonCreate}>
            <Plus className="h-4 w-4" />
            Create Lesson
          </Button>
        </div>
      </BackgroundPanel>
    )
  }

  return (
    <BackgroundPanel
      title="My Lessons"
      subtitle={`${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`}
      controls={
        <div className="flex flex-wrap items-center - gap-2">
          <SelectPanel
            options={["all", "public", "private", "by-file"]}
            viewMode={viewMode}
            setViewMode={setViewMode}
            render={PanelRender}
          />
          <SelectPanel
            options={['grid', 'list']}
            viewMode={layout}
            setViewMode={setLayout}
            render={(mode) =>
              mode === 'grid' ? (
                <LayoutGrid className="h-4 w-4" />)
                : (<List className="h-4 w-4" />
                )
            }
          />
        </div>
      }
      toolbar={
        <div
          className={
            viewMode === "by-file"
              ? "flex items-center gap-2"
              : "flex justify-end"
          }
        >
          {/* File filter (only visible in "by-file" mode) */}
          {viewMode === "by-file" && (
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
          )}

          {/* Always visible */}
          <Button size="sm" className="gap-2" onClick={changePageLessonCreate}>
            <Plus className="h-4 w-4" />
            New Lesson
          </Button>
        </div>
      }
    >
      {/* Content */}
      {viewMode === "by-file" ? (
        <FileLessonsView
          lessons={lessons}
          files={files}
          selectedFilename={selectedFilename}
        />
      ) : (
        <ItemGrid
          items={filteredLessons}
          layout={layout}
          getKey={(lesson) => lesson.lessonId}
          renderItem={(lesson) =>
            <LessonCard
              lesson={lesson}
              variant={layout === 'grid' ? 'default' : 'preview'}
              actions={
                <LessonActions
                  lesson={lesson}
                  onTogglePrivacy={handleTogglePrivacy}
                  onDelete={handleDelete}
                />
              }
            />

          }
        />
      )}
    </BackgroundPanel>
  )
}

/* ---------------------------------------------------------------------------
 * Also update the two early returns above it in the component:
 *
 * Loading:
 *   if (loading) {
 *     return (
 *       <BackgroundPanel title="My Lessons">
 *         <p className="py-20 text-center text-muted-foreground">
 *           Loading your lessons...
 *         </p>
 *       </BackgroundPanel>
 *     )
 *   }
 *
 * Empty (`lessons.length === 0`): delete this early return entirely. The
 * inner empty state above already handles it, inside the panel.
 *
 * Import at the top:
 *   import BackgroundPanel from "@/components/search/BackgroundPanel"
 *   (adjust the path to wherever you placed the file)
 * ------------------------------------------------------------------------- */
