import type { Tag } from "./lesson"

export type SearchResource =
	| "all"
	| "lesson"
	| "user"
	| "exam"
	| "exercise"
	| "video"

export interface SearchResourceOption {
	label: string
	value: SearchResource
}

export type SearchSortValue =
	| "title"
	| "created_at"
	| "updated_at"
	| "pertinence"

export interface SearchSort {
	value: SearchSortValue
	isAscending: boolean
}

export interface SearchQueryParams {
	search: string
	resource?: SearchResource
	tags?: Tag[]
	sort?: SearchSort
	page?: number
	limit?: number
}

export interface SerializedSearchItem<T> {
	kind: string
	data: T
}
