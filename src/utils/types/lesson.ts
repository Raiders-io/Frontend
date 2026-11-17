import type { PaginationMeta } from "@/utils/types/common"

export interface file {
  filename: string
}

export interface Tag {
  id: number
  name: string
}

export interface Lesson {
  title: string
  lessonId: string
  slug: string
  authorId: string
  author: {
    username: string
    id: string
  }
  isPrivate?: boolean
  description?: string
  tags: Tag[]
  files?: file[]
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedLessonsResponse {
  meta: PaginationMeta
  data: Lesson[]
}

export interface LessonSearchParams {
  title?: string
  tags?: string[]
  page?: number
  limit?: number
  sortBy?: "created_at" | "updated_at" | "title" | "name" | "pertinence"
  direction?: "asc" | "desc"
}
