import { BookCheck, Flame, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { PublicProfile } from "@/utils/types/user"
import { getDisplayName } from "@/utils/lib/user"
import { UserAvatar } from "@/components/user/UserAvatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils/lib/shadcn"

interface Props {
  user: PublicProfile
  actions?: React.ReactNode
}

interface StatConfig {
  key: "currentStreak" | "longestStreak" | "lessonsCompletedCount"
  label: string
  icon: LucideIcon
  accent: string
}

const STATS: StatConfig[] = [
  {
    key: "currentStreak",
    label: "Série actuelle",
    icon: Flame,
    accent: "bg-orange-500/10 text-orange-500",
  },
  {
    key: "longestStreak",
    label: "Meilleure série",
    icon: Trophy,
    accent: "bg-amber-500/10 text-amber-500",
  },
  {
    key: "lessonsCompletedCount",
    label: "Leçons terminées",
    icon: BookCheck,
    accent: "bg-emerald-500/10 text-emerald-500",
  },
]

export function ProfileHeader({ user, actions }: Props) {
  const fullName = getDisplayName(user)

  return (
    <header>
      <Card className="gap-0 py-0">
        <CardContent className="p-5 sm:p-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <UserAvatar
              user={user}
              className="size-16 shrink-0 sm:size-24"
              fallbackClassName="text-2xl sm:text-4xl"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h1 className="min-w-0 truncate text-xl font-semibold tracking-tight sm:text-2xl">
                  @{user.username}
                </h1>
                {actions && (
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                  </div>
                )}
              </div>
              {fullName && (
                <p className="text-muted-foreground mt-1 truncate text-sm">
                  {fullName}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <Separator />

        <dl className="grid grid-cols-3 divide-x">
          {STATS.map(({ key, label, icon: Icon, accent }) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center gap-2 px-3 py-4 text-center sm:flex-row sm:gap-3 sm:px-6"
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10",
                  accent
                )}
              >
                <Icon className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0 text-center sm:text-left">
                <dd className="text-xl leading-none font-semibold tabular-nums sm:text-2xl">
                  {user[key]}
                </dd>
                <dt className="text-muted-foreground mt-1 truncate text-xs">
                  {label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </Card>
    </header>
  )
}