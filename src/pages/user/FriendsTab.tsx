import { useCallback, useEffect, useState, type ReactNode } from "react"
import { Check, UserMinus, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ReceivedFriendRequest, SentFriendRequest, UserModel } from "@/utils/types/user"
import { userService } from "@/services/user_service"
import { getInitials, getDisplayName } from "@/utils/lib/user"
import { getErrorMessage } from "./utils"

interface Data {
  friends: UserModel[]
  received: ReceivedFriendRequest[]
  sent: SentFriendRequest[]
}

function UserRow({ user, children }: { user: UserModel; children?: ReactNode }) {
  const person = { firstname: user.firstname, lastname: user.lastname, username: user.username }
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Avatar className="size-9">
        <AvatarImage src={user.avatar_url ?? undefined} alt={user.username} />
        <AvatarFallback className="text-xs">{getInitials(person)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{getDisplayName(person)}</p>
        <p className="text-muted-foreground truncate text-xs">@{user.username}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </li>
  )
}

function List({ empty, children }: { empty: string; children: ReactNode[] }) {
  if (children.length === 0) {
    return <p className="text-muted-foreground py-10 text-center text-sm">{empty}</p>
  }
  return <ul className="divide-border divide-y rounded-lg border">{children}</ul>
}

export function FriendsTab() {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [friends, received, sent] = await Promise.all([
        userService.fetchFriends(),
        userService.fetchReceivedRequests(),
        userService.fetchSentRequests(),
      ])
      setData({ friends, received, sent })
      setError(null)
    } catch (e) {
      setError(getErrorMessage(e, "Impossible de charger les amis"))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id)
    try {
      await action()
      await load()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusyId(null)
    }
  }

  if (!data) {
    return error ? (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          Réessayer
        </Button>
      </div>
    ) : (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-destructive text-sm">{error}</p>}

      <Tabs defaultValue="friends">
        <TabsList variant="line">
          <TabsTrigger value="friends">Amis ({data.friends.length})</TabsTrigger>
          <TabsTrigger value="received">
            Reçues
            {data.received.length > 0 && <Badge className="ml-1.5">{data.received.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="sent">Envoyées</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="pt-3">
          <List empty="Vous n'avez pas encore d'amis.">
            {data.friends.map((friend) => (
              <UserRow key={friend.id} user={friend}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Retirer ${friend.username}`}
                  disabled={busyId === friend.id}
                  onClick={() => run(friend.id, () => userService.unfriend(friend.id))}
                >
                  <UserMinus className="size-4" />
                </Button>
              </UserRow>
            ))}
          </List>
        </TabsContent>

        <TabsContent value="received" className="pt-3">
          <List empty="Aucune demande reçue.">
            {data.received.map((req) => (
              <UserRow key={req.id} user={req.user}>
                <Button
                  size="sm"
                  disabled={busyId === req.user.id}
                  onClick={() => run(req.user.id, () => userService.acceptFriendRequest(req.user.id))}
                >
                  <Check className="size-3.5" />
                  Accepter
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Refuser"
                  disabled={busyId === req.user.id}
                  onClick={() => run(req.user.id, () => userService.declineFriendRequest(req.user.id))}
                >
                  <X className="size-4" />
                </Button>
              </UserRow>
            ))}
          </List>
        </TabsContent>

        <TabsContent value="sent" className="pt-3">
          <List empty="Aucune demande en attente.">
            {data.sent.map((req) => (
              <UserRow key={req.id} user={req.friend}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busyId === req.friend.id}
                  onClick={() => run(req.friend.id, () => userService.cancelFriendRequest(req.friend.id))}
                >
                  Annuler
                </Button>
              </UserRow>
            ))}
          </List>
        </TabsContent>
      </Tabs>
    </div>
  )
}
