import { z } from "zod"

export const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  id: z.number().int().positive(),
})
export type Tag = z.infer<typeof tagSchema>

export const CreateLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: tagSchema.array().min(1, "At least one tag is required"),
  privacy: z.boolean(),
  files: z.array(z.string()).optional(),
})
export type CreateLessonPayload = z.infer<typeof CreateLessonSchema>

export const UpdateLessonSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    tags: tagSchema.array().min(1).optional(),
    privacy: z.boolean().optional(),
    files: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
export type UpdateLessonPayload = z.infer<typeof UpdateLessonSchema>

export const FileOperationSchema = z.object({
  files: z.array(z.string()).min(1, "At least one file identifier is required"),
})
export type FileOperationPayload = z.infer<typeof FileOperationSchema>

export const LessonSearchParamsSchema = z.object({
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z
    .enum(["created_at", "updated_at", "title", "name", "pertinence"])
    .optional(),
  direction: z.enum(["asc", "desc"]).optional(),
})
export type LessonSearchParamsZod = z.infer<typeof LessonSearchParamsSchema>

export const CreateLessonResponseSchema = z.object({
  lessonId: z.string(),
})
export type CreateLessonResponse = z.infer<typeof CreateLessonResponseSchema>

export const EMPTY_LESSON_VALUES: CreateLessonPayload = {
  title: "",
  description: "",
  privacy: false,
  tags: [],
  files: [],
}