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

export function UnfriendDialog({ username, disabled, onConfirm }: UnfriendDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IconAction
          icon={UserMinus}
          label={`Retirer ${username}`}
          tooltip="Retirer de mes amis"
          disabled={disabled}
        />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Retirer cet ami ?</AlertDialogTitle>
          <AlertDialogDescription>@{username} sera retiré de votre liste d'amis.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Annuler</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Retirer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
