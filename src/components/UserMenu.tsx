import { useEffect, useState } from "react"
import type { ComponentType } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  BookIcon,
  FileIcon,
  LogInIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"
import {
  changePageChat,
  changePageEditProfile,
  changePageFileList,
  changePageFriends,
  changePageLessons,
  changePageLogin,
  changePageProfile,
  changePageSignup,
} from "@/utils/router/changePage"
import { userService } from "@/services/user_service"
import { authService } from "@/services/auth_service"
import { router } from "@/utils/router"
import { useAuthStore } from "@/utils/stores/auth_store"
import { UserAvatar } from "./user/UserAvatar"
import type { PrivateProfile } from "@/utils/types/user"

type MenuEntry = {
  label: string
  icon: ComponentType
  onSelect: () => void
}

const AUTHENTICATED_GROUPS: MenuEntry[][] = [
  [
    { label: "My Files", icon: FileIcon, onSelect: changePageFileList },
    { label: "My Lessons", icon: BookIcon, onSelect: changePageLessons },
  ],
  [
    { label: "Profile", icon: UserIcon, onSelect: changePageProfile },
    { label: "My Friends", icon: UsersIcon, onSelect: changePageFriends },
    { label: "Messages", icon: MessageCircleIcon, onSelect: changePageChat },
    { label: "Settings", icon: SettingsIcon, onSelect: changePageEditProfile },
  ],
]

const GUEST_GROUPS: MenuEntry[][] = [
  [
    { label: "Log in", icon: LogInIcon, onSelect: changePageLogin },
    { label: "Sign up", icon: UserPlusIcon, onSelect: changePageSignup },
  ],
]

export function UserMenu() {
  const isAuthenticated = useAuthStore((state) => !!state.user)
  const user = useCurrentUser(isAuthenticated)

  const groups = isAuthenticated ? AUTHENTICATED_GROUPS : GUEST_GROUPS

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated &&
        (user ? (
          <span
            className="hidden max-w-32 select-none truncate text-sm text-muted-foreground sm:inline"
            title={user.username}
          >
            {user.username}
          </span>
        ) : (
          <span
            className="hidden h-4 w-16 animate-pulse rounded bg-muted sm:inline-block"
            aria-hidden="true"
          />
        ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 cursor-pointer rounded-full p-0 transition-shadow hover:ring-2 hover:ring-ring/40 focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:ring-2 data-[state=open]:ring-ring"
            aria-label={
              user ? `Open user menu (${user.username})` : "Open account menu"
            }
          >
            <MenuAvatar isAuthenticated={isAuthenticated} user={user} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          {groups.map((group, index) => (
            <div key={index}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuGroup>
                {group.map(({ label, icon: Icon, onSelect }) => (
                  <DropdownMenuItem
                    key={label}
                    onSelect={onSelect}
                    className="cursor-pointer"
                  >
                    <Icon />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </div>
          ))}

          {isAuthenticated && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <LogOutItem />
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function useCurrentUser(enabled: boolean) {
  const [user, setUser] = useState<PrivateProfile | null>(null)

  useEffect(() => {
    if (!enabled) {
      setUser(null)
      return
    }

    let cancelled = false
    userService
      .fetchMe()
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch((e) => console.error("Unable to load profile", e))

    return () => {
      cancelled = true
    }
  }, [enabled])

  return user
}

function MenuAvatar({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean
  user: PrivateProfile | null
}) {
  if (isAuthenticated && user) {
    return <UserAvatar user={user} className="h-9 w-9 shrink-0" />
  }

  if (isAuthenticated) {
    return <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
  }

  return (
    <Avatar className="h-9 w-9 shrink-0">
      <AvatarImage src="/default-avatar.jpg" alt="" />
      <AvatarFallback>
        <UserIcon className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  )
}

function LogOutItem() {
  const logout = useAuthStore((state) => state.logout)

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
            You will be signed out of your account.
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
