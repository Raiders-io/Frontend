import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { avatarColor, getInitials } from "@/utils/lib/user"
import type { PublicUser } from "@/utils/types/user"

interface UserAvatarProps {
  user: PublicUser
}

export const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Avatar className="size-24">
      <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
      <AvatarFallback className={`text-2xl font-medium ${avatarColor(user.id)}`}>
        {getInitials(user)}
      </AvatarFallback>
    </Avatar>
  )
}