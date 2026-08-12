import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { objectService } from "@/services/object_service"
import FileListDropOverlay from "@/components/file-list/file-list-drop-overlay"
import FileListUploadFeedback from "@/components/file-list/file-list-upload-feedback"
import FileListPagination from "@/components/file-list/file-list-pagination"
import FileListTableHeadRow, {
  type FileListTableColumn,
} from "@/components/file-list/file-list-table-head-row"
import FileListTableBodyRow from "@/components/file-list/file-list-table-body-row"
import {
  type FileListWidgetProps,
  type FileObject,
  type PaginationMeta,
  type ObjectIndexResponse,
} from "@/utils/types/object"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function isFileObject(value: unknown): value is FileObject {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof (value as FileObject).name === "string"
  )
}

function resolveFileList(payload: unknown): {
  files: FileObject[]
  meta: PaginationMeta | null
} {
  if (Array.isArray(payload)) {
    return {
      files: payload.filter(isFileObject),
      meta: null,
    }
  }

  if (!payload || typeof payload !== "object") {
    return {
      files: [],
      meta: null,
    }
  }

  const response = payload as ObjectIndexResponse & {
    files?: unknown
    results?: unknown
    data?: unknown
    objects?: unknown
    meta?: PaginationMeta
  }

  const nestedCandidates = [
    response.data,
    response.objects,
    response.files,
    response.results,
  ]
  for (const candidate of nestedCandidates) {
    if (Array.isArray(candidate)) {
      return {
        files: candidate.filter(isFileObject),
        meta: response.meta ?? null,
      }
    }
  }

  for (const candidate of nestedCandidates) {
    if (candidate && typeof candidate === "object") {
      const nested = candidate as ObjectIndexResponse & {
        files?: unknown
        results?: unknown
        data?: unknown
        objects?: unknown
        meta?: PaginationMeta
      }
      const nestedArrays = [
        nested.data,
        nested.objects,
        nested.files,
        nested.results,
      ]
      for (const nestedCandidate of nestedArrays) {
        if (Array.isArray(nestedCandidate)) {
          return {
            files: nestedCandidate.filter(isFileObject),
            meta: nested.meta ?? response.meta ?? null,
          }
        }
      }
    }
  }

  return {
    files: [],
    meta: response.meta ?? null,
  }
}

