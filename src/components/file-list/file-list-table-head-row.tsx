import { TableRow, TableHead } from "@/components/ui/table"
import { useTranslation } from 'react-i18next'

export type FileListTableColumn =
  | "Icon"
  | "Name"
  | "Size"
  | "Type"
  | "Visibility"
  | "Created at"
  | "Select"
  | "Actions"

type FileListTableHeadRowProps = {
  columns: FileListTableColumn[]
}

export default function FileListTableHeadRow({
  columns,
}: FileListTableHeadRowProps) {
  const { t } = useTranslation()
  return (
    <TableRow>
      {columns.includes("Select") && (
        <TableHead className="px-4 py-3 font-medium">{t('select', 'Select')}</TableHead>
      )}
      {columns.includes("Icon") && (
        <TableHead className="px-4 py-3 font-medium">{t('icon', 'Icon')}</TableHead>
      )}
      {columns.includes("Name") && (
        <TableHead className="px-4 py-3 font-medium">Name</TableHead>
      )}
      {columns.includes("Size") && (
        <TableHead className="px-4 py-3 font-medium">{t('size', 'Size')}</TableHead>
      )}
      {columns.includes("Type") && (
        <TableHead className="px-4 py-3 font-medium">Type</TableHead>
      )}
      {columns.includes("Visibility") && (
        <TableHead className="px-4 py-3 font-medium">{t('visibility', 'Visibility')}</TableHead>
      )}
      {columns.includes("Created at") && (
        <TableHead className="px-4 py-3 font-medium">{t('createdAt', 'Created at')}</TableHead>
      )}
      {columns.includes("Actions") && (
        <TableHead className="px-4 py-3 font-medium">{t('actions', 'Actions')}</TableHead>
      )}
    </TableRow>
  )
}
