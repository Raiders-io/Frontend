import { useEffect, useState } from "react"
import { BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "./ProfileHeader"
import { LessonsTab } from "./LessonsTab"
import { FriendsTab } from "./FriendsTab"
import { getErrorMessage } from "./utils"
import type { Me } from "@/utils/types/user"
import { userService } from "@/services/user_service"

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <Skeleton className="size-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    userService
      .fetchMe()
      .then((data) => !cancelled && setMe(data))
      .catch((e) => !cancelled && setError(getErrorMessage(e, "Impossible de charger le profil")))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = () => {
    setError(null)
    setAttempt((n) => n + 1)
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      {error ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={retry}>
            Réessayer
          </Button>
        </div>
      ) : !me ? (
        <ProfileSkeleton />
      ) : (
        <div className="space-y-10">
          <ProfileHeader me={me} onUpdated={setMe} />

          <Tabs defaultValue="lessons">
            <TabsList>
              <TabsTrigger value="lessons">
                <BookOpen className="size-4" />
                Leçons
              </TabsTrigger>
              <TabsTrigger value="friends">
                <Users className="size-4" />
                Amis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="lessons" className="pt-4">
              <LessonsTab />
            </TabsContent>
            <TabsContent value="friends" className="pt-4">
              <FriendsTab />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </main>
  )
}
