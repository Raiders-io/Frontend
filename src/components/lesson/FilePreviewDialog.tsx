import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { Download, FileQuestion, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { MarkdownContent } from "@/components/MarkdownContent"
import { objectService } from "@/services/object_service"
import type { file as FileItem } from "@/utils/types/lesson"

type PreviewKind =
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "markdown"
  | "text"
  | "unsupported"

type ViewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "private" }
  | { status: "ready"; kind: PreviewKind; url?: string; text?: string }

// Decides how a file is shown. HTML is deliberately not rendered: it would run
// the owner's scripts in our origin.
function previewKindOf(mimeType: string, filename: string): PreviewKind {
  const mime = mimeType.split(";")[0].trim().toLowerCase()
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""

  if (mime.startsWith("image/")) return "image"
  if (mime === "application/pdf") return "pdf"
  if (mime.startsWith("video/")) return "video"
  if (mime.startsWith("audio/")) return "audio"
  if (mime === "text/html" || mime === "application/xhtml+xml" || ext === "html" || ext === "htm")
    return "unsupported"
  if (mime.includes("markdown") || ext === "md") return "markdown"
  if (mime.startsWith("text/") || mime.includes("json") || mime.includes("xml")) return "text"
  return "unsupported"
}

interface FilePreviewDialogProps {
  /** Owner of the file (the lesson author), used to build the owner-scoped route. */
  ownerId: string
  /** File to preview, or null when closed. */
  file: FileItem | null
  onClose: () => void
  onDownload: (file: FileItem) => void
}

export default function FilePreviewDialog({
  ownerId,
  file,
  onClose,
  onDownload,
}: FilePreviewDialogProps) {
  const [state, setState] = useState<ViewState>({ status: "loading" })
  const filename = file?.filename

  useEffect(() => {
    if (!filename) return
    let cancelled = false
    let objectUrl: string | null = null

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ status: "loading" })

    objectService
      .previewFrom(ownerId, filename)
      .then(async ({ blob, mimeType }) => {
        if (cancelled) return
        const kind = previewKindOf(mimeType, filename)

        if (kind === "unsupported") {
          setState({ status: "ready", kind })
        } else if (kind === "markdown" || kind === "text") {
          const text = await blob.text()
          if (!cancelled) setState({ status: "ready", kind, text })
        } else {
          objectUrl = URL.createObjectURL(blob)
          if (cancelled) {
            URL.revokeObjectURL(objectUrl)
            return
          }
          setState({ status: "ready", kind, url: objectUrl })
        }
      })
      .catch((error) => {
        console.error("Preview error:", error)
        if (cancelled) return
        // The backend answers 404 for a file that is private to its owner.
        const notVisible = isAxiosError(error) && error.response?.status === 404
        setState({ status: notVisible ? "private" : "error" })
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [ownerId, filename])

  return (
    <Dialog open={file !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[85vh] max-h-[85vh] flex-col sm:max-w-4xl">
        {file && (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="truncate">{file.filename}</DialogTitle>
              <DialogDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 gap-1.5"
                  onClick={() => onDownload(file)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </DialogDescription>
            </DialogHeader>

            <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-md border bg-muted/20 p-3">
              <PreviewBody state={state} filename={file.filename} onDownload={() => onDownload(file)} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PreviewBody({
  state,
  filename,
  onDownload,
}: {
  state: ViewState
  filename: string
  onDownload: () => void
}) {
  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Spinner />
        Loading preview...
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <p className="py-16 text-center text-sm text-destructive">
        Impossible to load this file.
      </p>
    )
  }

  if (state.status === "private") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-sm text-muted-foreground">
        <Lock className="h-8 w-8" />
        <p>This file is private. Only its owner can open it.</p>
      </div>
    )
  }

  switch (state.kind) {
    case "image":
      return (
        <img
          src={state.url}
          alt={filename}
          className="mx-auto max-h-full object-contain"
        />
      )
    case "pdf":
      return (
        <iframe
          src={state.url}
          title={filename}
          className="h-full min-h-[60vh] w-full rounded-md border bg-background"
        />
      )
    case "video":
      return <video src={state.url} controls className="mx-auto max-h-full" />
    case "audio":
      return <audio src={state.url} controls className="mx-auto w-full" />
    case "markdown":
      return (
        <div className="rounded-md bg-background p-6">
          <MarkdownContent content={state.text ?? ""} />
        </div>
      )
    case "text":
      return (
        <pre className="whitespace-pre-wrap break-words rounded-md bg-background p-4 font-mono text-xs text-foreground">
          {state.text}
        </pre>
      )
    default:
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-sm text-muted-foreground">
          <FileQuestion className="h-8 w-8" />
          <p>No preview is available for this file type.</p>
          <Button variant="outline" size="sm" onClick={onDownload} className="gap-1.5">
            <Download className="h-4 w-4" />
            Download instead
          </Button>
        </div>
      )
  }
}
