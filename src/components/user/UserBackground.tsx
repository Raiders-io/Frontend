import { useBackground } from "@/services/user/user_queries"
import { cn } from "@/utils/lib/shadcn"

interface UserBackgroundProps {
  userId?: string
  className?: string
}

export const UserBackground = ({ userId, className }: UserBackgroundProps) => {
  const { data: backgroundUrl } = useBackground(userId)

  if (!backgroundUrl) {
    return <div className={cn("bg-muted", className)} />
  }

  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      <img src={backgroundUrl} alt="User background" className="h-full w-full object-cover" />
    </div>
  )
}
