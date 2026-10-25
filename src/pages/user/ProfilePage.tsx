import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import type { PrivateProfile } from "@/utils/types/user"
import { useProfile } from "@/services/user/user_queries"
import { ProfileHeader } from "./ProfileHeader"
import { MyLearning } from "./MyLearning"
import { CreatedContent } from "./CreatedContent"
import { FriendsPanel } from "../../components/user/FriendsPanel"
import { EditProfileDialog } from "./EditProfileDialog"
import { FriendButton } from "./FriendButton"
import { Biography } from "../../components/user/Biography"
import { getErrorMessage } from "./utils"
import { UserBackground } from "@/components/user/UserBackground"

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
  const isOwner = !userId
  const { data: user, error, isPending, refetch } = useProfile(userId)

  const errorMessage = error
    ? (error as any)?.response?.status === 404
      ? "This profile does not exist."
      : getErrorMessage(error, "Failed to load profile")
    : null

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Banner with improved fallback gradient */}
      <UserBackground
        user={user}
        className="absolute inset-x-0 top-0 -z-10 h-74 sm:h-78"
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        {errorMessage ? (
          <ProfileError message={errorMessage} onRetry={() => refetch()} />
        ) : isPending || !user ? (
          <ProfileSkeleton isOwner={isOwner} />
        ) : (
          <div className="space-y-10">
            <ProfileHeader
              user={user}
              actions={
                isOwner ? (
                  <EditProfileDialog me={user as PrivateProfile} />
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
