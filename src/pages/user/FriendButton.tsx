import { Check, Clock, UserCheck, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useDeclineFriendRequest,
  useRelationship,
  useRemoveFriend,
  useSendFriendRequest,
} from "@/services/user/user_queries"
import { UnfriendDialog } from "./UnfriendDialog"
import { getErrorMessage } from "./utils"

export function FriendButton({ userId, username }: { userId: string; username: string }) {
  const { data: relation, isPending } = useRelationship(userId)

  const send = useSendFriendRequest()
  const cancel = useCancelFriendRequest()
  const accept = useAcceptFriendRequest()
  const decline = useDeclineFriendRequest()
  const remove = useRemoveFriend()

  const mutations = [send, cancel, accept, decline, remove]
  const busy = mutations.some((m) => m.isPending)
  const failed = mutations.find((m) => m.isError)

  if (isPending || !relation) {
    return <Skeleton className="h-8 w-28" />
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        {relation === "none" && (
          <Button size="sm" disabled={busy} onClick={() => send.mutate(userId)}>
            <UserPlus />
            Ajouter
          </Button>
        )}

        {relation === "pending_sent" && (
          <>
            <Badge variant="secondary">
              <Clock />
              Demande envoyée
            </Badge>
            <Button variant="outline" size="sm" disabled={busy} onClick={() => cancel.mutate(userId)}>
              Annuler
            </Button>
          </>
        )}

        {relation === "pending_received" && (
          <>
            <Button size="sm" disabled={busy} onClick={() => accept.mutate(userId)}>
              <Check />
              Accepter
            </Button>
            <Button variant="outline" size="sm" disabled={busy} onClick={() => decline.mutate(userId)}>
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
              onConfirm={() => remove.mutate(userId)}
            />
          </>
        )}
      </div>
      {failed && (
        <p className="text-destructive text-xs">{getErrorMessage(failed.error, "Une erreur est survenue")}</p>
      )}
    </div>
  )
}
