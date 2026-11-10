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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IconAction
          icon={UserMinus}
          label={t('removeUsername', 'Remove {{username}}', { username })}
          tooltip="Remove from friends"
          disabled={disabled}
        />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('removeFriend', 'Remove friend ?')}</AlertDialogTitle>
          <AlertDialogDescription>{t('usernameWillBeRemovedFromYourFriendsList', '@{{username}} will be removed from your friends list.', { username })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{t('cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {t('remove', 'Remove')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
