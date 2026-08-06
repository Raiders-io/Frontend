// Use types from ObjectStorage/APi-ObjectStorage/app/class/objects.ts
export type FileObject = {
	id?: string
	name: string
	sizeBytes?: number
	mimeType?: string
	visibility?: string
	createdAt?: string
}

export type PaginationMeta = {
	currentPage?: number
	lastPage?: number
	perPage?: number
	total?: number
}

export type ObjectIndexResponse = {
	meta?: PaginationMeta
	data?: FileObject[]
	objects?: FileObject[]
}

export type FileListWidgetProps = {
	mode?: 'full' | 'compact'
	showPagination?: boolean
	showUpload?: boolean
	initialLimit?: number
	maxHeight?: string
}
