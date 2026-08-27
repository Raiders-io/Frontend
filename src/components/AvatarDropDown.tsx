import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/utils/stores/auth_store"
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  BookIcon,
  FileIcon,
  UsersIcon,
  MessageCircleIcon,
} from "lucide-react"
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
import {
  changePageChat,
  changePageEditProfile,
  changePageFileList,
  changePageFriends,
  changePageLessons,
  changePageProfile,
} from "@/utils/router/changePage"
import { authService } from "@/services/auth_service"
import { router } from "@/utils/router"
import { UserAvatar } from "@/components/UserAvatar"
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export function AvatarDropdown() {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded"
          aria-label={t('openUserMenu', 'Open user menu')}
        >
          <UserAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={changePageFileList} aria-label={t('myFiles', 'My Files')}>
            <FileIcon />
            {t('myFiles', 'My Files')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageLessons} aria-label={t('myLessons', 'My Lessons')}>
            <BookIcon />
            {t('myLessons', 'My Lessons')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={changePageProfile} aria-label="Profile">
            <UserIcon />
            {t('profile', 'Profile')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageFriends} aria-label={t('myFriends', 'My Friends')}>
            <UsersIcon />
            {t('myFriends', 'My Friends')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageChat} aria-label="Messages">
            <MessageCircleIcon />
            {t('messages', 'Messages')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={changePageEditProfile}
            aria-label={t('editProfile', 'Edit Profile')}
          >
            <SettingsIcon />
            {t('editProfile', 'Edit Profile')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled aria-label={t('userName', 'User Name')}>
            {user?.fullName}
          </DropdownMenuItem>
          <LogOutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const LogOutButton = () => {
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Error during logout:", error)
    }
    logout()
    router.navigate("/login")
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <LogOutIcon />
          {i18next.t('logOut', 'Log out')}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <LogOutIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>{i18next.t('logOut', 'Log out')}</AlertDialogTitle>
          <AlertDialogDescription>
            {i18next.t('youWillGetDisconnected', 'You will get disconnected')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" aria-label={i18next.t('cancel', 'Cancel')}>
            {i18next.t('cancel', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleLogout}
            aria-label={i18next.t('logOut', 'Log out')}
          >
            {i18next.t('logOut', 'Log out')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
