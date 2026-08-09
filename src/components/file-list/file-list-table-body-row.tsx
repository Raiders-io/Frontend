import type { FileObject } from "@/utils/types/object"
import type { FileListTableColumn } from "@/components/file-list/file-list-table-head-row"
import { TableCell, TableRow } from "@/components/ui/table"

type FileListTableBodyRowProps = {
  file: FileObject
  columns: FileListTableColumn[]
  icon: string
  formatFileSize: (bytes?: number) => string
  formatDate: (dateString?: string) => string
  compact: boolean
}

export default function FileListTableBodyRow({
  file,
  columns,
  icon,
  formatFileSize,
  formatDate,
  compact,
}: FileListTableBodyRowProps) {
  return (
    <TableRow
      key={file.id ?? file.name}
      className="border-b last:border-0 hover:bg-muted/30"
    >
      {columns.includes("Icon") && (
        <TableCell className={`px-4 py-3 ${compact ? "text-sm" : "text-lg"}`}>
          {icon}
        </TableCell>
      )}
      {columns.includes("Name") && (
        <TableCell className="px-4 py-3 font-medium">{file.name}</TableCell>
      )}
      {columns.includes("Size") && (
        <TableCell className="px-4 py-3">
          {formatFileSize(file.sizeBytes)}
        </TableCell>
      )}
      {columns.includes("Type") && (
        <TableCell className="px-4 py-3 text-muted-foreground">
          {file.mimeType ?? "-"}
        </TableCell>
      )}
      {columns.includes("Visibility") && (
        <TableCell className="px-4 py-3 capitalize">
          {file.visibility ?? "-"}
        </TableCell>
      )}
      {columns.includes("Created at") && (
        <TableCell className="px-4 py-3 text-muted-foreground">
          {formatDate(file.createdAt)}
        </TableCell>
      )}
    </TableRow>
  )
}
