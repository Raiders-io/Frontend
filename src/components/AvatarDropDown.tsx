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

export function AvatarDropdown() {
  const { user, logout } = useAuthStore()
  
  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const handleProfile = () => {
    window.location.href = '/profile'
  }

  const handleFiles = () => {
    window.location.href = '/file/list'
  }

  const handleLessons = () => {
    window.location.href = '/lessons'
  }

  const handleFriends = () => {
    window.location.href = '/friends'
  }

  const handleMessages = () => {
    window.location.href = '/messages'
  }

  const handleEditProfile = () => {
    window.location.href = '/edit-profile'
  }
  
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
          <DropdownMenuItem onClick={handleFiles}>
            <FileIcon />
            My Files
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLessons}>
            <BookIcon />
            My Lessons
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfile}>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleFriends}>
            <UsersIcon />
            My Friends
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMessages}>
            <MessageCircleIcon />
            Messages
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditProfile}>
            <SettingsIcon />
            Edit Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <LogOutButton action={handleLogout} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const LogOutButton = ({ action }: { action: () => void }) => {
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
          <AlertDialogAction variant="destructive" onClick={action}>
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
