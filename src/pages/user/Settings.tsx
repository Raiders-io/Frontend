import { useEffect, useState } from "react"
import { Loader2, UserX } from "lucide-react"
import { ThemeDropDown } from "@/components/themeDropDown"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/services/auth_service"
import { router } from "@/utils/router"
import { useAuthStore } from "@/utils/stores/auth_store"
import { toast } from "sonner"

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Here you can edit your preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeDropDown />
        </CardContent>
      </Card>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Account Data</CardTitle>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  )
}

export const DeleteAccountDialog = () => {
  const { logout } = useAuthStore()
  const [isDisabled, setIsDisabled] = useState(true)
  const [countdown, setCountdown] = useState(5)
  const [confirmationInput, setConfirmationInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const REQUIRED_PHRASE = "delete my account"
  const isConfirmed = confirmationInput.trim().toLowerCase() === REQUIRED_PHRASE

  // Timer: Se lance seulement quand la phrase de confirmation est valide
  useEffect(() => {
    if (!isOpen || !isConfirmed || countdown <= 0) {
      if (countdown <= 0) setIsDisabled(false)
      return
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [isOpen, isConfirmed, countdown])

  const handleDeleteAccount = async () => {
    const toastId = toast.loading("Deleting your account...")
    try {
      await authService.deleteAccount()
      toast.success("Account deleted successfully.", { id: toastId })
      logout()
      router.navigate("/login")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("Failed to delete account. Please try again.", { id: toastId })
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      // Reinitialiser les etats a l'ouverture
      setIsDisabled(true)
      setCountdown(5)
      setConfirmationInput("")
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" aria-label="Delete Account">
          <UserX />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <UserX />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Your account will be permanently deleted and you will be logged out.
            This action cannot be undone.
            <br />
            <br />
            To confirm, please type:{" "}
            <strong
              className="select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              {REQUIRED_PHRASE}
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-4 pb-4">
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => {
              setConfirmationInput(e.target.value)
              // Reset du countdown et du statut si l'utilisateur modifie la saisie
              if (e.target.value.trim().toLowerCase() !== REQUIRED_PHRASE) {
                setCountdown(5)
                setIsDisabled(true)
              }
            }}
            placeholder={`Type "${REQUIRED_PHRASE}"`}
            className="w-full p-2 border rounded bg-background text-foreground"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDisabled || !isConfirmed}
            variant="destructive"
            onClick={handleDeleteAccount}
          >
            {isConfirmed && isDisabled ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Please wait {countdown}s
              </>
            ) : (
              <>
                <UserX />
                Delete Account
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}