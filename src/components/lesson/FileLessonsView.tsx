import { useState } from "react"
import type { Lesson } from "@/utils/types/lesson"
import type { file as FileItem } from "@/utils/types/lesson"
import LessonCard from "@/components/lesson/LessonCard"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FileText, ChevronDown, ChevronRight, FolderOpen } from "lucide-react"

interface FileLessonsViewProps {
  lessons: Lesson[]
  files: FileItem[]
  selectedFilename: string | null
}

export default function FileLessonsView({
  lessons,
  files,
  selectedFilename,
}: FileLessonsViewProps) {
  const [openFiles, setOpenFiles] = useState<Set<string>>(new Set())

  const lessonsByFile = new Map<string, Lesson[]>()
  const lessonsWithoutFiles: Lesson[] = []

  lessons.forEach((lesson) => {
    if (!lesson.files || lesson.files.length === 0) {
      lessonsWithoutFiles.push(lesson)
      return
    }
    lesson.files.forEach((file) => {
      const existing = lessonsByFile.get(file.filename) ?? []
      existing.push(lesson)
      lessonsByFile.set(file.filename, existing)
    })
  })

  const filteredFiles = selectedFilename
    ? files.filter((f) => f.filename === selectedFilename)
    : files

  const toggleFile = (filename: string) => {
    setOpenFiles((prev) => {
      const next = new Set(prev)
      if (next.has(filename)) {
        next.delete(filename)
      } else {
        next.add(filename)
      }
      return next
    })
  }

  if (filteredFiles.length === 0 && lessonsWithoutFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No files found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload files to your lessons to organize them here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Files with lessons */}
      {filteredFiles.map((file) => {
        const fileLessons = lessonsByFile.get(file.filename) ?? []
        const isOpen = openFiles.has(file.filename) || selectedFilename !== null

        return (
          <Collapsible key={file.filename} open={isOpen} onOpenChange={() => toggleFile(file.filename)}>
            <div className="rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{file.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {fileLessons.length} {fileLessons.length === 1 ? "lesson" : "lessons"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {fileLessons.length}
                  </Badge>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-border p-4">
                  {fileLessons.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {fileLessons.map((lesson) => (
                        <LessonCard
                          key={lesson.lessonId}
                          lesson={lesson}
                          variant="preview"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No lessons use this file.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )
      })}

      {/* Lessons without files */}
      {lessonsWithoutFiles.length > 0 && !selectedFilename && (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6">
          <div className="mb-4 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground">
              Lessons without files ({lessonsWithoutFiles.length})
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessonsWithoutFiles.map((lesson) => (
              <LessonCard
                key={lesson.lessonId}
                lesson={lesson}
                variant="preview"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
