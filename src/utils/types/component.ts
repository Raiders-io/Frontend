export type SearchResource =
  "all" | "lesson" | "user" | "exam" | "exercise" | "video"

export interface SearchResourceOption {
  label: string
  value: SearchResource
}

export type SearchSortValue =
  "title" | "created_at" | "updated_at" | "pertinence" 

export interface SearchSort {
  value: SearchSortValue
  isAscending: boolean
}

export interface SearchQueryParams {
  q: string
  page: number
  limit: number
  resource?: SearchResource
  tags?: string[]
  sort?: SearchSortValue
  order?: "asc" | "desc"
}

export interface SerializedSearchItem<T> {
  kind: string
  data: T
}
