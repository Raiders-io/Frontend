import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAvatar } from "@/services/user/user_queries" // Ajustez le chemin selon votre structure de fichiers
import { cn } from "@/utils/lib/shadcn";
import { avatarColor, getInitials } from "@/utils/lib/user"
import type { PublicProfile } from "@/utils/types/user"

type UserAvatarProps = {
  user: PublicProfile
  className?: string
  fallbackClassName?: string
  src?: string | null
}

export const UserAvatar = ({ user, className, fallbackClassName, src }: UserAvatarProps) => {
  const { data: avatarUrl } = useAvatar(src ? undefined : user?.id, user?.avatarUpdatedAt)

  return (
    <Avatar className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}>
      <AvatarImage
        src={src ?? avatarUrl}
        alt={user.username}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarFallback
        className={cn(
          "flex h-full w-full items-center justify-center text-2xl font-medium text-mist-50",
          avatarColor(user.id),
          fallbackClassName,
        )}
      >
        {getInitials(user)}
      </AvatarFallback>
    </Avatar>
  )
}
