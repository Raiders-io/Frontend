"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Adjust these imports to match your actual project structure
import { useTagStore } from "@/utils/stores/tag_store" 
import type { Tag } from "@/utils/types/lesson"
import TagsSelector from "@/components/lesson/TagsSelector" // Adjust path to your TagsSelector
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { X } from "lucide-react"
// import FileListWidget from "@/components/FileListWidget"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// --- Types ---
export interface FileItem {
  filename: string
}

export interface Lesson {
  title: string
  isPrivate?: boolean
  description?: string
  tags: Tag[]
  files?: FileItem[]
}

// --- Form Schema ---
const formSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false),
})

type FormValues = z.output<typeof formSchema>

export default function LessonCreation() {
  const { tags, fetchData, loading } = useTagStore()
  
  // Local state for complex fields (Tags & Files)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [isPrivate, setIsPrivate] = useState(false)

  // Initialize react-hook-form
  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof formSchema>, undefined, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPrivate: false,
    },
  })

  // Fetch tags on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        filename: file.name,
      }))
      setFiles((prev) => {
        const existingNames = new Set(prev.map((f) => f.filename))
        const uniqueNewFiles = newFiles.filter((f) => !existingNames.has(f.filename))
        return [...prev, ...uniqueNewFiles]
      })
      e.target.value = "" // Reset input to allow re-selecting the same file
    }
  }

  // Remove a file from the list
  const removeFile = (filename: string) => {
    setFiles((prev) => prev.filter((f) => f.filename !== filename))
  }

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    const lessonData: Lesson = {
      title: data.title,
      isPrivate: data.isPrivate,
      description: data.description || undefined,
      tags: selectedTags,
      files: files.length > 0 ? files : undefined,
    }

    console.log("Submitting Lesson:", lessonData)
    // TODO: Replace with actual API call, e.g., await lessonService.createLesson(lessonData)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="space-y-8">
            <div className="space-y-1">
              <FieldLegend>
                <h1 className="text-3xl font-bold tracking-tight">Create New Lesson</h1>
                </FieldLegend>
              <FieldDescription>
                Fill in the details below to create a new lesson. You can attach files and assign tags.
              </FieldDescription>
            </div>

            <FieldGroup className="space-y-8">
              <Field>
                <FieldLabel>
                  <h1 className="text-xl font-medium">Lesson Title</h1>
                  </FieldLabel>
                <FieldContent>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="e.g., Mathematics for Beginners" {...field} />
                    )}
                  />
                </FieldContent>
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>
                  <h1 className="text-lg font-medium">Description</h1>
                  </FieldLabel>
                <FieldContent>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="Briefly describe what this lesson covers..."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    )}
                  />
                </FieldContent>
              </Field>
              <div className="flex gap-4">
              <Field 
              orientation="horizontal"
              onClick={() => setIsPrivate(!isPrivate)}
              className="border rounded-md border-input bg-transparent px-3 py-2 cursor-pointer hover:bg-accent/20"
              >
                <div className="flex flex-1 flex-col gap-0.5">
                  <FieldLabel htmlFor="privacy" className="text-base">
                    {isPrivate ? "Private Lesson" : "Public Lesson"}
                  </FieldLabel>
                  <FieldDescription>
                    {isPrivate
                      ? "Only you and explicitly invited users can view this lesson."
                      : "Everyone can see this lesson and create exam"}
                  </FieldDescription>
                </div>
              </Field>

              <Field className="">
                <div className="flex gap-2">
                <FieldLabel><h1 className="text-lg font-medium">Tags</h1></FieldLabel>
                <FieldContent className="items-end">
                  {loading ? (
                    <div className="flex h-10 items-center rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground">
                      Loading tags...
                    </div>
                  ) : (
                    <TagsSelector
                      tags={tags}
                      variant="compact"
                      selected={selectedTags}
                      setSelection={setSelectedTags}
                    />
                  )}
                </FieldContent>
                </div>
                <FieldDescription>
                  {selectedTags.length > 0
                    ? `${selectedTags.length} tag(s) selected`
                    : "Select relevant tags for this lesson."}
                </FieldDescription>
              </Field>
              </div>

              <Field>
                <FieldLabel>Attachments</FieldLabel>
                <FieldContent>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className=""/>
                    </PopoverTrigger>
                    <PopoverContent className="w-fulf">
                    <FileListWidget mode="compact"/>

                    </PopoverContent>
                  </Popover> */}
                  <div className="space-y-4">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2 text-sm"
                          >
                            <span className="truncate flex-1 font-medium">{file.filename}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => removeFile(file.filename)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove {file.filename}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FieldContent>
                <FieldDescription>
                  Upload any supplementary materials, PDFs, or resources.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Create Lesson
            </Button>
          </div>
        </form>
      </div>
  </div>
  )
}