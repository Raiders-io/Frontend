export type FileListTableColumn = 'Icon' | 'Name' | 'Size' | 'Type' | 'Visibility' | 'Created at'

type FileListTableHeadRowProps = {
	columns: FileListTableColumn[]
}

export default function FileListTableHeadRow({ columns }: FileListTableHeadRowProps) {
	return (
		<tr className="text-left">
			{columns.includes('Icon') && <th className="px-4 py-3 font-medium">Icon</th>}
			{columns.includes('Name') && <th className="px-4 py-3 font-medium">Name</th>}
			{columns.includes('Size') && <th className="px-4 py-3 font-medium">Size</th>}
			{columns.includes('Type') && <th className="px-4 py-3 font-medium">Type</th>}
			{columns.includes('Visibility') && <th className="px-4 py-3 font-medium">Visibility</th>}
			{columns.includes('Created at') && <th className="px-4 py-3 font-medium">Created at</th>}
		</tr>
	)
}