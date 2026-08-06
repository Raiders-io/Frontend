import type { FileObject } from '@/utils/types/object'
import type { FileListTableColumn } from '@/components/file-list/file-list-table-head-row'

type FileListTableBodyRowProps = {
	file: FileObject
	columns: FileListTableColumn[]
	icon: string
	formatFileSize: (bytes?: number) => string
	formatDate: (dateString?: string) => string
	compact: boolean
}

export default function FileListTableBodyRow({ file, columns, icon, formatFileSize, formatDate, compact }: FileListTableBodyRowProps) {
	return (
		<tr key={file.id ?? file.name} className="border-b last:border-0 hover:bg-muted/30">
			{columns.includes('Icon') && <td className={`px-4 py-3 ${compact ? 'text-sm' : 'text-lg'}`}>{icon}</td>}
			{columns.includes('Name') && <td className="px-4 py-3 font-medium">{file.name}</td>}
			{columns.includes('Size') && <td className="px-4 py-3">{formatFileSize(file.sizeBytes)}</td>}
			{columns.includes('Type') && <td className="px-4 py-3 text-muted-foreground">{file.mimeType ?? '-'}</td>}
			{columns.includes('Visibility') && <td className="px-4 py-3 capitalize">{file.visibility ?? '-'}</td>}
			{columns.includes('Created at') && <td className="px-4 py-3 text-muted-foreground">{formatDate(file.createdAt)}</td>}
		</tr>
	)
}