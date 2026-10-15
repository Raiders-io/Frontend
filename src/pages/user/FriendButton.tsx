import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { userService } from "@/services/user_service"
import { getRelation, useFriendships } from "./useFriendships"
import { UnfriendDialog } from "./UnfriendDialog"

export function FriendButton({ userId, username }: { userId: string; username: string }) {
  const { data, error, busyId, run } = useFriendships()

  if (!data) return error ? null : <Skeleton className="h-8 w-28" />

  const relation = getRelation(data, userId)
  const busy = busyId === userId
  const act = (action: () => Promise<unknown>) => run(userId, action)

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        {relation === "none" && (
          <Button size="sm" disabled={busy} onClick={() => act(() => userService.sendFriendRequest(userId))}>
            <UserPlus />
            Ajouter
          </Button>
        )}

        {relation === "sent" && (
          <>
            <Badge variant="secondary">
              <Clock />
              Demande envoyée
            </Badge>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => act(() => userService.cancelFriendRequest(userId))}
            >
              Annuler
            </Button>
          </>
        )}

        {relation === "received" && (
          <>
            <Button size="sm" disabled={busy} onClick={() => act(() => userService.acceptFriendRequest(userId))}>
              <Check />
              Accepter
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => act(() => userService.declineFriendRequest(userId))}
            >
              <X />
              Refuser
            </Button>
          </>
        )}

        {relation === "friends" && (
          <>
            <Badge variant="secondary">
              <UserCheck />
              Amis
            </Badge>
            <UnfriendDialog
              username={username}
              disabled={busy}
              onConfirm={() => act(() => userService.unfriend(userId))}
            />
          </>
        )}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
