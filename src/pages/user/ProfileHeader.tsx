import { BookCheck, Flame, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditProfileDialog } from "./EditProfileDialog"
import { getDisplayName, getInitials } from "./utils"
import type { Me } from "@/utils/types/user"

interface Props {
  me: Me
  onUpdated: (me: Me) => void
}

export function ProfileHeader({ me, onUpdated }: Props) {
  const stats = [
    { label: "Série actuelle", value: me.currentStreak, icon: Flame },
    { label: "Meilleure série", value: me.longestStreak, icon: Trophy },
    { label: "Leçons terminées", value: me.lessonsCompletedCount, icon: BookCheck },
  ]

  return (
    <header className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <Avatar className="size-24">
          <AvatarImage src={me.avatarUrl ?? undefined} alt={me.username} />
          <AvatarFallback className="text-2xl font-medium">{getInitials(me)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {getDisplayName(me)}
              </h1>
              <p className="text-muted-foreground text-sm">@{me.username}</p>
            </div>
            <EditProfileDialog me={me} onSaved={onUpdated} />
          </div>
          {me.bio && <p className="max-w-prose text-sm leading-relaxed">{me.bio}</p>}
        </div>
      </div>

      <dl className="divide-border grid grid-cols-3 divide-x rounded-lg border">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex flex-col gap-1 p-4">
            <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Icon className="size-3.5" />
              {label}
            </dt>
            <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
