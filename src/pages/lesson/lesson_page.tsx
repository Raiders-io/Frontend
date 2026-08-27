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
          <FileListWidget
            mode="full"
            showPagination={true}
            showUpload={true}
            initialLimit={5}
          />
        </CustomResizablePanelRightZone>
      </CustomResizablePanelGroup>
    </>
  )
}
