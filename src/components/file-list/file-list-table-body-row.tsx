import type { FileObject } from "@/utils/types/object"
import type { FileListTableColumn } from "@/components/file-list/file-list-table-head-row"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CustomCheckbox } from "@/components/CustomCheckbox"
import { DownloadIcon, Globe, GlobeOff, TrashIcon } from "lucide-react"
import { DeleteButton } from "@/components/DeleteButton"
import { useTranslation } from "react-i18next"

type FileListTableBodyRowProps = {
  file: FileObject
  columns: FileListTableColumn[]
  icon: React.ReactNode | string
  formatFileSize: (bytes?: number) => string
  formatDate: (dateString?: string) => string
  compact: boolean
  onSelect: (fileName: string) => void
  onDownload: (fileName: string) => void
  onDelete: (fileName: string) => void
  onChangeVisibility: (
    fileName: string,
    visibility?: FileObject["visibility"],
  ) => void
  isSelected: boolean
  actionSettings?: {
    showDownloadButton?: boolean
    showVisibilityButton?: boolean
    showDeleteButton?: boolean
  }
}

export default function FileListTableBodyRow({
  file,
  columns,
  icon,
  formatFileSize,
  formatDate,
  compact,
  onSelect,
  onDownload,
  onDelete,
  onChangeVisibility,
  isSelected,
  actionSettings = {},
}: FileListTableBodyRowProps) {
  const {
    showDownloadButton = true,
    showVisibilityButton = true,
    showDeleteButton = true,
  } = actionSettings

  const { t } = useTranslation()

  return (
    <TableRow
      key={file.name}
      className="border-b last:border-0 hover:bg-muted/30"
    >
      {columns.includes("Select") && (
        <TableCell className="px-4 py-3">
          <CustomCheckbox
            checked={isSelected}
            onCheckedChange={() => onSelect(file.name)}
          />
        </TableCell>
      )}
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
      {columns.includes("Actions") && (
        <TableCell className="px-4 py-3 w-auto">
          <div className="flex gap-2">
            {showDownloadButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(file.name)}
                title={t("downloadName", "Download {{name}}", {
                  name: file.name,
                })}
                aria-label={t("downloadName", "Download {{name}}", {
                  name: file.name,
                })}
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
            )}
            {showVisibilityButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onChangeVisibility(
                    file.name,
                    file.visibility === "public" ? "private" : "public",
                  )
                }
                title={`Change visibility of ${file.name}`}
                aria-label={`Change visibility of ${file.name}`}
              >
                {file.visibility === "public" ? <GlobeOff /> : <Globe />}
              </Button>
            )}
            {showDeleteButton && (
              <DeleteButton
                action={() => onDelete(file.name)}
                title={`Delete ${file.name}`}
                description="This action cannot be undone."
              >
                <Button
                  variant="destructive"
                  size="sm"
                  title={`Delete ${file.name}`}
                  aria-label={`Delete ${file.name}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </DeleteButton>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}
