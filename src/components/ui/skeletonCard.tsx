import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/utils/lib/shadcn"
import { useState } from "react"

type Variant = "preview" | "default" | "small"

interface SkeletonCardProps {
  variant?: Variant
  className?: string
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/* Tag placeholder widths, cycled so the badges don't all look identical */
const TAG_WIDTHS = ["w-14", "w-10", "w-16", "w-12", "w-14"]

/*
 * Mirrors the base classes of LessonCard (same size, padding, border and
 * surface per variant) so the layout doesn't jump when the real cards load.
 */
const skeletonBase: Record<Variant, string> = {
  default:
    "relative w-full min-w-0 h-80 flex-col gap-2 overflow-hidden py-3",
  preview:
    "relative w-full min-w-0 min-h-20 flex-row flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
  small:
    "relative w-full max-w-64 min-w-0 h-64 flex-col gap-1.5 overflow-hidden py-2.5",
}

const surface = "border border-border bg-card shadow-sm"

function TagSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-5 rounded-full", TAG_WIDTHS[index % TAG_WIDTHS.length])}
        />
      ))}
    </>
  )
}

export default function SkeletonCard({
  variant = "default",
  className,
}: SkeletonCardProps) {
  const [tagCount] = useState(() => getRandomInt(1, 4))

  /* ---------- preview: icon | title+summary | tags | metadata ---------- */
  if (variant === "preview") {
    return (
      <Card className={cn(skeletonBase.preview, surface, className)}>
        {/* icon */}
        <Skeleton className="size-7 shrink-0 rounded-md" />

        {/* title + one-line summary */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        {/* tags (the preview shows at most 2) */}
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <TagSkeletons count={Math.min(tagCount, 2)} />
        </div>

        {/* author + date */}
        <div className="flex min-w-0 shrink-0 flex-col items-end gap-1.5 pl-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      </Card>
    )
  }

  /* ---------- small: title + short description, tags, date footer ---------- */
  if (variant === "small") {
    return (
      <Card className={cn(skeletonBase.small, surface, className)}>
        <CardHeader className="flex shrink-0 flex-row items-start gap-2 px-3 pb-0">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </CardHeader>

        <CardContent className="shrink-0 px-3">
          <div className="flex flex-wrap gap-1.5">
            <TagSkeletons count={Math.min(tagCount, 2)} />
          </div>
        </CardContent>

        <CardFooter className="mt-auto shrink-0 border-t border-border/60 px-3 py-1.5">
          <Skeleton className="h-3 w-28" />
        </CardFooter>
      </Card>
    )
  }

  /* ---------- default: title, description, "show more", tags, footer ---------- */
  return (
    <Card className={cn(skeletonBase.default, surface, className)}>
      {/* title (two lines like the clamped title) */}
      <CardHeader className="flex shrink-0 flex-row items-start gap-2 px-4 pb-0">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/5" />
        </div>
      </CardHeader>

      {/* description area + expand trigger */}
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden px-4">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="mt-1 h-3 w-16" />
      </div>

      {/* tags */}
      <CardContent className="shrink-0 px-4">
        <div className="flex flex-wrap gap-1.5">
          <TagSkeletons count={tagCount} />
        </div>
      </CardContent>

      {/* footer: author + dates */}
      <CardFooter className="mt-auto shrink-0 flex-col items-start gap-1.5 border-t border-border/60 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">By:</span>
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-28" />
        </div>
      </CardFooter>
    </Card>
  )
}