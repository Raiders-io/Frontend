import { ThemeDropDown } from '@/components/themeDropDown'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { UserX, Loader2 } from 'lucide-react'
import { authService } from '@/services/auth_service'
import { router } from '@/utils/router'
import { useAuthStore } from '@/utils/stores/auth_store'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export default function EditProfile() {
  const { t } = useTranslation();

  return (
  <>
  <Card>
    <CardHeader>
      <h1>{t('edit_profile_page')}</h1>
    </CardHeader>
    <CardContent>
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h2>{t('edit_profile')}</h2>
        </CardHeader>
        <CardContent>
          <Textarea placeholder={t('edit_profile_info_1')} className="w-full h-12 p-2 border rounded" />
          <Textarea placeholder={t('edit_profile_info_2')} className="w-full h-12 p-2 border rounded" />
          <Textarea placeholder={t('edit_profile_info_3')} className="w-full h-12 p-2 border rounded" />
        </CardContent>
      </Card>
      <Separator className="my-4" />
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h2>{t('edit_preferences')}</h2>
        </CardHeader>				
        <CardContent className="flex flex-col gap-4">
          <ThemeDropDown />
          <LanguageSwitcher />
        </CardContent>
      </Card>
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h2>{t('account_data')}</h2>
        </CardHeader>				
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </CardContent>
  </Card>
  </>
  )
}

export const DeleteAccountDialog = () => {
  const { t } = useTranslation();
  const { logout } = useAuthStore()
  const [ isDisabled , setIsDisabled] = useState(true)
  const [ countdown, setCountdown ] = useState(5)
  const [ isOpen, setIsOpen ] = useState(false)

  // Timer pour désactiver le bouton
  useEffect(() => {
    if (!isOpen || !isDisabled) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsDisabled(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, isDisabled])

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount()
      logout()
      router.navigate('/login')
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setIsDisabled(true)
      setCountdown(5)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="cursor-pointer"
					aria-label={i18next.t('deleteAccount', 'Delete Account')}
        >
          <UserX />
          {t('delete_account')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
          <UserX />
          </AlertDialogMedia>
          <AlertDialogTitle>{t('delete_account')}</AlertDialogTitle>
          <AlertDialogDescription>
          {t('delete_account_confirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{t('cancel')}</AlertDialogCancel>
          <div className={isDisabled ? "cursor-not-allowed" : ""}>
            <AlertDialogAction 
              disabled={isDisabled} 
              variant="destructive" 
              onClick={handleDeleteAccount}
            >
              {isDisabled ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>{t('please_wait')} {countdown}s</span>
                </div>
              ) : (
                <>{t('delete_account')}</>
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
