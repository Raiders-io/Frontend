export interface file {
  name: string
  id: string
}

export interface Tag {
  id: string
  name: string
}

export interface Lesson {
  title: string
  UUID: string
  slug: string
  authorId: number
  isPrivate: boolean
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

export interface LessonSearchParams {
  title?: string
  tags?: string[]
  page?: number
  limit?: number
  sortBy?: 'created_at' | 'updated_at' | 'title' | 'name' | 'pertinence'
  direction?: 'asc' | 'desc'
}