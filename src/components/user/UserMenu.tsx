import type { ComponentType } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserAvatarButton } from "./UserAvatarButton"
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
} from "lucide-react"
import {
  changePageChat,
  changePageEditProfile,
  changePageFileList,
  changePageLessons,
  changePageLogin,
  changePageProfile,
  changePageSignup,
} from "@/utils/router/changePage"
import { useMe } from "@/services/user/user_queries"
import { authService } from "@/services/auth_service"
import { router } from "@/utils/router"
import { useAuthStore } from "@/utils/stores/auth_store"
import { UserAvatar } from "./UserAvatar"
import type { PrivateProfile } from "@/utils/types/user"
import { Button } from "../ui/button"

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
  const { data } = useMe()
  const user = isAuthenticated ? data : undefined

  const groups = isAuthenticated ? AUTHENTICATED_GROUPS : GUEST_GROUPS

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        user ? (
          <button
            type="button"
            onClick={() => changePageProfile()}
            className="hidden max-w-32 select-none truncate rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline"
            title={user.username}
          >
            {user.username}
          </button>
        ) : (
          <span
            className="hidden h-4 w-16 animate-pulse rounded bg-muted sm:inline-block"
            aria-hidden="true"
          />
        )
      ) : (
        <Button variant="ghost" size="sm" onClick={() => changePageLogin()}>
          Log in
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatarButton
            label={
              user
                ? `Open user menu (${user.username})`
                : "Open account menu"
            }
          >
            <MenuAvatar
              isAuthenticated={isAuthenticated}
              user={user}
            />
          </UserAvatarButton>
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

function MenuAvatar({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean
  user?: PrivateProfile
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
  const qc = useQueryClient()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Error during logout:", error)
    }
    logout()
    qc.clear() // évite de garder les données de l'utilisateur en cache
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
