import { Settings } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverHeader } from "@/components/ui/popover"
import { Button } from "../ui/button"
import { useActionSettingsStore } from "@/utils/stores/action_settings_store"
import i18next from 'i18next'

export const ActionSettings = () => {
  const {
    showDownloadButton,
    showVisibilityButton,
    showDeleteButton,
    setShowDownloadButton,
    setShowVisibilityButton,
    setShowDeleteButton,
  } = useActionSettingsStore()

  return (
    <>
      <Popover>
        <PopoverTrigger asChild className="p-1">
          <Button variant="ghost">
            {i18next.t('actionsSettings', 'Actions settings')} <Settings />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader className="font-bold">
            <PopoverTitle>{i18next.t('actionsButtonsSelector', 'Actions buttons Selector')}</PopoverTitle>
            <PopoverDescription>
              {i18next.t('selectWhichActionButtonsYouWantToDisplayInTheFileList', 'Select which action buttons you want to display in the file list.')}
            </PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-3">
            <Field orientation="horizontal">
              <Checkbox
                id="action-checkbox-download-button-in-file-list"
                name="action-checkbox-download-button-in-file-list"
                checked={showDownloadButton}
                onCheckedChange={(checked) =>
                  setShowDownloadButton(checked as boolean)
                }
              />
              <FieldLabel
                htmlFor="action-checkbox-download-button-in-file-list"
                className="font-normal"
              >
                {i18next.t('downloadFile', 'Download file')}
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="action-checkbox-make-public-private-button-in-file-list"
                name="action-checkbox-make-public-private-button-in-file-list"
                checked={showVisibilityButton}
                onCheckedChange={(checked) =>
                  setShowVisibilityButton(checked as boolean)
                }
              />
              <FieldLabel
                htmlFor="action-checkbox-make-public-private-button-in-file-list"
                className="font-normal"
              >
                {i18next.t('makeFilePublicprivate', 'Make file public/private')}
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="action-checkbox-delete-button-in-file-list"
                name="action-checkbox-delete-button-in-file-list"
                checked={showDeleteButton}
                onCheckedChange={(checked) =>
                  setShowDeleteButton(checked as boolean)
                }
              />
              <FieldLabel
                htmlFor="action-checkbox-delete-button-in-file-list"
                className="font-normal"
              >
                {i18next.t('deleteFile', 'Delete file')}
              </FieldLabel>
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </>
  )
}
