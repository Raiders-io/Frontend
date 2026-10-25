import { useBackground } from "@/services/user/user_queries"
import { cn } from "@/utils/lib/shadcn"
import type { PublicProfile } from "@/utils/types/user"

interface UserBackgroundProps {
  user?: PublicProfile
  className?: string
}

export const UserBackground = ({ user, className }: UserBackgroundProps) => {
  const { data: backgroundUrl } = useBackground(user?.id)

  if (!backgroundUrl) {
    return <div className={cn("bg-muted", className)} />
  }

  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      <img src={backgroundUrl} alt="User background" className="h-full w-full object-cover" />
    </div>
  )
}
