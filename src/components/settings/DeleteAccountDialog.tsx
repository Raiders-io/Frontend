import { useEffect, useState } from "react"
import { Loader2, UserX } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/auth_service"
import { changePageLogin } from "@/utils/router/changePage"
import { useAuthStore } from "@/utils/stores/auth_store"
import { useTranslation } from 'react-i18next'

const REQUIRED_PHRASE = "delete my account"
const COUNTDOWN_SECONDS = 5

export function DeleteAccountDialog() {
  const { t } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)

  const isConfirmed = input.trim().toLowerCase() === REQUIRED_PHRASE
  // Derived, not stored: the button is usable once the phrase is right AND
  // the countdown is over.
  const isWaiting = isConfirmed && countdown > 0

  // The countdown only runs while the phrase is correct.
  useEffect(() => {
    if (!open || !isConfirmed || countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [open, isConfirmed, countdown])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    setInput("")
    setCountdown(COUNTDOWN_SECONDS)
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    // Any edit that breaks the phrase restarts the countdown.
    if (value.trim().toLowerCase() !== REQUIRED_PHRASE) {
      setCountdown(COUNTDOWN_SECONDS)
    }
  }

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting your account...")
    try {
      await authService.deleteAccount()
      toast.success(t('accountDeletedSuccessfully', 'Account deleted successfully.'), { id: toastId })
      logout()
      queryClient.clear() // don't keep the deleted user's data in cache
      changePageLogin()
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error(t('failedToDeleteAccountPleaseTryAgain', 'Failed to delete account. Please try again.'), {
        id: toastId,
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" aria-label={t('deleteAccount', 'Delete account')}>
          <UserX />
          {t('deleteAccount', 'Delete account')}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <UserX />
          </AlertDialogMedia>
          <AlertDialogTitle>{t('deleteAccount', 'Delete account')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('accountWillBeDeleted', 'Your account will be permanently deleted and you will be logged\n            out. This action cannot be undone.')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <label htmlFor="delete-account-confirmation" className="text-sm">
            {t('toConfirmType', 'To confirm, type')}{" "}
            <strong className="select-none">{REQUIRED_PHRASE}</strong>
          </label>
          <Input
            id="delete-account-confirmation"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={REQUIRED_PHRASE}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{t('cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!isConfirmed || isWaiting}
            onClick={handleDelete}
          >
            {isWaiting ? (
              <>
                <Loader2 className="animate-spin" />{t('pleaseWaitCountdowns', 'Please wait {{countdown}}s', { countdown })}</>
            ) : (
              <>
                <UserX />
                {t('deleteAccount', 'Delete account')}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
