import { useCallback, useEffect, useState } from "react"
import type { PublicProfile, ReceivedFriendRequest, SentFriendRequest } from "@/utils/types/user"
import { userService } from "@/services/user_service"
import { getErrorMessage } from "./utils"

export interface Friendships {
  friends: PublicProfile[]
  received: ReceivedFriendRequest[]
  sent: SentFriendRequest[]
}

export type Relation = "none" | "friends" | "sent" | "received"

/** Il n'y a pas d'endpoint dédié : la relation avec `userId` se déduit des 3 listes. */
export function getRelation({ friends, received, sent }: Friendships, userId: string): Relation {
  if (friends.some((f) => f.id === userId)) return "friends"
  if (received.some((r) => r.user.id === userId)) return "received"
  if (sent.some((r) => r.friend.id === userId)) return "sent"
  return "none"
}

/** Source unique pour amis + demandes (utilisée par FriendsPanel et FriendButton). */
export function useFriendships() {
  const [data, setData] = useState<Friendships | null>(null)
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

  /** Exécute une action pour l'utilisateur `id` puis recharge les listes. */
  const run = useCallback(
    async (id: string, action: () => Promise<unknown>) => {
      setBusyId(id)
      setError(null)
      try {
        await action()
        await load()
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusyId(null)
      }
    },
    [load]
  )

  return { data, error, busyId, load, run }
}
