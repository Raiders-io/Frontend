import { useBackground } from "@/services/user/user_queries"
import { cn } from "@/utils/lib/shadcn"
import type { PublicProfile } from "@/utils/types/user"

interface UserBackgroundProps {
  user?: PublicProfile
  className?: string
  src?: string | null
}

export const UserBackground = ({ user, className, src }: UserBackgroundProps) => {
  const { data: backgroundUrl } = useBackground(src ? undefined : user?.id, user?.backgroundUpdatedAt)

  const url = src ?? backgroundUrl

  if (!url) {
    return <div className={cn("bg-muted", className)} />
  }

  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      <img src={url} alt="User background" className="h-full w-full object-cover" />
    </div>
  )
}