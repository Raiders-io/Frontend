import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/utils/stores/auth_store"
import { avatarColor, initials } from "@/utils/lib/avatar"

export const UserAvatar = () => {
  const { user } = useAuthStore()
  return (
    <Avatar>
      <AvatarImage
        src="https://github.com/iDarkAxe.png"
        alt={`Avatar Image of ${user?.fullName}`}
      />
      <AvatarFallback
        className={`text-white items-center ${avatarColor(user?.fullName ?? "")}`}
      >
        {initials(user?.fullName ?? "?")}
      </AvatarFallback>
    </Avatar>
  )
}
