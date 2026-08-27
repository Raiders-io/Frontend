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

export function AvatarDropdown() {
  const { user } = useAuthStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded"
          aria-label="Open user menu"
        >
          <UserAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={changePageFileList} aria-label="My Files">
            <FileIcon />
            My Files
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageLessons} aria-label="My Lessons">
            <BookIcon />
            My Lessons
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={changePageProfile} aria-label="Profile">
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageFriends} aria-label="My Friends">
            <UsersIcon />
            My Friends
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageChat} aria-label="Messages">
            <MessageCircleIcon />
            Messages
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={changePageEditProfile}
            aria-label="Edit Profile"
          >
            <SettingsIcon />
            Edit Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled aria-label="User Name">
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
          <AlertDialogCancel variant="outline" aria-label="Cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleLogout}
            aria-label="Log out"
          >
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
