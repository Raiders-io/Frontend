import {
  CustomResizablePanelGroup,
  CustomResizablePanelHandle,
  CustomResizablePanelLeftZone,
  CustomResizablePanelRightZone,
} from "@/components/CustomResizablePanel"
import {
  CustomResizablePanelLeftZoneToggle,
  CustomResizablePanelRightZoneToggle,
} from "@/components/CustomResizablePanel"
import FileListWidget from "@/components/FileListWidget"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { objectService } from "@/services/object_service"
import { useState, useRef } from "react"

import ReactMarkdown from "react-markdown"
import { ReactMarkdownStyle } from "@/utils/style/ReactMarkdown"
import remarkGfm from "remark-gfm"
import type { FileObject } from "@/utils/types/object"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { getFileIcon } from "@/utils/utils/object"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function LessonPage() {
  const [fileData, setFileData] = useState<{
    url?: string
    text?: string
    type: "pdf" | "markdown" | "text" | null
  }>({ type: null })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFile = async (fileName: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const { blob, mimeType } = await objectService.getFile(fileName)

      if (mimeType.includes("pdf")) {
        const url = URL.createObjectURL(blob)
        setFileData({ url, type: "pdf" })
      } else if (mimeType.includes("markdown")) {
        const text = await blob.text()
        setFileData({ text, type: "markdown" })
      } else if (mimeType.includes("text")) {
        const text = await blob.text()
        setFileData({ text, type: "text" })
      } else {
        setError("File type not supported for preview.")
      }
    } catch (err) {
      setError(`Failed to load file: ${err}`)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (fileData.type === "pdf") {
      return (
        <embed
          id="inlineLessonContent"
          type="application/pdf"
          width="100%"
          height="100%"
          src={fileData.url}
          style={{ border: "none" }}
        />
      )
    } else if (fileData.type === "markdown") {
      return (
        <div className="prose dark:prose-invert max-w-none p-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={ReactMarkdownStyle}
          >
            {fileData.text}
          </ReactMarkdown>
        </div>
      )
    } else if (fileData.type === "text") {
      return (
        <pre className="p-4 whitespace-pre-wrap bg-muted rounded-md">
          {fileData.text}
        </pre>
      )
    }
    return null
  }

  const handlePreview = async () => {
    const fileName = fileInputRef.current?.value || ""
    if (!fileName) return
    await loadFile(fileName)
  }
  const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([])

  return (
    <>
      <Field orientation="horizontal">
        <Input
          ref={fileInputRef}
          type="search"
          placeholder="File name (e.g., en.subject.pdf)"
        />
        <Button onClick={handlePreview} aria-label="Preview File">
          Preview
        </Button>
      </Field>
      <CustomResizablePanelGroup>
        <CustomResizablePanelLeftZoneToggle />
        <CustomResizablePanelLeftZone>
          {isLoading ? (
            <div className="p-4">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            renderContent()
          )}
        </CustomResizablePanelLeftZone>
        <CustomResizablePanelHandle />
        <CustomResizablePanelRightZoneToggle />
        <CustomResizablePanelRightZone>
          <p className="font-medium mb-2 text-center">Click directly on a row of a file you want for your Lesson</p>
          <ScrollArea className="h-[600] w-[600px] rounded-md border p-4">
            <FileListWidget
              mode="compact"
              showActionSettings={false}
              showPagination={true}
              showUpload={true}
              showSelectColumn={false}
              initialLimit={25}
              onFileSelect={(file) => {
                if (!selectedFiles.some(f => f.name === file.name)) {
                  setSelectedFiles([...selectedFiles, file]);
                }
              }}
            />
          </ScrollArea>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 overflow-y-auto max-h-[60vh]">
            {selectedFiles.map((file) => (
              <Card
                key={file.name}
                className="w-full max-w-xs flex flex-col overflow-hidden"
              >
                <CardHeader className="flex-1 items-center justify-center">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.mimeType, file.name)}
                    <CardTitle className="text-center text-lg font-semibold">
                      {file.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">{file.mimeType || "Unknown type"}</p>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedFiles(selectedFiles.filter(f => f.name !== file.name))}
                  >
                    Remove from list
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CustomResizablePanelRightZone>
      </CustomResizablePanelGroup>
    </>
  )
}
