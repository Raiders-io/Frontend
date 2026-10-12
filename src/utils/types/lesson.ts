export interface file {
  name: string
  id: string
}

export interface Tag {
  id: number
  name: string
}

export interface Lesson {
  title: string
  UUID: string
  slug: string
  authorId: number
  author: string
  isPrivate: boolean
  description: string
  tags: Tag[]
  files: file[]
}

export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  firstPage: number
  firstPageUrl: string | null
  lastPageUrl: string | null
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface PaginatedLessonsResponse {
  meta: PaginationMeta
  data: Lesson[]
}

export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  first_page: number
  first_page_url: string
  last_page_url: string
  next_page_url: string | null
  previous_page_url: string | null
}

export interface LessonSearchParams {
  title?: string
  tags?: string[]
  page?: number
  limit?: number
  sortBy?: "created_at" | "updated_at" | "title" | "name" | "pertinence"
  direction?: "asc" | "desc"
}
