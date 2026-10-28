import type { ReactNode } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, ChevronDown } from "lucide-react"
import { cn } from "@/utils/lib/shadcn"
import type { Lesson } from "@/utils/types/lesson"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { changePageLessonView } from "@/utils/router/changePage"

type Variant = "preview" | "default" | "small"

interface LessonCardProps {
  lesson: Lesson
  variant?: Variant
  expandThreshold?: number
  actions?: ReactNode
  className?: string
}

/**
 * Shared look for every variant.
 *
 *  - Contrast: solid card surface + visible border + shadow, so the card
 *    stands out from the (tinted) panel behind it.
 *  - Reading overlay: a soft tint (::after) and a primary-coloured border/ring
 *    appear on hover and keyboard focus, so the card being read is obvious.
 *    The overlay ignores pointer events, so links and buttons still work.
 */
const cardSurface = [
  "group/card border border-border bg-card shadow-sm",
  "transition-[box-shadow,border-color,opacity] duration-200",
  "hover:border-primary/50 hover:shadow-md",
  "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
  "after:bg-primary/5 after:opacity-0 after:transition-opacity after:duration-200",
  "hover:after:opacity-100 focus-within:after:opacity-100",
].join(" ")

/**
 * One entry per slot, one class string per variant.
 *
 *  ① Title  – no dashed border / rounded box / hover shadow
 *  ② Hierarchy – clear title → description → expand → tags → footer
 *  ③ Expand  – own line with consistent spacing
 *  ④ Small   – tighter header padding & title size
 *  ⑤ Tags    – shared wrapping row, consistent gap
 *  ⑥ Footer  – subtle divider, quieter type
 *  ⑦ Preview – icon+title+desc | tags | metadata | actions (wraps in narrow lists)
 *  ⑧ Meta    – author as a bold inline link, never a boxed action
 *  ⑨ Safety  – min-w-0, truncation, empty-state guards
 *  ⑩ Actions – reserved right-hand column, stacked vertically (no overlap)
 */
const lessonStyle = {
  /*
   * Widths: cards are `w-full` so they always fit the grid cell they are
   * placed in (fixed widths like w-80 overflowed narrow cells and overlapped
   * their neighbours). `min-w-0` lets them shrink inside flex/grid parents.
   * The preview card spans the entire line.
   */
  base: {
    default: "relative w-full min-w-0 h-80 flex-col gap-2 overflow-hidden py-3",
    preview:
      "relative w-full min-w-0 min-h-20 flex-row flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
    small: "relative w-full max-w-64 min-w-0 h-64 flex-col gap-1.5 overflow-hidden py-2.5",
  },

  /* ⑩ right-hand column; alignment of the stacked buttons inside it */
  Actions: {
    default: "items-end",
    preview: "items-end",
    small: "items-end",
  },

  /* ④ small header is tighter; ⑩ header is a row so actions reserve width */
  Header: {
    default: "flex shrink-0 flex-row items-start gap-2 px-4 pb-0",
    preview: "",
    small: "flex shrink-0 flex-row items-start gap-2 px-3 pb-0",
  },

  /* ① plain text – the Link itself is the interactive element */
  Title: {
    default: "line-clamp-2 text-xl font-bold leading-snug",
    preview: "truncate text-base font-bold leading-snug",
    small: "line-clamp-2 text-base font-bold leading-snug",
  },

  /* ②③ scrollable description area with its own gap for the trigger */
  DescriptionScroll: {
    default: "min-h-0 flex-1 flex flex-col gap-1.5 overflow-y-auto px-4",
    preview: "",
    small: "",
  },

  Description: {
    default: "line-clamp-4 text-pretty text-sm leading-relaxed text-muted-foreground",
    preview: "line-clamp-1 text-pretty text-sm text-muted-foreground",
    small: "line-clamp-3 text-pretty text-xs leading-relaxed text-muted-foreground",
  },

  Content: {
    default: "shrink-0 px-4",
    preview: "",
    small: "shrink-0 px-3",
  },

  /* ⑤ shared tag row – wraps, consistent gap, shrinkable for narrow lists */
  Tags: {
    default: "flex flex-wrap gap-1.5",
    preview: "flex min-w-0 flex-wrap items-center gap-1.5",
    small: "flex flex-wrap gap-1.5",
  },

  /* ⑥ subtle divider + quieter type */
  Footer: {
    default:
      "mt-auto shrink-0 flex-col items-start gap-1 border-t border-border/60 px-4 py-2",
    preview: "",
    small: "mt-auto shrink-0 border-t border-border/60 px-3 py-1.5",
  },

  /* ⑧ author label is muted, the username is the visible part */
  Author: {
    default: "flex items-center gap-1 text-xs text-muted-foreground",
    preview: "flex min-w-0 items-center gap-1 text-xs text-muted-foreground",
    small: "",
  },
  AuthorLink: {
    default:
      "truncate font-semibold text-foreground underline-offset-2 hover:underline",
    preview:
      "max-w-[12ch] truncate font-semibold text-foreground underline-offset-2 hover:underline",
    small: "",
  },

  Dates: {
    default: "flex flex-wrap gap-x-3 text-xs text-muted-foreground/70",
    preview: "shrink-0 text-right text-xs text-muted-foreground/70",
    small: "text-xs text-muted-foreground/70",
  },
}

