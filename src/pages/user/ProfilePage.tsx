import { useCallback, useEffect, useState, type ComponentType } from "react"
import { BookOpen, Users, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "./ProfileHeader"
import { LessonsTab } from "./LessonsTab"
import { FriendsTab } from "./FriendsTab"
import { EditProfileDialog } from "./EditProfileDialog"
import { getErrorMessage } from "./utils"
import type { PrivateProfile, Profile, PublicProfile } from "@/utils/types/user"
import { userService } from "@/services/user_service"
import { useParams } from "react-router-dom"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/** Props reçues par chaque onglet : même composant en privé et en public. */
export type ProfileTabProps = {
  user: Profile
  isOwner: boolean
}

type ProfileTabDef = {
  value: string
  label: string
  icon: LucideIcon
  component: ComponentType<ProfileTabProps>
  /** Masqué sur le profil public. */
  ownerOnly?: boolean
}

/* -------------------------------------------------------------------------- */
/* Config des onglets : pour en ajouter un, ajouter une entrée ici.           */
/* -------------------------------------------------------------------------- */

const PROFILE_TABS: ProfileTabDef[] = [
  { value: "lessons", label: "Leçons", icon: BookOpen, component: LessonsTab },
  { value: "friends", label: "Amis", icon: Users, component: FriendsTab },
]

const visibleTabs = (isOwner: boolean) =>
  PROFILE_TABS.filter((t) => isOwner || !t.ownerOnly)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function fetchProfile(identifier?: string) {
  if (!identifier) return userService.fetchMe()
  return UUID_RE.test(identifier)
    ? userService.fetchUser(identifier)
    : userService.fetchByUsername(identifier)
}

function useProfile(identifier?: string) {
  const isOwner = !identifier
  const [user, setUser] = useState<PublicProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setUser(null)
    setError(null)

    fetchProfile(identifier)
      .then((data) => !cancelled && setUser(data))
      .catch((e) => {
        if (cancelled) return
        const notFound = e?.response?.status === 404
        setError(
          notFound
            ? "Ce profil n'existe pas."
            : getErrorMessage(e, "Impossible de charger le profil"),
        )
      })
    return () => {
      cancelled = true
    }
  }, [identifier, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { user, setUser, isOwner, error, retry }
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function ProfileSkeleton({ isOwner }: { isOwner: boolean }) {
  const tabs = visibleTabs(isOwner)

  return (
    <div className="space-y-10" aria-busy="true" aria-label="Chargement du profil">
      <div className="flex items-center gap-6">
        <Skeleton className="size-24 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
        {isOwner && <Skeleton className="h-9 w-24 rounded-md" />}
      </div>

      <div className="flex gap-8">
        <div className="flex w-auto shrink-0 flex-col gap-1 sm:w-44">
          {tabs.map((tab) => (
            <Skeleton key={tab.value} className="h-9 w-10 rounded-md sm:w-full" />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Erreur                                                                     */
/* -------------------------------------------------------------------------- */

function ProfileError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="text-muted-foreground text-sm">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Tabs verticaux                                                             */
/* -------------------------------------------------------------------------- */

function ProfileTabs({ user, isOwner }: ProfileTabProps) {
  const tabs = visibleTabs(isOwner)

  return (
    <Tabs
      defaultValue={tabs[0].value}
      orientation="vertical"
      className="flex-row items-start gap-8"
    >
      <TabsList
        variant="line"
        className="h-auto w-auto shrink-0 flex-col items-stretch justify-start gap-1 sm:w-44"
      >
        {tabs.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            aria-label={label}
            className="justify-start gap-2 px-3 py-2"
          >
            <Icon className="size-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, component: Content }) => (
        <TabsContent key={value} value={value} className="min-w-0 flex-1">
          <Content user={user} isOwner={isOwner} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ProfilePage({ userId }: { userId?: string }) {
  const { user, setUser, isOwner, error, retry } = useProfile(userId)

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      {error ? (
        <ProfileError message={error} onRetry={retry} />
      ) : !user ? (
        <ProfileSkeleton isOwner={isOwner} />
      ) : (
        <div className="space-y-10">
          <ProfileHeader
            user={user}
            actions={
              isOwner ? (
                <EditProfileDialog me={user as PrivateProfile} onSaved={setUser} />
              ) : undefined
            }
          />
          <ProfileTabs user={user} isOwner={isOwner} />
        </div>
      )}
    </main>
  )
}

export function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  return <ProfilePage userId={id} />
}
