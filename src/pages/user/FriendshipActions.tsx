import { useCallback, useEffect, useState } from "react"
import { Check, Clock, UserCheck, UserMinus, UserPlus, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { userService } from "@/services/user_service"
import { getErrorMessage } from "./utils"

type Relation = "loading" | "error" | "none" | "friends" | "sent" | "received"

/**
 * Relation d'amitié entre moi et `userId`, avec les actions possibles.
 * Il n'y a pas d'endpoint dédié : on la déduit des 3 listes (amis, reçues, envoyées).
 */
export function FriendshipActions({ userId, username }: { userId: string; username: string }) {
  const [relation, setRelation] = useState<Relation>("loading")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [friends, received, sent] = await Promise.all([
        userService.fetchFriends(),
        userService.fetchReceivedRequests(),
        userService.fetchSentRequests(),
      ])
      if (friends.some((f) => f.id === userId)) setRelation("friends")
      else if (received.some((r) => r.user.id === userId)) setRelation("received")
      else if (sent.some((r) => r.friend.id === userId)) setRelation("sent")
      else setRelation("none")
    } catch (e) {
      setError(getErrorMessage(e, "Impossible de charger la relation"))
      setRelation("error")
    }
  }, [userId])

  useEffect(() => {
    setRelation("loading")
    setError(null)
    void load()
  }, [load])

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true)
    setError(null)
    try {
      await action()
      await load()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  if (relation === "loading") return <Skeleton className="h-8 w-28" />

  if (relation === "error") {
    return (
      <Button variant="outline" size="sm" onClick={() => void load()}>
        Réessayer
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        {relation === "none" && (
          <Button size="sm" disabled={busy} onClick={() => run(() => userService.sendFriendRequest(userId))}>
            <UserPlus className="size-3.5" />
            Ajouter
          </Button>
        )}

        {relation === "sent" && (
          <>
            <Badge variant="secondary">
              <Clock className="size-3" />
              Demande envoyée
            </Badge>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => run(() => userService.cancelFriendRequest(userId))}
            >
              Annuler
            </Button>
          </>
        )}

        {relation === "received" && (
          <>
            <Button size="sm" disabled={busy} onClick={() => run(() => userService.acceptFriendRequest(userId))}>
              <Check className="size-3.5" />
              Accepter
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => run(() => userService.declineFriendRequest(userId))}
            >
              <X className="size-3.5" />
              Refuser
            </Button>
          </>
        )}

        {relation === "friends" && (
          <>
            <Badge variant="secondary">
              <UserCheck className="size-3" />
              Amis
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Retirer ${username}`} disabled={busy}>
                  <UserMinus className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Retirer cet ami ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    @{username} sera retiré de votre liste d'amis.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">Annuler</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={() => run(() => userService.unfriend(userId))}>
                    Retirer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
