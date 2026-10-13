import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  UserIcon,
  SettingsIcon,
  BookIcon,
  FileIcon,
  UsersIcon,
  MessageCircleIcon,
} from "lucide-react"
import {
  changePageChat,
  changePageEditProfile,
  changePageFileList,
  changePageFriends,
  changePageLessons,
  changePageProfile,
} from "@/utils/router/changePage"
import { userService } from "@/services/user_service"
import { UserAvatar } from "./user/UserAvatar"
import type { Me } from "@/utils/types/user"

export function AvatarDropdown() {
  const [user, setUser] = useState<Me | null>(null)

  useEffect(() => {
    let cancelled = false
    userService
      .fetchMe()
      .then((data) => !cancelled && setUser(data))
      .catch((e) => console.error("Unable to load profile", e))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded"
          aria-label="Open user menu"
        >
          {user && <UserAvatar user={user} />}
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
            aria-label="Settings"
          >
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled aria-label="Credentials Name">
            {user?.id}
          </DropdownMenuItem>
          {/* <LogOutButton /> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}