// Use types from ObjectStorage/APi-ObjectStorage/app/class/objects.ts
export type ObjectIndexResponseError = {
	// __status: number // HTTP status code, not 'in response body' but in the response header
	__response: string
}

export type ObjectIndexResponse = {
	message: string
	objects: ObjectsContainer
}

export type ObjectStoreResponse = {
	objects: (ObjectError | ObjectSuccess)[]
}

export type ObjectDestroyResponse = {
	data: ObjectError | ObjectSuccess | { __response: ObjectError | ObjectSuccess; }
}

export type ObjectDestroyManyResponse = {
	data: (ObjectError | ObjectSuccess)[]
}

export type ObjectError = {
  key: string
  error: string
}

export type ObjectSuccess = {
  key: string
  message: string
}

export type ObjectsContainer = {
	meta: MetaPagination
	data: FileObject[]
}

export type MetaPagination = {
	total?: number
	perPage?: number
	currentPage?: number
	lastPage?: number
	firstPage?: number,
	firstPageUrl?: string,
	lastPageUrl?: string,
	nextPageUrl?: any,
	previousPageUrl?: any
}

export type FileObject = {
	// key?: string // currently removed
	name: string
	sizeBytes?: number
	mimeType?: string
	visibility?: "public" | "private" | "shared"
	createdAt?: string
}

export type FileListWidgetProps = {
	mode?: 'full' | 'compact'
	showPagination?: boolean
	showUpload?: boolean
	initialLimit?: number
	maxHeight?: string
}
