import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils/lib/shadcn"
import { objectService } from "@/services/object_service"
import { PATHS } from "@/utils/router/paths"
import type { FileObject } from "@/utils/types/object"
import {
  formatFileSize,
  formatDate,
  getFileIcon,
} from "@/utils/utils/object"

type Variant = "preview" | "default"

interface FileCardProps {
  file: FileObject
  variant?: Variant
  className?: string
}

export default function FileCard({
  file,
  variant = "default",
  className,
}: FileCardProps) {
  const navigate = useNavigate()
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

  const meta =
    variant === "preview"
      ? [
          formatFileSize(file.sizeBytes),
          formatDate(file.createdAt),
          file.visibility,
        ].filter(Boolean)
      : [
          formatFileSize(file.sizeBytes),
          formatDate(file.createdAt),
          file.visibility,
        ]

  return (
    <Card
      className={cn(
        "group/file relative w-full min-w-0 border border-border bg-card shadow-sm",
        variant === "default"
          ? "flex flex-col gap-3 p-4"
          : "flex flex-row flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
        "transition-[box-shadow,border-color] duration-200",
        "hover:border-primary/50 hover:shadow-md",
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center">
        {getFileIcon(file.mimeType, file.name)}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-medium" title={file.name}>
          {file.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {meta.map((value, index) => (
            value ? <span key={index}>{value}</span> : null
          ))}
        </div>
      </div>

      {variant === "default" && file.visibility && (
        <Badge variant="outline" className="shrink-0">
          {file.visibility}
        </Badge>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => navigate(PATHS.fileView(encodeURIComponent(file.name)))}
        aria-label={`View ${file.name}`}
      >
        <Eye className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={handleDownload}
        disabled={downloading}
        aria-label={`Download ${file.name}`}
      >
        <Download className="size-4" />
      </Button>
    </Card>
  )
}
