import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"
import BackgroundPanel from "@/components/homemade/BackgroundPanel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { objectService } from "@/services/object_service"
import type { FileObject } from "@/utils/types/object"
import {
  formatFileSize,
  formatDate,
  getFileIcon,
} from "@/utils/utils/object"

type PreviewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ok"
      mimeType: string
      objectUrl: string | null
      textContent: string | null
      meta: FileObject | null
    }

const TEXT_MIME_PREFIXES = ["text/", "application/json"]

export default function FileViewPage() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<PreviewState>({ status: "loading" })
  const [downloading, setDownloading] = useState(false)

  const fileName = name ?? ""

  useEffect(() => {
    if (!fileName) return
    let objectUrl: string | null = null
    let cancelled = false

    const load = async () => {
      try {
        const [file, metadata] = await Promise.allSettled([
          objectService.getFile(fileName),
          objectService.search(fileName, 1, 50).then((res) =>
            res.objects.data.find((f) => f.name === fileName) ?? null,
          ),
        ])

        if (cancelled) return
        if (file.status === "rejected") {
          setPreview({ status: "error", message: "Impossible to load the file." })
          return
        }

        const { blob, mimeType } = file.value
        if (TEXT_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix))) {
          const text = await blob.text()
          if (cancelled) return
          setPreview({
            status: "ok",
            mimeType,
            objectUrl: null,
            textContent: text,
            meta: metadata.status === "fulfilled" ? metadata.value : null,
          })
          return
        }

        objectUrl = URL.createObjectURL(blob)
        setPreview({
          status: "ok",
          mimeType,
          objectUrl,
          textContent: null,
          meta: metadata.status === "fulfilled" ? metadata.value : null,
        })
      } catch (error) {
        if (!cancelled) {
          console.error("File preview error:", error)
          setPreview({ status: "error", message: "Impossible to load the file." })
        }
      }
    }

    void load()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [fileName])

  const meta =
    preview.status === "ok" ? preview.meta : null
  const mimeType = preview.status === "ok" ? preview.mimeType : ""

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await objectService.download(fileName)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
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

  return (
    <BackgroundPanel
      title={
        <span className="flex min-w-0 items-center gap-3">
          {getFileIcon(mimeType, fileName)}
          <span className="truncate">{fileName}</span>
        </span>
      }
      subtitle={
        meta
          ? [formatFileSize(meta.sizeBytes), formatDate(meta.createdAt)]
              .filter(Boolean)
              .join(" - ")
          : undefined
      }
      controls={
        <div className="flex items-center gap-2">
          {meta?.visibility && (
            <Badge variant="outline">{meta.visibility}</Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Go back to search"
          >
            <ArrowLeft className="size-4" />
          </Button>
        </div>
      }
    >
      {preview.status === "loading" && (
        <p className="text-sm text-muted-foreground">Loading file...</p>
      )}

      {preview.status === "error" && (
        <p className="text-sm text-destructive">{preview.message}</p>
      )}

      {preview.status === "ok" && (
        <Card className="flex w-full flex-col items-center gap-4 p-4">
          {mimeType.startsWith("image/") && preview.objectUrl && (
            <img
              src={preview.objectUrl}
              alt={fileName}
              className="max-h-[70vh] max-w-full rounded object-contain"
            />
          )}

          {mimeType === "application/pdf" && preview.objectUrl && (
            <iframe
              src={preview.objectUrl}
              title={fileName}
              className="h-[70vh] w-full rounded border"
            />
          )}

          {preview.textContent !== null && (
            <pre className="max-h-[70vh] w-full overflow-auto whitespace-pre-wrap rounded bg-muted/50 p-4 text-sm">
              {preview.textContent}
            </pre>
          )}

          {mimeType.startsWith("image/") === false &&
            mimeType !== "application/pdf" &&
            preview.textContent === null && (
              <div className="flex flex-col items-center gap-3 py-10">
                <p className="text-sm text-muted-foreground">
                  No preview available for this file type.
                </p>
              </div>
            )}

          <Button onClick={handleDownload} disabled={downloading}>
            <Download className="size-4" />
            Download
          </Button>
        </Card>
      )}
    </BackgroundPanel>
  )
}
