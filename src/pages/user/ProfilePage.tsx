import type { ComponentProps } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import type { PrivateProfile } from "@/utils/types/user"
import { useProfile } from "@/services/user/user_queries"
import { UserBackground } from "@/components/user/UserBackground"
import { changePageLogin } from "@/utils/router/changePage"
import { useAuthStore } from "@/utils/stores/auth_store"
import { ProfileHeader } from "./ProfileHeader"
import { MyLearning } from "./MyLearning"
import { CreatedContent } from "./CreatedContent"
import { FriendsPanel } from "../../components/user/FriendsPanel"
import { EditProfileDialog } from "./EditProfileDialog"
import { FriendButton } from "./FriendButton"
import { Biography } from "../../components/user/Biography"
import { getErrorMessage } from "./utils"
import NotFound from "../NotFound"

type ProfileMode = "owner" | "visitor" | "guest"

const OWNER_GRID = "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]"

function getMode(
  userId: string | undefined,
  isAuthenticated: boolean,
): ProfileMode {
  if (!isAuthenticated) return "guest"
  return userId ? "visitor" : "owner"
}

function LoginButton({ label = "Log in" }: { label?: string }) {
  return (
    <Button size="sm" onClick={() => changePageLogin()}>
      {label}
    </Button>
  )
}

function ProfileBackground({
  user,
  isLoading,
}: {
  user?: ComponentProps<typeof UserBackground>["user"]
  isLoading: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-74 overflow-hidden sm:h-78 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
    >
      {user ? (
        <UserBackground
          user={user}
          className="absolute inset-0 size-full object-cover animate-in fade-in duration-500"
        />
      ) : (
        // Statique (pas de pulse) : le skeleton du contenu indique déjà le chargement
        <div
          className={
            isLoading
              ? "absolute inset-0 bg-muted"
              : "absolute inset-0 bg-gradient-to-b from-muted/60 to-transparent"
          }
        />
      )}
    </div>
  )
}

function SectionSkeleton({
  cards = 2,
  cardClassName = "h-28",
}: {
  cards?: number
  cardClassName?: string
}) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-36" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: cards }).map((_, i) => (
          <Skeleton key={i} className={`w-full rounded-lg ${cardClassName}`} />
        ))}
      </div>
    </div>
  )
}

function BioSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-28" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

function FriendsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-24" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileSkeleton({ mode }: { mode: ProfileMode }) {
  const isOwner = mode === "owner"

  return (
    <div
      className="space-y-10"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading profile…</span>

      {/* Header : avatar + nom + action (présente dans les 3 modes) */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <Skeleton className="size-24 shrink-0 rounded-full" />
        <div className="w-full flex-1 space-y-2">
          <Skeleton className="mx-auto h-7 w-48 sm:mx-0" />
          <Skeleton className="mx-auto h-4 w-28 sm:mx-0" />
        </div>
        <Skeleton
          className={`h-9 shrink-0 rounded-md ${
            mode === "guest" ? "w-40" : "w-24"
          }`}
        />
      </div>

      {/* Corps : même structure que le rendu final */}
      {isOwner ? (
        <div className={OWNER_GRID}>
          <div className="space-y-8">
            <BioSkeleton />
            <SectionSkeleton cards={2} />
            <SectionSkeleton cards={4} cardClassName="h-36" />
          </div>
          <FriendsSkeleton />
        </div>
      ) : (
        <div className="space-y-8">
          <BioSkeleton />
          <SectionSkeleton cards={4} cardClassName="h-36" />
        </div>
      )}
    </div>
  )
}

function ProfileError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
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

function LoginRequired() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>You need to be logged in to see your profile.</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <LoginButton />
      </EmptyContent>
    </Empty>
  )
}

function ProfileContent({
  userId,
  mode,
}: {
  userId?: string
  mode: ProfileMode
}) {
  const { data: user, error, isPending, refetch } = useProfile(userId)

  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return (
      <NotFound
        title="Profile not found"
        description="This profile does not exist."
      />
    )
  }

  const errorMessage = error
    ? getErrorMessage(error, "Failed to load profile")
    : null

  const renderActions = () => {
    if (!user) return null
    switch (mode) {
      case "owner":
        return <EditProfileDialog me={user as PrivateProfile} />
      case "visitor":
        return <FriendButton userId={user.id} username={user.username} />
      case "guest":
        return <LoginButton label="Log in to add friend" />
    }
  }

  return (
    // `isolate` crée un stacking context : le -z-10 du fond reste
    // derrière le contenu sans passer derrière le body/layout parent.
    <div className="relative isolate min-h-dvh w-full">
      <ProfileBackground user={user} isLoading={isPending && !error} />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        {errorMessage ? (
          <ProfileError message={errorMessage} onRetry={() => refetch()} />
        ) : isPending || !user ? (
          <ProfileSkeleton mode={mode} />
        ) : (
          <div className="space-y-10">
            <ProfileHeader user={user} actions={renderActions()} />

            {mode === "owner" ? (
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

export default function ProfilePage({ userId }: { userId?: string }) {
  const isAuthenticated = useAuthStore((s) => Boolean(s.user?.id))
  const mode = getMode(userId, isAuthenticated)

  if (mode === "guest" && !userId) return <LoginRequired />

  return <ProfileContent userId={userId} mode={mode} />
}

export function PublicProfilePage() {
  const { identifier } = useParams<{ identifier: string }>()
  return <ProfilePage userId={identifier} />
}