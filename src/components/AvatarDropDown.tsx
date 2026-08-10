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
          <DropdownMenuItem>
            <FileIcon />
            My Files
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookIcon />
            My Lessons
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UsersIcon />
            My Friends
          </DropdownMenuItem>
           <DropdownMenuItem>
            <MessageCircleIcon />
            Messages
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Edit Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
