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

export const ActionSettings = () => {
  return (
    <>
        <Popover>
          <PopoverTrigger asChild className="p-1">
            <Button variant="ghost">
              Actions settings <Settings />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader className="font-bold">
			<PopoverTitle>
				Actions buttons Selector
			</PopoverTitle>
			<PopoverDescription>
				Select which action buttons you want to display in the file list.
			</PopoverDescription>
			</PopoverHeader>
            <FieldGroup className="gap-3">
              <Field orientation="horizontal">
                <Checkbox
                  id="action-checkbox-download-button-in-file-list"
                  name="action-checkbox-download-button-in-file-list"
                  defaultChecked
                />
                <FieldLabel
                  htmlFor="action-checkbox-download-button-in-file-list"
                  className="font-normal"
                >
                  Download file
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="action-checkbox-make-public-private-button-in-file-list"
                  name="action-checkbox-make-public-private-button-in-file-list"
                  defaultChecked
                />
                <FieldLabel
                  htmlFor="action-checkbox-make-public-private-button-in-file-list"
                  className="font-normal"
                >
                  Make file public/private
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="action-checkbox-delete-button-in-file-list"
                  name="action-checkbox-delete-button-in-file-list"
				  defaultChecked
                />
                <FieldLabel
                  htmlFor="action-checkbox-delete-button-in-file-list"
                  className="font-normal"
                >
                  Delete file
                </FieldLabel>
              </Field>
            </FieldGroup>
          </PopoverContent>
        </Popover>
    </>
  )
}
