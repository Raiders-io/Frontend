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
  const { logout, user } = useAuthStore()
  const [isDisabled, setIsDisabled] = useState(true)
  const [countdown, setCountdown] = useState(5)
  const [confirmationInput, setConfirmationInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  let toastId: string | number
  // Timer pour désactiver le bouton
  useEffect(() => {
    if (!isOpen || countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [isOpen, countdown])

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount()
      toast.success("Account deleted successfully.", { id: toastId })
      logout()
      router.navigate("/login")
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    toastId = toast.warning(
      "Are you sure you want to delete your account? This action cannot be undone.",
      { duration: 5000 },
    )
    if (!open) {
      setIsDisabled(true)
      setCountdown(5)
      setConfirmationInput("")
    }
  }

  const isConfirmed = confirmationInput === user?.id

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
            To confirm, please type your id: <strong>{user?.id}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-4 pb-4">
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Enter your id"
            className="w-full p-2 border rounded"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDisabled || !isConfirmed}
            variant="destructive"
            onClick={handleDeleteAccount}
          >
            {isDisabled ? (
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
