import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/utils/lib/shadcn"
import type { ExamSummary } from "@/utils/types/exam"

type ExamCardVariant = "default" | "preview"

interface ExamCardProps {
  exam: ExamSummary
  variant?: ExamCardVariant
  className?: string
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
  const createdDate = formatDate(exam.createdAt)
  const updatedDate = formatDate(exam.updatedAt)

  return (
    <Card
      className={cn(
        "w-full min-w-0 border-border bg-card shadow-sm transition-shadow hover:shadow-md",
        isPreview ? "flex-row flex-wrap items-center gap-x-4 gap-y-2" : "h-full gap-3",
        className,
      )}
    >
      <CardHeader className={cn("min-w-0 px-5 pt-5 pb-0", isPreview && "flex-1 p-0")}>
        <CardTitle className={cn(isPreview ? "truncate text-base" : "line-clamp-2 text-xl")}>
          {exam.title?.trim() || "Untitled exam"}
        </CardTitle>
        <CardDescription className={cn(isPreview ? "line-clamp-1" : "line-clamp-4")}>
          {exam.description?.trim() || "No description"}
        </CardDescription>
      </CardHeader>

      {(createdDate || updatedDate) && (
        <CardFooter
          className={cn(
            "flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground",
            isPreview ? "p-0" : "mt-auto border-t border-border/60 px-5 pt-3 pb-5",
          )}
        >
          {createdDate && <span>Created {createdDate}</span>}
          {updatedDate && <span>Updated {updatedDate}</span>}
        </CardFooter>
      )}
    </Card>
  )
}
