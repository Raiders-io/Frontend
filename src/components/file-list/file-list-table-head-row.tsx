import { TableRow, TableHead } from "@/components/ui/table"

export type FileListTableColumn =
  "Icon" | "Name" | "Size" | "Type" | "Visibility" | "Created at"

type FileListTableHeadRowProps = {
  columns: FileListTableColumn[]
}

export default function FileListTableHeadRow({
  columns,
}: FileListTableHeadRowProps) {
  return (
    <TableRow>
      {columns.includes("Icon") && (
        <TableHead className="px-4 py-3 font-medium">Icon</TableHead>
      )}
      {columns.includes("Name") && (
        <TableHead className="px-4 py-3 font-medium">Name</TableHead>
      )}
      {columns.includes("Size") && (
        <TableHead className="px-4 py-3 font-medium">Size</TableHead>
      )}
      {columns.includes("Type") && (
        <TableHead className="px-4 py-3 font-medium">Type</TableHead>
      )}
      {columns.includes("Visibility") && (
        <TableHead className="px-4 py-3 font-medium">Visibility</TableHead>
      )}
      {columns.includes("Created at") && (
        <TableHead className="px-4 py-3 font-medium">Created at</TableHead>
      )}
    </TableRow>
  )
}
