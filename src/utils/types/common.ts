
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

export interface Paginated<T> {
  meta: PaginationMeta
  data: T[]
}

export interface PaginationParams {
  page?: number
  limit?: number
}
