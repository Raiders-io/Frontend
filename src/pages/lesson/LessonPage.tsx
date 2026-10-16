import {
  CustomResizablePanelGroup,
  CustomResizablePanelLeftZone,
  CustomResizablePanelLeftZoneToggle,
  CustomResizablePanelRightZone,
  CustomResizablePanelRightZoneToggle,
  CustomResizablePanelHandle,
} from "@/components/CustomResizablePanel"
import LessonDisplay from "@/components/lesson/LessonDisplay"
import { mockFiles } from "@/utils/mock"
import { lessonService } from "@/services/lesson_service"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Lesson } from "@/utils/types/lesson"

interface lessonProps {
  className?: string
}

export default function LessonPage({ className }: lessonProps) {
  // const [files, setFiles] = useState(mockFiles)
  const files = mockFiles
  const { author, slug } = useParams<{ author: string; slug: string }>()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!author || !slug) return

    const fetchLesson = async () => {
      setLoading(true)
      try {
        const lesson = await lessonService.getLessonByAuthorAndContent(author, slug)
        setLesson(lesson)
      } catch (error) {
        console.error("Error fetching lesson:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [author, slug])

  if (!lesson) {
    return <p>Lesson not found.</p>
  }

  return (
    <div className={className}>
      <CustomResizablePanelGroup>
        <CustomResizablePanelLeftZoneToggle />
        <CustomResizablePanelLeftZone>
          {
            loading
              ? <p>Loading lesson...</p>
              :
              lesson
                ? <LessonDisplay lesson={lesson} />
                : <p>No lesson available.</p>
          }
        </CustomResizablePanelLeftZone>
        <CustomResizablePanelHandle />
        <CustomResizablePanelRightZoneToggle />
        <CustomResizablePanelRightZone>
          <div>
            <h1 className="text-2xl font-bold mb-4">EXAM WIP</h1>
            <p className="mb-2">This section is under development.</p>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Files</h2>
            {files && files.length > 0 ? (
              <ul className="list-disc list-inside">
                {files.map((file, index) => (
                  <li key={index}>{file.filename}</li>
                ))}
              </ul>
            ) : (
              <p>No files available.</p>
            )}
          </div>
        </CustomResizablePanelRightZone>
      </CustomResizablePanelGroup>
    </div>
  )
}