export default function FileListWidget({
  mode = "full",
  showPagination = true,
  showUpload = true,
  initialLimit = 10,
  maxHeight,
}: FileListWidgetProps) {
  const [files, setFiles] = useState<FileObject[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialLimit)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await objectService.index(page, limit)
        const resolved = resolveFileList(response)

        setFiles(resolved.files)
        setMeta(resolved.meta)
      } catch (requestError) {
        console.error("File list error:", requestError)
        setError("Impossible to load the file list.")
        setFiles([])
        setMeta(null)
      } finally {
        setLoading(false)
      }
    }

    void loadFiles()
  }, [page, limit])

  useEffect(() => {
    const resetDragging = () => {
      setIsDragging(false)
    }

    window.addEventListener("dragend", resetDragging)
    window.addEventListener("drop", resetDragging)
    window.addEventListener("blur", resetDragging)

    return () => {
      window.removeEventListener("dragend", resetDragging)
      window.removeEventListener("drop", resetDragging)
      window.removeEventListener("blur", resetDragging)
    }
  }, [])

  const currentPage = meta?.currentPage ?? page
  const lastPage = meta?.lastPage ?? Math.max(page, 1)
  const totalFiles = meta?.total ?? files.length

  const totalSize = useMemo(() => {
    if (!Array.isArray(files)) {
      return 0
    }

    return files.reduce((sum, file) => sum + Number(file.sizeBytes ?? 0), 0)
  }, [files])

  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < lastPage

  const goPreviousPage = () => {
    if (hasPreviousPage) {
      setPage(currentPage - 1)
    }
  }

  const goNextPage = () => {
    if (hasNextPage) {
      setPage(currentPage + 1)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) {
      return "0 B"
    }

    const units = ["B", "KB", "MB", "GB", "TB"]
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    )
    const size = bytes / 1024 ** index

    return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return "-"
    }

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return dateString
    }

    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const getFileIcon = (mimeType?: string, fileName?: string) => {
    const label = `${mimeType ?? ""} ${fileName?.match(/\.[^\.]+$/)?.[0] ?? ""}`.toLowerCase() ?? ""

    if (label.includes("image")) return "🖼️"
    if (label.includes("video")) return "🎞️"
    if (label.includes("audio")) return "🎵"
    if (label.includes("pdf")) return "📕"
    if (label.includes("zip") || label.includes("rar") || label.includes("tar"))
      return "🗜️"
    if (label.includes("json")) return "🧩"
    if (label.includes("text") || label.includes("plain")) return "📄"

    return "📁"
  }

  const refreshFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await objectService.index(page, limit)
      const resolved = resolveFileList(response)

      setFiles(resolved.files)
      setMeta(resolved.meta)
    } catch (requestError) {
      console.error("File list error:", requestError)
      setError("Impossible to load the file list.")
      setFiles([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  const uploadFiles = async (
    selectedFiles: FileList | File[] | null | undefined,
  ) => {
    const filesToUpload = selectedFiles ? Array.from(selectedFiles) : []

    if (filesToUpload.length === 0) {
      setUploadError("Add at least one file.")
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const formData = new FormData()
      for (const file of filesToUpload) {
        formData.append("files[]", file)
      }

      await objectService.store(formData)
      setUploadSuccess(`${filesToUpload.length} file(s) uploaded successfully.`)
      await refreshFiles()
    } catch (requestError) {
      console.error("Upload error:", requestError)
      setUploadError("The upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await uploadFiles(event.target.files)
    event.target.value = ""
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget === event.target) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    await uploadFiles(event.dataTransfer.files)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const containerClassName =
    mode === "compact" ? "w-full p-4" : "mx-auto w-full max-w-6xl p-6"
  const visibleColumns: FileListTableColumn[] =
    mode === "compact"
      ? ["Select", "Icon", "Name", "Size", "Actions"]
      : ["Select", "Icon", "Name", "Size", "Type", "Visibility", "Created at", "Actions"]

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(fileName)) {
        newSet.delete(fileName)
      } else {
        newSet.add(fileName)
      }
      return newSet
    })
  }

  const handleDownload = async (fileName: string) => {
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
    }
  }

  const handleDelete = async (fileName: string) => {
    try {
      await objectService.destroy(fileName)
      await refreshFiles()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleBulkDelete = async () => {
    try {
      await objectService.destroyMany(Array.from(selectedFiles))
      setSelectedFiles(new Set())
      await refreshFiles()
    } catch (error) {
      console.error('Bulk delete error:', error)
    }
  }

  return (
    <div
      className={containerClassName}
      onDragEnter={showUpload ? handleDragEnter : undefined}
      onDragOver={showUpload ? handleDragOver : undefined}
      onDragLeave={showUpload ? handleDragLeave : undefined}
      onDrop={showUpload ? handleDrop : undefined}
      onDragEnd={showUpload ? handleDragEnd : undefined}
      style={maxHeight ? { maxHeight, overflow: "auto" } : undefined}
    >
      {showUpload && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      )}

      <FileListDropOverlay visible={isDragging && showUpload} />

      <Card>
        {mode === "full" && (
          <CardHeader className="space-y-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>File Explorer</CardTitle>
                <CardDescription>
                  Browse and manage your files. You can upload files by clicking
                  the button or dragging and dropping them into this area.
                </CardDescription>
              </div>
              {showUpload && (
                <Button
                  type="button"
                  onClick={openFilePicker}
                  disabled={uploading}
                >
                  {uploading ? "Upload in progress..." : "Upload Files"}
                </Button>
              )}
            </div>
          </CardHeader>
        )}

        {mode === "compact" && showUpload && (
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Files</CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={openFilePicker}
                disabled={uploading}
              >
                {uploading ? "Upload..." : "Upload"}
              </Button>
            </div>
          </CardHeader>
        )}

        <CardContent className="space-y-4">
          <FileListUploadFeedback
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
          />

          {showPagination && mode === "full" && (
            <FileListPagination
              currentPage={currentPage}
              lastPage={lastPage}
              limit={limit}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              onPreviousPage={goPreviousPage}
              onNextPage={goNextPage}
              onLimitChange={(nextLimit) => {
                if (!Number.isNaN(nextLimit) && nextLimit > 0) {
                  setPage(1)
                  setLimit(nextLimit)
                }
              }}
            />
          )}

          {loading ? (
            <p className="py-8 text-sm text-muted-foreground">
              Loading files...
            </p>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : files.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No files found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table
                className={`w-full caption-bottom ${mode === "compact" ? "text-xs" : "text-sm"}`}
              >
                <TableHeader>
                  <FileListTableHeadRow columns={visibleColumns} />
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <FileListTableBodyRow
                      file={file}
                      columns={visibleColumns}
                      icon={getFileIcon(file.mimeType, file.name)}
                      formatFileSize={formatFileSize}
                      formatDate={formatDate}
                      compact={mode === "compact"}
                      onSelect={toggleFileSelection}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      isSelected={selectedFiles.has(file.name)}
                    />
                  ))}
                </TableBody>
                {mode === "full" && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="flex items-center gap-2">
                          {selectedFiles.size > 0 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleBulkDelete}
                            >
                              Delete Selected
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell colSpan={3} className="text-right">
                        Total: {totalFiles} file(s)
                      </TableCell>
                      <TableCell colSpan={3} className="text-right">
                        Total space used: {formatFileSize(totalSize)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  )
}
