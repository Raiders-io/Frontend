import { useState } from "react"
import { Link } from "react-router-dom"
import { Download } from "lucide-react"
import { cn } from "@/utils/lib/shadcn"
import type { CardVariant } from "@/utils/types/common"
import type { FileObject } from "@/utils/types/object"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { objectService } from "@/services/object_service"
import { PATHS } from "@/utils/router/paths"
import { formatFileSize, formatDate, getFileIcon } from "@/utils/utils/object"

interface FileCardProps {
  file: FileObject
  variant?: CardVariant
  className?: string
}

/**
 * Shared look for every variant, mirroring LessonCard.
 *
 *  - Contrast: solid card surface + visible border + shadow.
 *  - Reading overlay: a soft tint (::after) and a primary-coloured border/ring
 *    appear on hover and keyboard focus. The overlay ignores pointer events,
 *    so the download button still works.
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
 *  ① Default – featured centred icon fills the card, title/meta stacked below
 *  ② Preview – one flat, wrappable row: icon | title+meta | badge | download
 *  ③ Small   – compact header row + content + footer
 *  ④ Title   – plain text; the Button is the interactive element
 *  ⑤ Meta    – size and date, quiet type
 *  ⑥ Safety  – min-w-0, truncation, empty-state guards
 */
const fileStyle = {
  base: {
    default:
      "relative w-full min-w-0 h-48 flex-col items-center justify-center gap-3 px-4 py-4",
    preview:
      "relative w-full min-w-0 min-h-16 flex-row flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
    small: "relative w-full max-w-64 min-w-0 h-32 flex-col gap-1.5 overflow-hidden py-2.5",
  },

  Header: {
    default: "",
    preview: "",
    small: "flex shrink-0 flex-row items-start gap-2 px-3 pb-0",
  },

  /* ④ plain text – the Button itself is the interactive element */
  Title: {
    default: "max-w-full truncate text-center text-base font-bold leading-snug",
    preview: "truncate text-base font-bold leading-snug",
    small: "truncate text-sm font-bold leading-snug",
  },

  /* ⑤ size and date, quiet type */
  Meta: {
    default: "flex flex-wrap justify-center gap-x-3 text-xs text-muted-foreground/70",
    preview: "flex flex-wrap gap-x-3 text-xs text-muted-foreground/70",
    small: "text-xs text-muted-foreground/70",
  },

  Content: {
    default: "",
    preview: "",
    small: "shrink-0 px-3",
  },

  Footer: {
    default: "",
    preview: "",
    small: "mt-auto shrink-0 border-t border-border/60 px-3 py-1.5",
  },
}

export default function FileCard({
  file,
  variant = "default",
  className,
}: FileCardProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await objectService.download(file.name)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", file.name)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
    } finally {
      setDownloading(false)
    }
  }

  const sizeLabel = formatFileSize(file.sizeBytes)
  const createdLabel = file.createdAt ? formatDate(file.createdAt) : null

  // ---------- Shared pieces ----------

  /* Download sits above the overlay link thanks to `relative z-20` */
  const downloadButton = (
    <Button
      variant="ghost"
      size="icon"
      className="relative z-20 shrink-0"
      onClick={handleDownload}
      disabled={downloading}
      aria-label={`Download ${file.name}`}
    >
      <Download className="size-4" />
    </Button>
  )

  /* ④ the whole-card overlay Link is the interactive element. Its title
     underlines whenever the card is hovered. */
  const viewLink = (
    <Link
      to={PATHS.fileView(encodeURIComponent(file.name))}
      className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline-none"
      aria-label={`View ${file.name}`}
    />
  )

  /* ④ plain text – the overlay link handles navigation */
  const titleNode = (
    <CardTitle className={fileStyle.Title[variant]}>
      <span
        className="text-primary underline-offset-4 group-hover/card:underline"
        title={file.name}
      >
        {file.name}
      </span>
    </CardTitle>
  )

  /* ⑤ size and date */
  const metaNode = (
    <div className={fileStyle.Meta[variant]}>
      <span>{sizeLabel}</span>
      {createdLabel && <span>{createdLabel}</span>}
    </div>
  )

  /* ⑥ visibility is a label chip, not a boxed action */
  const visibilityNode = file.visibility && (
    <Badge variant="secondary" className="shrink-0 text-[0.7rem]">
      {file.visibility}
    </Badge>
  )

  // ---------- CardVariant layouts ----------

  /* ② one flat, wrappable row spanning the whole line:
     icon | title+meta | badge | download(right) */
  if (variant === "preview") {
    return (
      <Card className={cn(fileStyle.base.preview, cardSurface, className)}>
        {viewLink}
        <span className="flex size-8 shrink-0 items-center justify-center">
          {getFileIcon(file.mimeType, file.name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {titleNode}
          {metaNode}
        </div>
        {visibilityNode}
        {downloadButton}
      </Card>
    )
  }

  /* ① featured centred icon fills the card; download tucks into the corner */
  if (variant === "default") {
    return (
      <Card className={cn(fileStyle.base.default, cardSurface, className)}>
        {viewLink}
        <div className="absolute right-2 top-2 z-20">{downloadButton}</div>
        <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
          {getFileIcon(file.mimeType, file.name, "size-9")}
        </span>
        {titleNode}
        {metaNode}
        {visibilityNode}
      </Card>
    )
  }

  /* ③ compact card: tighter header + content + footer */
  return (
    <Card className={cn(fileStyle.base.small, cardSurface, className)}>
      {viewLink}
      <CardHeader className={fileStyle.Header.small}>
        <span className="flex size-8 shrink-0 items-center justify-center">
          {getFileIcon(file.mimeType, file.name)}
        </span>
        <div className="min-w-0 flex-1">{titleNode}</div>
        {downloadButton}
      </CardHeader>
      <CardContent className={fileStyle.Content.small}>{visibilityNode}</CardContent>
      <CardFooter className={fileStyle.Footer.small}>{metaNode}</CardFooter>
    </Card>
  )
}
