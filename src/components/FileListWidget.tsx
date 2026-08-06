import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { objectService } from '@/services/object_service'

type FileObject = {
	id?: string
	name: string
	sizeBytes?: number
	mimeType?: string
	visibility?: string
	createdAt?: string
}

type PaginationMeta = {
	currentPage?: number
	lastPage?: number
	perPage?: number
	total?: number
}

type ObjectIndexResponse = {
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

function isFileObject(value: unknown): value is FileObject {
	return typeof value === 'object' && value !== null && 'name' in value && typeof (value as FileObject).name === 'string'
}

function resolveFileList(payload: unknown): { files: FileObject[]; meta: PaginationMeta | null } {
	if (Array.isArray(payload)) {
		return {
			files: payload.filter(isFileObject),
			meta: null,
		}
	}

	if (!payload || typeof payload !== 'object') {
		return {
			files: [],
			meta: null,
		}
	}

	const response = payload as ObjectIndexResponse & {
		files?: unknown
		results?: unknown
		data?: unknown
		objects?: unknown
		meta?: PaginationMeta
	}

	const nestedCandidates = [response.data, response.objects, response.files, response.results]
	for (const candidate of nestedCandidates) {
		if (Array.isArray(candidate)) {
			return {
				files: candidate.filter(isFileObject),
				meta: response.meta ?? null,
			}
		}
	}

	for (const candidate of nestedCandidates) {
		if (candidate && typeof candidate === 'object') {
			const nested = candidate as ObjectIndexResponse & { files?: unknown; results?: unknown; data?: unknown; objects?: unknown; meta?: PaginationMeta }
			const nestedArrays = [nested.data, nested.objects, nested.files, nested.results]
			for (const nestedCandidate of nestedArrays) {
				if (Array.isArray(nestedCandidate)) {
					return {
						files: nestedCandidate.filter(isFileObject),
						meta: nested.meta ?? response.meta ?? null,
					}
				}
			}
		}
	}

	return {
		files: [],
		meta: response.meta ?? null,
	}
}

export default function FileListWidget({
	mode = 'full',
	showPagination = true,
	showUpload = true,
	initialLimit = 10,
	maxHeight,
}: FileListWidgetProps) {
	const [files, setFiles] = useState<FileObject[]>([])
	const [loading, setLoading] = useState(true)
	const [uploading, setUploading] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(initialLimit)
	const [meta, setMeta] = useState<PaginationMeta | null>(null)
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		const loadFiles = async () => {
			setLoading(true)
			setError(null)

			try {
				const response = await objectService.index(page, limit)
				const resolved = resolveFileList(response)

				setFiles(resolved.files)
				setMeta(resolved.meta)
			} catch (requestError) {
				console.error('File list error:', requestError)
				setError('Impossible to load the file list.')
				setFiles([])
				setMeta(null)
			} finally {
				setLoading(false)
			}
		}

		void loadFiles()
	}, [page, limit])

	const currentPage = meta?.currentPage ?? page
	const lastPage = meta?.lastPage ?? Math.max(page, 1)
	const totalFiles = meta?.total ?? files.length

	const totalSize = useMemo(() => {
		if (!Array.isArray(files)) {
			return 0
		}

		return files.reduce((sum, file) => sum + Number(file.sizeBytes ?? 0), 0)
	}, [files])

	const hasPreviousPage = currentPage > 1
	const hasNextPage = currentPage < lastPage

	const goPreviousPage = () => {
		if (hasPreviousPage) {
			setPage(currentPage - 1)
		}
	}

	const goNextPage = () => {
		if (hasNextPage) {
			setPage(currentPage + 1)
		}
	}

	const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextLimit = Number(event.target.value)
		if (!Number.isNaN(nextLimit) && nextLimit > 0) {
			setPage(1)
			setLimit(nextLimit)
		}
	}

	const formatFileSize = (bytes?: number) => {
		if (!bytes || bytes <= 0) {
			return '0 B'
		}

		const units = ['B', 'KB', 'MB', 'GB', 'TB']
		const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
		const size = bytes / 1024 ** index

		return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
	}

	const formatDate = (dateString?: string) => {
		if (!dateString) {
			return '-'
		}

		const date = new Date(dateString)
		if (Number.isNaN(date.getTime())) {
			return dateString
		}

		return new Intl.DateTimeFormat('fr-FR', {
			dateStyle: 'medium',
			timeStyle: 'short',
		}).format(date)
	}

	const getFileIcon = (mimeType?: string, fileName?: string) => {
		const label = `${mimeType ?? ''} ${fileName ?? ''}`.toLowerCase()

		if (label.includes('image')) return '🖼️'
		if (label.includes('video')) return '🎞️'
		if (label.includes('audio')) return '🎵'
		if (label.includes('pdf')) return '📕'
		if (label.includes('zip') || label.includes('rar') || label.includes('tar')) return '🗜️'
		if (label.includes('json')) return '🧩'
		if (label.includes('text') || label.includes('plain')) return '📄'

		return '📁'
	}

	const refreshFiles = async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await objectService.index(page, limit)
			const resolved = resolveFileList(response)

			setFiles(resolved.files)
			setMeta(resolved.meta)
		} catch (requestError) {
			console.error('File list error:', requestError)
			setError('Impossible to load the file list.')
			setFiles([])
			setMeta(null)
		} finally {
			setLoading(false)
		}
	}

	const uploadFiles = async (selectedFiles: FileList | File[] | null | undefined) => {
		const filesToUpload = selectedFiles ? Array.from(selectedFiles) : []

		if (filesToUpload.length === 0) {
			setUploadError('Add at least one file.')
			return
		}

		setUploading(true)
		setUploadError(null)
		setUploadSuccess(null)

		try {
			const formData = new FormData()
			for (const file of filesToUpload) {
				formData.append('files[]', file)
			}

			await objectService.store(formData)
			setUploadSuccess(`${filesToUpload.length} file(s) uploaded successfully.`)
			await refreshFiles()
		} catch (requestError) {
			console.error('Upload error:', requestError)
			setUploadError("The upload failed.")
		} finally {
			setUploading(false)
		}
	}

	const openFilePicker = () => {
		fileInputRef.current?.click()
	}

	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		await uploadFiles(event.target.files)
		event.target.value = ''
	}

	const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()
		setIsDragging(true)
	}

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()
		setIsDragging(true)
	}

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		if (event.currentTarget === event.target) {
			setIsDragging(false)
		}
	}

	const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()
		setIsDragging(false)

		await uploadFiles(event.dataTransfer.files)
	}

	const containerClassName = mode === 'compact' ? 'w-full p-4' : 'mx-auto w-full max-w-6xl p-6'
	const visibleColumns = mode === 'compact' ? ['Icon', 'Name', 'Size'] : ['Icon', 'Name', 'Size', 'Type', 'Visibility', 'Created at']

	return (
		<div
			className={containerClassName}
			onDragEnter={showUpload ? handleDragEnter : undefined}
			onDragOver={showUpload ? handleDragOver : undefined}
			onDragLeave={showUpload ? handleDragLeave : undefined}
			onDrop={showUpload ? handleDrop : undefined}
			style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}
		>
			{showUpload && (
				<input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleInputChange} />
			)}

			{isDragging && showUpload && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
					<div className="max-w-md rounded-2xl border border-dashed border-primary bg-background p-8 text-center shadow-xl">
						<p className="text-lg font-semibold">Drop your files here</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Multiple file types are supported, upload will start automatically.
						</p>
						<p className="mt-3 text-sm text-muted-foreground">
							Formats: txt, pdf, md, tex.
						</p>
					</div>
				</div>
			)}

			<Card>
				{mode === 'full' && (
					<CardHeader className="space-y-2">
						<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<div>
								<CardTitle>File Explorer</CardTitle>
								<CardDescription>
									Browse and manage your files. You can upload files by clicking the button or dragging and dropping them into this area.
								</CardDescription>
							</div>
							{showUpload && (
								<Button type="button" onClick={openFilePicker} disabled={uploading}>
									{uploading ? 'Upload in progress...' : 'Upload Files'}
								</Button>
							)}
						</div>
					</CardHeader>
				)}

				{mode === 'compact' && showUpload && (
					<CardHeader className="py-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg">Files</CardTitle>
							<Button type="button" size="sm" onClick={openFilePicker} disabled={uploading}>
								{uploading ? 'Upload...' : 'Upload'}
							</Button>
						</div>
					</CardHeader>
				)}

				<CardContent className="space-y-4">
					{uploadError && (
						<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
							{uploadError}
						</div>
					)}
					{uploadSuccess && (
						<div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
							{uploadSuccess}
						</div>
					)}

					{showPagination && mode === 'full' && (
						<div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-end md:justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium">Pagination</p>
								<p className="text-sm text-muted-foreground">
									Page {currentPage} sur {lastPage}
								</p>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
								<div className="space-y-2">
									<Label htmlFor="limit">Files per page</Label>
									<Input id="limit" type="number" min={1} value={limit} onChange={handleLimitChange} className="w-28" />
								</div>
								<div className="flex gap-2">
									<Button type="button" variant="outline" onClick={goPreviousPage} disabled={!hasPreviousPage}>
										Previous
									</Button>
									<Button type="button" variant="outline" onClick={goNextPage} disabled={!hasNextPage}>
										Next
									</Button>
								</div>
							</div>
						</div>
					)}

					{loading ? (
						<p className="py-8 text-sm text-muted-foreground">Loading files...</p>
					) : error ? (
						<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
							{error}
						</div>
					) : files.length === 0 ? (
						<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
							No files found.
						</div>
					) : (
						<div className="overflow-hidden rounded-lg border">
							<table className={`w-full caption-bottom ${mode === 'compact' ? 'text-xs' : 'text-sm'}`}>
								<thead className="border-b bg-muted/50">
									<tr>
										{visibleColumns.includes('Icon') && (
											<th className="px-4 py-3 font-medium">Icon</th>
										)}
										{visibleColumns.includes('Name') && (
											<th className="px-4 py-3 font-medium">Name</th>
										)}
										{visibleColumns.includes('Size') && (
											<th className="px-4 py-3 font-medium">Size</th>
										)}
										{visibleColumns.includes('Type') && (
											<th className="px-4 py-3 font-medium">Type</th>
										)}
										{visibleColumns.includes('Visibility') && (
											<th className="px-4 py-3 font-medium">Visibility</th>
										)}
										{visibleColumns.includes('Created at') && (
											<th className="px-4 py-3 font-medium">Created at</th>
										)}
									</tr>
								</thead>
								<tbody>
									{files.map((file) => (
										<tr key={file.id ?? file.name} className="border-b last:border-0 hover:bg-muted/30">
											{visibleColumns.includes('Icon') && (
												<td className={`px-4 py-3 ${mode === 'compact' ? 'text-sm' : 'text-lg'}`}>
													{getFileIcon(file.mimeType, file.name)}
												</td>
											)}
											{visibleColumns.includes('Name') && (
												<td className="px-4 py-3 font-medium">{file.name}</td>
											)}
											{visibleColumns.includes('Size') && (
												<td className="px-4 py-3">{formatFileSize(file.sizeBytes)}</td>
											)}
											{visibleColumns.includes('Type') && (
												<td className="px-4 py-3 text-muted-foreground">{file.mimeType ?? '-'}</td>
											)}
											{visibleColumns.includes('Visibility') && (
												<td className="px-4 py-3 capitalize">{file.visibility ?? '-'}</td>
											)}
											{visibleColumns.includes('Created at') && (
												<td className="px-4 py-3 text-muted-foreground">{formatDate(file.createdAt)}</td>
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{mode === 'full' && (
						<div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
							<p>Total: {totalFiles} file(s)</p>
							<p>Total space used: {formatFileSize(totalSize)}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
