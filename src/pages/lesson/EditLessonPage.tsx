import LessonForm from "@/components/lesson/LessonForm";
import { LessonToSchema, type UpdateLessonPayload } from "@/utils/schema/lessonSchema";
import { lessonService } from "@/services/lesson_service";
import type { Lesson } from "@/utils/types/lesson";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import FileListWidget from "@/components/FileListWidget";
import type { FileObject } from "@/utils/types/object";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useTranslation } from 'react-i18next'

export default function EditLessonPage() {
  const { t } = useTranslation()
  const { author, slug } = useParams<{ author: string; slug: string }>()
  const [lesson, setLesson] = useState<Lesson>()
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([])

  const handleFileSelect = (file: FileObject) => {
    setSelectedFiles((prev) => {
      const exists = prev.some((f) => f.name === file.name);
      if (exists) {
        return prev.filter((f) => f.name !== file.name);
      }
      return [...prev, file];
    });
  }

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  }

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)

      try {
        if (!author || !slug)
          throw Error("Missing require routes params")
        const item = await lessonService.getLessonByAuthorAndContent(author, slug)
        setLesson(item)
      } catch (error) {
        setLesson(undefined)
        setSelectedFiles([])
        toast.error(error instanceof Error)
      } finally {
        setLoading(false)
      }
    }

    fetcher()
  }, [author, slug])

  const handleSubmit = async (values: UpdateLessonPayload) => {
    console.log("Submitting Lesson:", values)
    try {
      if (!lesson)
        throw Error("Lesson not found")
      await lessonService.updateLessonById(lesson.lessonId, values)
      toast.success("Lesson updated successfully!")
    } catch (error) {
      console.error("Error creating lesson:", error)
    }
  }

  return (
    <>
      {loading
        ? <div className="flex">
          <h2 className="text-lg font-bold">Loading...</h2>
          <Spinner className="gap-2" />
        </div>
        : lesson ?
        (
          <>
          <LessonForm
          mode="edit"
          loading={loading}
          onSubmit={handleSubmit}
          initialValues={LessonToSchema(lesson)}
          />
          <FileListWidget 
          mode="compact"
          showPagination={true}
          showUpload={false}
          initialLimit={5}
          showActionSettings={false}
          onFileSelect={handleFileSelect} />
          
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-end mb-4">
                <Button variant="destructive" onClick={clearSelectedFiles}>
                  {t('supprimerTout', 'Supprimer tout')}
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {selectedFiles.map((file) => (
                  <Card key={file.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="relative">
                      <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileSelect(file);
                        }}
                        aria-label={t('supprimerName', 'Supprimer {{name}}', { name: file.name })}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {file.mimeType ?? "Unknown type"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.sizeBytes ? t('valKb', '{{val}} KB', { val: (file.sizeBytes / 1024).toFixed(2) }) : "Unknown size"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          </>
        )
          : <h2 className="text-lg font-bold" >{t('failedToLoadLesson', 'Failed to load lesson')}</h2>
      }
    </>
  )
}
