import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"
import { objectService } from "@/services/object_service"
import type { ObjectError } from "@/utils/types/object"
import i18next from 'i18next'

export type FileConflictDialogProps = {
  conflicts: ObjectError[]
  originalFiles: File[]
  onComplete: () => void
  onCancel: () => void
}

export const FileConflictDialog = ({
  conflicts,
  originalFiles,
  onComplete,
  onCancel,
}: FileConflictDialogProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  // Extract just the filename from the key (format: "files/uuid/filename.ext")
  const conflictFileNames = conflicts.map((c) => {
    const lastSlashIndex = c.key.lastIndexOf("/")
    return lastSlashIndex >= 0 ? c.key.slice(lastSlashIndex + 1) : c.key
  })
  const filesToUpdate = originalFiles.filter((f) =>
    conflictFileNames.includes(f.name),
  )

  const handleUpdateAll = async () => {
    setIsUpdating(true)
    setUpdateError(null)

    try {
      const formData = new FormData()
      filesToUpdate.forEach((file) => {
        formData.append("files[]", file, file.name)
      })

      await objectService.updateMany(formData)
      onComplete()
    } catch (error) {
      console.error("Update error:", error)
      setUpdateError("Failed to update some files. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const conflictCount = conflicts.length

  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning">
            <AlertTriangle />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-wrap wrap-anywhere">
            {conflictCount > 1
              ? i18next.t('conflictcountFilesAlreadyExist', '{{conflictCount}} files already exist', { conflictCount })
              : i18next.t('fileAlreadyExists', 'File already exists')}
          </AlertDialogTitle>
          <AlertDialogDescription style={{ whiteSpace: "pre-line" }}>
            {conflictCount > 1
              ? i18next.t('theFollowingFilesAlreadyExistAndCannotBeOverwrittenWithAStandardUploadValWouldYouLikeToReplaceThem', 'The following files already exist and cannot be overwritten with a standard upload:\n\n{{val}}\n\nWould you like to replace them?', { val: Array.from(
                  conflictFileNames,
                )
                  .map((element) => `- ${element}`)
                  .join("\n") })
              : i18next.t('theFileValAlreadyExistsWouldYouLikeToReplaceIt', 'The file "{{val}}" already exists. Would you like to replace it?', { val: conflictFileNames[0] })}
            {updateError && (
              <div className="mt-4 text-destructive">{updateError}</div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            onClick={onCancel}
            disabled={isUpdating}
            aria-label={i18next.t('cancel', 'Cancel')}
          >
            {i18next.t('cancel', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="default"
            onClick={handleUpdateAll}
            disabled={isUpdating}
            aria-label={i18next.t('replaceFiles', 'Replace Files')}
          >
            {isUpdating ? "Replacing..." : "Replace"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