/* How many tags each variant shows (undefined = all) */
const TAG_LIMIT: Record<Variant, number | undefined> = {
  default: undefined,
  small: 2,
  preview: 2,
}

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value)
  )

export default function LessonCard({
  lesson,
  variant = "default",
  expandThreshold = 120,
  actions,
  className,
}: LessonCardProps) {
  const [open, setOpen] = useState(false)
  const { author, title, slug, tags, createdAt, updatedAt } = lesson
  const description = lesson.description?.trim()
  const isPreview = variant === "preview"
  const isDefault = variant === "default"
  const canExpand =
    isDefault && !!description && description.length > expandThreshold
  const limit = TAG_LIMIT[variant]
  const visibleTags = limit === undefined ? tags : tags.slice(0, limit)
  const hiddenTagCount = tags.length - visibleTags.length
  const createdLabel = createdAt ? formatDate(createdAt) : null
  const updatedLabel = updatedAt ? formatDate(updatedAt) : null

  // ---------- Shared pieces ----------

  /* ⑩ the actions live in their own vertical column on the right */
  const actionsColumn = actions && (
    <div
      className={cn(
        "relative z-10 flex shrink-0 flex-col gap-1",
        lessonStyle.Actions[variant]
      )}
    >
      {actions}
    </div>
  )

  /* ① the Link is the interactive element. Its ::after stretches over the
     whole card (nearest positioned ancestor = the Card), making the entire
     card clickable. Other interactive elements use `relative z-10` to stay
     above it. The title underlines whenever the card is hovered. */
  const titleNode = (
    <CardTitle className={lessonStyle.Title[variant]}>
      <Button
        variant='link'
        className="underline-offset-4 group-hover/card:underline after:absolute after:inset-0 after:content-['']"
        onClick={(e) => { e.preventDefault(); changePageLessonView(author.username, slug) }}
      >
        {title}
      </Button>
    </CardTitle>
  )

  /* ⑨ explicit empty-state for missing description */
  const descriptionNode = description ? (
    <CardDescription
      className={cn(
        lessonStyle.Description[variant],
        isDefault && open && "line-clamp-none"
      )}
    >
      {description}
    </CardDescription>
  ) : (
    <CardDescription
      className={cn(lessonStyle.Description[variant], "italic opacity-50")}
    >
      No description
    </CardDescription>
  )

  /* ⑤ consistent badge sizing across every variant */
  const tagsNode =
    tags.length > 0 && (
      <div className={lessonStyle.Tags[variant]}>
        {visibleTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="text-[0.7rem]">
            {tag.name}
          </Badge>
        ))}
        {hiddenTagCount > 0 && (
          <Badge variant="outline" className="text-[0.7rem]">
            +{hiddenTagCount}
          </Badge>
        )}
      </div>
    )

  /* ⑧ author = muted "By:" + bold inline link (never a boxed Button) */
  const authorNode = author && (
    <div className={lessonStyle.Author[variant]}>
      <span>By:</span>
      <Link
        to={`/users/${author.username}/`}
        className={cn("relative z-10", lessonStyle.AuthorLink[variant])}
      >
        {author.username}
      </Link>
    </div>
  )

  const datesNode = (() => {
    if (isDefault) {
      if (!createdLabel && !updatedLabel) return null
      return (
        <p className={lessonStyle.Dates[variant]}>
          {createdLabel && <span>Created {createdLabel}</span>}
          {updatedLabel && <span>Updated {updatedLabel}</span>}
        </p>
      )
    }
    const last = updatedLabel ?? createdLabel
    if (!last) return null
    return (
      <p className={lessonStyle.Dates[variant]}>
        {updatedLabel ? "Updated" : "Created"} {last}
      </p>
    )
  })()

  /* ③ trigger sits on its own line thanks to the flex-col parent */
  const expandTrigger = canExpand && (
    <CollapsibleTrigger asChild>
      <Button
        variant="link"
        size="sm"
        className="relative z-10 h-auto w-fit gap-1 p-0 text-xs text-muted-foreground/70 hover:text-foreground"
      >
        {open ? "Show less" : "Show more"}
        <ChevronDown
          className={cn("size-3 transition-transform", open && "rotate-180")}
        />
      </Button>
    </CollapsibleTrigger>
  )

  // ---------- Variant layouts ----------

  const headerVariant = () => {
    if (isPreview) {
      /* ⑦ one flat, wrappable row spanning the whole line:
         icon | title+summary | tags | metadata | actions(right) */
      return (
        <>
          <BookOpen className="size-7 shrink-0 text-muted-foreground" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {titleNode}
            {descriptionNode}
          </div>
          {tagsNode}
          <div className="flex min-w-0 shrink-0 flex-col items-end gap-0.5 pl-2">
            {authorNode}
            {datesNode}
          </div>
          {actionsColumn}
        </>
      )
    }

    if (isDefault) {
      /* ②⑩ title fixed on the left, actions reserve the right gutter,
         description scrolls between title and tags/footer */
      return (
        <>
          <CardHeader className={lessonStyle.Header[variant]}>
            <div className="min-w-0 flex-1">{titleNode}</div>
            {actionsColumn}
          </CardHeader>
          <Collapsible
            open={open}
            onOpenChange={setOpen}
            // When expanded the description can scroll, so lift it above the
            // stretched link to let the mouse wheel reach it
            className={cn(
              lessonStyle.DescriptionScroll[variant],
              open && "relative z-10"
            )}
          >
            {descriptionNode}
            {expandTrigger}
          </Collapsible>
        </>
      )
    }

    /* small – ④ tighter header, ⑩ actions column on the right */
    return (
      <CardHeader className={lessonStyle.Header[variant]}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {titleNode}
          {descriptionNode}
        </div>
        {actionsColumn}
      </CardHeader>
    )
  }

  const contentVariant = () => {
    // Preview renders its tags inline in the row
    if (isPreview || tags.length === 0) return null
    return (
      <CardContent className={lessonStyle.Content[variant]}>
        {tagsNode}
      </CardContent>
    )
  }

  const footerVariant = () => {
    // Preview keeps everything in the single row above
    if (isPreview) return null
    if (!isDefault) {
      return (
        <CardFooter className={lessonStyle.Footer[variant]}>
          {datesNode}
        </CardFooter>
      )
    }
    /* ⑥ quiet footer */
    return (
      <CardFooter className={lessonStyle.Footer[variant]}>
        {authorNode}
        {datesNode}
      </CardFooter>
    )
  }

  return (
    <Card className={cn(lessonStyle.base[variant], cardSurface, className)}>
      {headerVariant()}
      {contentVariant()}
      {footerVariant()}
    </Card>
  )
}
