import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from '@/utils/stores/auth_store'
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  BookIcon,
  FileIcon,
  UsersIcon,
  MessageCircleIcon,
} from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { changePageChat, changePageEditProfile, changePageFileList, changePageFriends, changePageLessons, changePageProfile } from "@/utils/router/changePage"
import { authService } from "@/services/auth_service"
import { router } from "@/utils/router"

export function AvatarDropdown() {
  const { user } = useAuthStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded">
          <Avatar>
            <AvatarImage src="https://github.com/iDarkAxe.png" alt={`Avatar Image of ${user?.fullName}`} />
            <AvatarFallback>{`Avatar Image of ${user?.fullName}`}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={changePageFileList}>
            <FileIcon />
            My Files
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageLessons}>
            <BookIcon />
            My Lessons
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={changePageProfile}>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageFriends}>
            <UsersIcon />
            My Friends
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageChat}>
            <MessageCircleIcon />
            Messages
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageEditProfile}>
            <SettingsIcon />
            Edit Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
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
      logout()
      router.navigate('/login')
    } catch (error) {
      console.error('Error during logout:', error)
    }
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
          Log out
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <LogOutIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Log out</AlertDialogTitle>
          <AlertDialogDescription>
            You will get disconnected
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleLogout}>
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
