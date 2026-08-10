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
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
