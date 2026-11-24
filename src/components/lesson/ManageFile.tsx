import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Paperclip, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import FileListWidget from "@/components/FileListWidget"
import { lessonService } from "@/services/lesson_service"
import type { Lesson, file as LessonFile } from "@/utils/types/lesson"
import type { FileObject } from "@/utils/types/object"

interface ManageFileProps {
  lesson: Lesson
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with the authoritative attachment list after every change. */
  onFilesChange?: (lessonId: string, files: LessonFile[]) => void
}

export default function ManageFile({
  lesson,
  open,
  onOpenChange,
  onFilesChange,
}: ManageFileProps) {
  const { lessonId, title } = lesson
  const [attachedFiles, setAttachedFiles] = useState<LessonFile[]>([])
  const [loading, setLoading] = useState(true)
  // Filename of the operation in flight; blocks further changes until it settles.
  const [pending, setPending] = useState<string | null>(null)
  // The library must not toggle against a stale attachment list.
  const busy = loading || pending !== null

  // Kept in a ref so a parent passing a new callback on every render does not
  // re-trigger the fetch effect below.
  const onFilesChangeRef = useRef(onFilesChange)
  useEffect(() => {
    onFilesChangeRef.current = onFilesChange
  }, [onFilesChange])

  const refresh = useCallback(async () => {
    const files = await lessonService.getFilesByLessonId(lessonId)
    setAttachedFiles(files)
    onFilesChangeRef.current?.(lessonId, files)
  }, [lessonId])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    refresh()
      .catch((error) => {
        console.error("Load lesson files error:", error)
        if (!cancelled) toast.error("Impossible to load the lesson files.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, refresh])

  const runChange = async (
    filename: string,
    action: () => Promise<unknown>,
    messages: { success: string; failure: string },
  ) => {
    if (pending) return
    setPending(filename)
    try {
      await action()
      await refresh()
      toast.success(messages.success)
    } catch (error) {
      console.error("Lesson file change error:", error)
      toast.error(messages.failure)
    } finally {
      setPending(null)
    }
  }

  const attach = (filename: string) =>
    runChange(
      filename,
      () => lessonService.attachFilesToLesson(lessonId, { files: [filename] }),
      {
        success: `${filename} attached.`,
        failure: `Impossible to attach ${filename}.`,
      },
    )

  const detach = (filename: string) =>
    runChange(
      filename,
      () => lessonService.detachFilesFromLesson(lessonId, { files: [filename] }),
      {
        success: `${filename} detached.`,
        failure: `Impossible to detach ${filename}.`,
      },
    )

  // Clicking a library row toggles its attachment.
  const handleLibrarySelect = (file: FileObject) => {
    const isAttached = attachedFiles.some((f) => f.filename === file.name)
    if (isAttached) void detach(file.name)
    else void attach(file.name)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage files</DialogTitle>
          <DialogDescription>
            Attach files from your library to &quot;{title}&quot;. Click a file
            to attach or detach it.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Attached files</h3>
            <Badge variant="secondary">{attachedFiles.length}</Badge>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <Spinner />
              Loading attached files...
            </div>
          ) : attachedFiles.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No files attached to this lesson yet.
            </div>
          ) : (
            <ItemGroup className="gap-2">
              {attachedFiles.map((file) => (
                <Item key={file.filename} variant="outline" size="sm">
                  <ItemMedia variant="icon">
                    <Paperclip />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="truncate">{file.filename}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => void detach(file.filename)}
                      disabled={pending !== null}
                      aria-label={`Detach ${file.filename}`}
                      title={`Detach ${file.filename}`}
                    >
                      {pending === file.filename ? <Spinner /> : <X />}
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-medium">Library</h3>
          <div
            className={busy ? "pointer-events-none opacity-60" : undefined}
            aria-busy={busy}
          >
            <FileListWidget
              mode="compact"
              showUpload
              initialLimit={5}
              showRowActions={false}
              attachedFileNames={attachedFiles.map((f) => f.filename)}
              onFileSelect={handleLibrarySelect}
            />
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}
