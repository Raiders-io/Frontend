import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import type { PrivateProfile, PublicProfile } from "@/utils/types/user"
import { userService } from "@/services/user_service"
import { ProfileHeader } from "./ProfileHeader"
import { MyLearning } from "./MyLearning"
import { CreatedContent } from "./CreatedContent"
import { FriendsPanel } from "../../components/user/FriendsPanel"
import { EditProfileDialog } from "./EditProfileDialog"
import { FriendButton } from "./FriendButton"
import { Biography } from "../../components/user/Biography"
import { getErrorMessage } from "./utils"

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
        setError(notFound ? "This profile does not exist." : getErrorMessage(e, "Failed to load profile"))
      })
    return () => {
      cancelled = true
    }
  }, [identifier, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { user, setUser, isOwner, error, retry }
}

const OWNER_GRID = "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]"

function ProfileSkeleton({ isOwner }: { isOwner: boolean }) {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading profile">
      <div className="flex items-center gap-6">
        <Skeleton className="size-24 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
        {isOwner && <Skeleton className="h-9 w-24 rounded-md" />}
      </div>

      <div className={isOwner ? OWNER_GRID : undefined}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
        {isOwner && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{message}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default function ProfilePage({ userId }: { userId?: string }) {
  const { user, setUser, isOwner, error, retry } = useProfile(userId)

  const backgroundUrl = user ? userService.getBackground(user.id) : undefined

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Banner with improved fallback gradient */}
      <div 
        className="absolute inset-x-0 top-0 -z-10 h-64 w-full bg-cover bg-center border-b bg-linear-to-r from-primary/15 via-muted to-primary/15"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
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
                ) : (
                  <FriendButton userId={user.id} username={user.username} />
                )
              }
            />

            {isOwner ? (
              <div className={OWNER_GRID}>
                <div className="space-y-8">
                  <Biography bio={user.bio ?? ""} />
                  <MyLearning />
                  <CreatedContent userId={user.id} />
                </div>
                <aside aria-label="Friends">
                  <FriendsPanel />
                </aside>
              </div>
            ) : (
              <div className="space-y-8">
                <Biography bio={user.bio ?? ""} />
                <CreatedContent userId={user.id} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export function PublicProfilePage() {
  const { identifier } = useParams<{ identifier: string }>()
  return <ProfilePage userId={identifier} />
}
