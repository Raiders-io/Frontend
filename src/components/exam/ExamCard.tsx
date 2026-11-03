import { BookOpen } from "lucide-react"
import { cn } from "@/utils/lib/shadcn"
import type { ExamSummary } from "@/utils/types/exam"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Variant = "preview" | "default"

interface ExamCardProps {
  exam: ExamSummary
  variant?: Variant
  className?: string
}

const cardSurface = [
  "group/card border border-border bg-card shadow-sm",
  "transition-[box-shadow,border-color,opacity] duration-200",
  "hover:border-primary/50 hover:shadow-md",
  "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
  "after:bg-primary/5 after:opacity-0 after:transition-opacity after:duration-200",
  "hover:after:opacity-100 focus-within:after:opacity-100",
].join(" ")

const examStyle = {
  base: {
    default: "relative h-80 w-full min-w-0 flex-col gap-2 overflow-hidden py-3",
    preview:
      "relative min-h-20 w-full min-w-0 flex-row flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
  },
  header: {
    default: "flex shrink-0 flex-row items-start gap-2 px-4 pb-0",
  },
  title: {
    default: "line-clamp-2 text-xl font-bold leading-snug",
    preview: "truncate text-base font-bold leading-snug",
  },
  description: {
    default: "line-clamp-4 text-pretty text-sm leading-relaxed text-muted-foreground",
    preview: "line-clamp-1 text-pretty text-sm text-muted-foreground",
  },
  dates: {
    default: "flex flex-wrap gap-x-3 text-xs text-muted-foreground/70",
    preview: "shrink-0 text-right text-xs text-muted-foreground/70",
  },
}

function formatDate(value: string | null): string | null {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)
}

export default function ExamCard({
  exam,
  variant = "default",
  className,
}: ExamCardProps) {
  const isPreview = variant === "preview"
  const title = exam.title?.trim() || "Untitled exam"
  const description = exam.description?.trim()
  const createdDate = formatDate(exam.createdAt)
  const updatedDate = formatDate(exam.updatedAt)
  const visibleTags = isPreview ? exam.tags.slice(0, 2) : exam.tags
  const hiddenTagCount = exam.tags.length - visibleTags.length

  const authorNode = exam.authorNickname && (
    <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
      <span>By:</span>
      <span className="truncate font-semibold text-foreground">{exam.authorNickname}</span>
    </p>
  )

  const tagsNode = exam.tags.length > 0 && (
    <div className={cn("flex min-w-0 flex-wrap gap-1.5", isPreview && "items-center")}>
      {visibleTags.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="text-[0.7rem]">
          {tag}
        </Badge>
      ))}
      {hiddenTagCount > 0 && (
        <Badge variant="outline" className="text-[0.7rem]">
          +{hiddenTagCount}
        </Badge>
      )}
    </div>
  )

  const dates = (() => {
    if (!isPreview) {
      if (!createdDate && !updatedDate) return null
      return (
        <p className={examStyle.dates.default}>
          {createdDate && <span>Created {createdDate}</span>}
          {updatedDate && <span>Updated {updatedDate}</span>}
        </p>
      )
    }

    const latestDate = updatedDate ?? createdDate
    if (!latestDate) return null

    return (
      <p className={examStyle.dates.preview}>
        {updatedDate ? "Updated" : "Created"} {latestDate}
      </p>
    )
  })()

  const descriptionNode = (
    <CardDescription
      className={cn(examStyle.description[variant], !description && "italic opacity-50")}
    >
      {description || "No description"}
    </CardDescription>
  )

  return (
    <Card className={cn(examStyle.base[variant], cardSurface, className)}>
      {isPreview ? (
        <>
          <BookOpen aria-hidden="true" className="size-7 shrink-0 text-muted-foreground" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <CardTitle className={examStyle.title.preview}>{title}</CardTitle>
            {descriptionNode}
          </div>
          {tagsNode}
          <div className="flex min-w-0 shrink-0 flex-col items-end gap-0.5 pl-2">
            {authorNode}
            {dates}
          </div>
        </>
      ) : (
        <>
          <CardHeader className={examStyle.header.default}>
            <div className="min-w-0 flex-1">
              <CardTitle className={examStyle.title.default}>{title}</CardTitle>
            </div>
          </CardHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4">{descriptionNode}</div>
          {tagsNode && <CardContent className="shrink-0 px-4">{tagsNode}</CardContent>}
          {(authorNode || dates) && (
            <CardFooter className="mt-auto shrink-0 flex-col items-start gap-1 border-t border-border/60 px-4 py-2">
              {authorNode}
              {dates}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  )
}
