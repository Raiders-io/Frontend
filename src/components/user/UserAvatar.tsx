import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/utils/lib/shadcn";
import { avatarColor, getInitials } from "@/utils/lib/user"
import type { PublicProfile } from "@/utils/types/user"

interface UserAvatarProps {
  user: PublicProfile
  className?: string
  fallbackClassName?: string
}

export const UserAvatar = ({ user, className, fallbackClassName }: UserAvatarProps) => (
  <Avatar className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}>
    <AvatarImage
      src={user.avatarUrl ?? undefined}
      alt={user.username}
      className="aspect-square h-full w-full object-cover"
    />
    <AvatarFallback
      className={cn(
        "flex h-full w-full items-center justify-center text-2xl font-medium",
        avatarColor(user.id),
        fallbackClassName,
      )}
    >
      {getInitials(user)}
    </AvatarFallback>
  </Avatar>
)