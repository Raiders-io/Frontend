import * as z from "zod"
import type { Tag } from "@/utils/types/lesson"

/**
 * An attachment, whether it is already stored (edit mode: `id` set)
 * or freshly picked by the user (`file` set, to be uploaded on submit).
 * The intern's version only kept the filename and lost the File object,
 * which made the actual upload impossible.
 */
export interface FileItem {
  id?: string
  filename: string
  file?: File
}

export const lessonFormSchema = z.object({
  title: z.string().trim().min(1, "Lesson title is required"),
  description: z.string().optional(),
  isPrivate: z.boolean(),
  tags: z.array(z.custom<Tag>()),
  files: z.array(z.custom<FileItem>()),
})

export type LessonFormValues = z.infer<typeof lessonFormSchema>

export const EMPTY_LESSON_VALUES: LessonFormValues = {
  title: "",
  description: "",
  isPrivate: false,
  tags: [],
  files: [],
}
