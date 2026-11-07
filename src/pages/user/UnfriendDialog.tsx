import { UserMinus } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IconAction } from "../../components/homemade/IconAction"

interface UnfriendDialogProps {
  username: string
  disabled?: boolean
  onConfirm: () => void
}

export function UnfriendDialog({
  username,
  disabled,
  onConfirm,
}: UnfriendDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IconAction
          icon={UserMinus}
          label={`Remove ${username}`}
          tooltip="Remove from friends"
          disabled={disabled}
        />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove friend ?</AlertDialogTitle>
          <AlertDialogDescription>
            @{username} will be removed from your friends list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
