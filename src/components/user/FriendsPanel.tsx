import type { ReactNode } from "react"
import { Check, Clock, MessageCircle, Users, X } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

import { UserAvatar } from "@/components/user/UserAvatar"
import { UserAvatarButton } from "@/components/user/UserAvatarButton"

import type { PublicProfile } from "@/utils/types/user"
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useDeclineFriendRequest,
  useFriendships,
  useRemoveFriend,
} from "@/services/user/user_queries"

import { IconAction } from "../homemade/IconAction"
import { SectionCard } from "./SectionCard"
import { UnfriendDialog } from "../../pages/user/UnfriendDialog"
import { getErrorMessage } from "../../pages/user/utils"
import { changePageUser } from "@/utils/router/changePage"

interface FriendsPanelProps {
  onMessage?: (friend: PublicProfile) => void
}

function PersonItem({
  user,
  children,
}: {
  user: PublicProfile
  children?: ReactNode
}) {
  return (
    <Item size="sm">
      <ItemMedia>
        <UserAvatarButton
          label={`View ${user.username}'s profile`}
          className="size-10"
          onClick={() => changePageUser(user.id)}
        >
          <UserAvatar user={user} className="size-10" />
        </UserAvatarButton>
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{user.username}</ItemTitle>
        <ItemDescription className="mt-0!">
          @{user.username}
        </ItemDescription>
      </ItemContent>

      {children && <ItemActions>{children}</ItemActions>}
    </Item>
  )
}

export function FriendsPanel({ onMessage }: FriendsPanelProps) {
  const { data, error: loadError, refetch } = useFriendships()

  const accept = useAcceptFriendRequest()
  const decline = useDeclineFriendRequest()
  const cancel = useCancelFriendRequest()
  const remove = useRemoveFriend()

  const mutations = [accept, decline, cancel, remove]
  const isBusy = (userId: string) =>
    mutations.some((m) => m.isPending && m.variables === userId)

  const failedMutation = mutations.find((m) => m.isError)
  const error = loadError
    ? getErrorMessage(loadError, "Impossible de charger les amis")
    : failedMutation
      ? getErrorMessage(failedMutation.error, "Une erreur est survenue")
      : null

  if (!data) {
    return (
      <SectionCard title="Amis">
        {error ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>Chargement impossible</EmptyTitle>
              <EmptyDescription>{error}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={() => void refetch()}>
                Réessayer
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}
      </SectionCard>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data.received.length > 0 && (
        <SectionCard title="Demandes reçues" count={data.received.length}>
          <ItemGroup className="divide-y">
            {data.received.map((req) => (
              <PersonItem key={req.id} user={req.user}>
                <Button
                  size="sm"
                  disabled={isBusy(req.user.id)}
                  onClick={() => accept.mutate(req.user.id)}
                >
                  <Check />
                  Accepter
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isBusy(req.user.id)}
                  onClick={() => decline.mutate(req.user.id)}
                >
                  <X />
                  Refuser
                </Button>
              </PersonItem>
            ))}
          </ItemGroup>
        </SectionCard>
      )}

      <SectionCard title="Amis" count={data.friends.length}>
        {data.friends.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>Aucun ami pour le moment</EmptyTitle>
              <EmptyDescription>
                Recherchez un utilisateur pour lui envoyer une demande.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="divide-y">
            {data.friends.map((friend) => (
              <PersonItem key={friend.id} user={friend}>
                <IconAction
                  icon={MessageCircle}
                  label={`Écrire à ${friend.username}`}
                  tooltip={
                    onMessage
                      ? "Envoyer un message"
                      : "Messagerie bientôt disponible"
                  }
                  disabled={!onMessage}
                  onClick={() => onMessage?.(friend)}
                />

                <UnfriendDialog
                  username={friend.username}
                  disabled={isBusy(friend.id)}
                  onConfirm={() => remove.mutate(friend.id)}
                />
              </PersonItem>
            ))}
          </ItemGroup>
        )}
      </SectionCard>

      {data.sent.length > 0 && (
        <SectionCard title="Demandes envoyées" count={data.sent.length}>
          <ItemGroup className="divide-y">
            {data.sent.map((req) => (
              <PersonItem key={req.id} user={req.friend}>
                <Badge variant="secondary">
                  <Clock />
                  En attente
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isBusy(req.friend.id)}
                  onClick={() => cancel.mutate(req.friend.id)}
                >
                  Annuler
                </Button>
              </PersonItem>
            ))}
          </ItemGroup>
        </SectionCard>
      )}
    </div>
  )
}
