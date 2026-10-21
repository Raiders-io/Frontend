import type { file as FileItem } from "@/utils/types/lesson"
import type { Lesson } from "@/utils/types/lesson"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Lock,
  Globe,
  FileText,
  Download,
  Calendar,
  User,
  Paperclip,
  ArrowLeft,
} from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/lib/shadcn"

interface LessonDisplayProps {
  lesson: Lesson
  files?: FileItem[]
  onFileDownload?: (file: FileItem) => void
  onBack?: () => void
}

// Shared surface — same language as LessonCard so the page feels cohesive.
const sectionCard =
  "rounded-xl border border-border bg-card shadow-sm transition-colors"

const formatDate = (value: string | Date | undefined) => {
  if (!value) return null
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(value)
    )
  } catch {
    return null
  }
}

export default function LessonDisplay({
  lesson,
  files,
  onFileDownload,
  onBack,
}: LessonDisplayProps) {
  const createdLabel = formatDate(lesson.createdAt)
  const updatedLabel = formatDate(lesson.updatedAt)
  const mergedFiles = files ?? lesson.files ?? []

  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-10">
      {/* ---------- Header ---------- */}
      <header className="space-y-4">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to lesson
          </Button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={lesson.isPrivate ? "secondary" : "default"}
            className="gap-1.5"
          >
            {lesson.isPrivate ? (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            ) : (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            )}
          </Badge>
          {lesson.tags.slice(0, 4).map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-[0.7rem]">
              {tag.name}
            </Badge>
          ))}
          {lesson.tags.length > 4 && (
            <Badge variant="outline" className="text-[0.7rem]">
              +{lesson.tags.length - 4}
            </Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {lesson.author?.username && (
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <Link
                to={`/users/${lesson.author.username}/`}
                className="font-semibold text-foreground underline-offset-2 hover:underline"
              >
                {lesson.author.username}
              </Link>
            </div>
          )}
          {createdLabel && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Created {createdLabel}</span>
            </div>
          )}
          {updatedLabel && updatedLabel !== createdLabel && (
            <div className="flex items-center gap-1.5">
              <span>Updated {updatedLabel}</span>
            </div>
          )}
        </div>
      </header>

      {/* ---------- Description ---------- */}
      <section className={cn("mt-8 p-6", sectionCard)}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Description
        </h2>
        {lesson.description?.trim() ? (
          <ScrollArea className="mt-3 max-h-96">
            <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
              {lesson.description}
            </p>
          </ScrollArea>
        ) : (
          <p className="mt-3 text-sm italic text-muted-foreground">
            No description provided.
          </p>
        )}
      </section>

      {/* ---------- Tags ---------- */}
      {lesson.tags.length > 0 && (
        <section className={cn("mt-6 p-6", sectionCard)}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Tags
            </h2>
            <span className="text-xs text-muted-foreground/70">
              {lesson.tags.length} {lesson.tags.length === 1 ? "tag" : "tags"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {lesson.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="cursor-pointer text-[0.75rem] transition-colors hover:bg-secondary/70"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Files (inline) ---------- */}
      <section className={cn("mt-6 p-6", sectionCard)}>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Attachments
            </h2>
          </div>
          <span className="text-xs text-muted-foreground/70">
            {mergedFiles.length} {mergedFiles.length === 1 ? "file" : "files"}
          </span>
        </div>

        {mergedFiles.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {mergedFiles.map((file, index) => (
              <li key={index}>
                <FileCard file={file} onDownload={onFileDownload} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm italic text-muted-foreground">
            No files attached to this lesson.
          </p>
        )}
      </section>
    </article>
  )
}

/* ---------- File card ---------- */
function FileCard({
  file,
  onDownload,
}: {
  file: FileItem
  onDownload?: (file: FileItem) => void
}) {
  const ext = file.filename.split(".").pop()?.toUpperCase() ?? "FILE"
  return (
    <div className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
          {ext.slice(0, 4)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{file.filename}</p>
          <p className="text-xs text-muted-foreground">
            Click to download
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDownload?.(file)}
        className="gap-1.5 text-muted-foreground group-hover:text-foreground"
      >
        <FileText className="h-4 w-4" />
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}