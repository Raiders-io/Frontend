import type { Paginated, PaginationParams } from "@/utils/types/common"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query"
import { userService } from "./user_service"
import type { PrivateProfile, PublicProfile, RelationshipStatus, UpdateMePayload } from "@/utils/types/user"
import { useAuthStore } from "@/utils/stores/auth_store"

export const userKeys = {
  all: ["user"] as const,

  me: () => [...userKeys.all, "me"] as const,

  profiles: () => [...userKeys.all, "profile"] as const,
  profile: (identifier: string) => [...userKeys.profiles(), identifier] as const,

  avatar: (identifier?: string) => 
    identifier === undefined ? [...userKeys.me(), "avatar"] as const : [...userKeys.profile(identifier), "avatar"] as const,
  background: (identifier?: string) => 
    identifier === undefined ? [...userKeys.me(), "background"] as const : [...userKeys.profile(identifier), "background"] as const,

  friendships: () => [...userKeys.all, "friendships"] as const,
  relationship: (userId: string) => [...userKeys.all, "relationship", userId] as const,

  search: (query: string) => [...userKeys.all, "search", query] as const,

  list: (name: string, scope: string, params?: PaginationParams) =>
    [...userKeys.all, "list", name, scope, params ?? {}] as const,
}

export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateMePayload) => userService.updateMe(payload),
    onSuccess: (me: PrivateProfile) => {
      qc.setQueryData(userKeys.me(), me)
      qc.invalidateQueries({ queryKey: userKeys.profiles() })
      qc.invalidateQueries({ queryKey: userKeys.avatar() })
      qc.invalidateQueries({ queryKey: userKeys.background() })
    },
  })
}

export function useAvatar(identifier?: string) {
  return useQuery({
    queryKey: userKeys.avatar(identifier),
    queryFn: () => userService.fetchAvatar(identifier),
    staleTime: 1000 * 60 * 10, 
  })
}

export function useBackground(identifier?: string) {
  return useQuery({
    queryKey: userKeys.background(identifier),
    queryFn: () => userService.fetchBackground(identifier),
    staleTime: 1000 * 60 * 10,
  })
}

function useFriendMutation(action: (userId: string) => Promise<unknown>, next?: RelationshipStatus) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: action,
    onMutate: async (userId: string) => {
      if (!next) return undefined
      await qc.cancelQueries({ queryKey: userKeys.relationship(userId) })
      const previous = qc.getQueryData<RelationshipStatus>(userKeys.relationship(userId))
      qc.setQueryData(userKeys.relationship(userId), next)
      return { previous }
    },
    onError: (_err, userId, ctx) => {
      if (ctx?.previous) qc.setQueryData(userKeys.relationship(userId), ctx.previous)
    },
    onSettled: (_data, _err, userId) => {
      qc.invalidateQueries({ queryKey: userKeys.relationship(userId) })
      qc.invalidateQueries({ queryKey: userKeys.friendships() })
    },
  })
}

export const useSendFriendRequest = () =>
  useFriendMutation((id) => userService.sendFriendRequest(id), "pending_sent")
export const useAcceptFriendRequest = () =>
  useFriendMutation((id) => userService.acceptFriendRequest(id), "friends")
export const useDeclineFriendRequest = () =>
  useFriendMutation((id) => userService.declineFriendRequest(id), "none")
export const useCancelFriendRequest = () =>
  useFriendMutation((id) => userService.cancelFriendRequest(id), "none")
export const useRemoveFriend = () =>
  useFriendMutation((id) => userService.unfriend(id), "none")

export function useMe() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userService.fetchMe(),
    enabled: !!token,
  })
}

export function useProfile(identifier?: string) {
  return useQuery<PublicProfile>({
    queryKey: identifier === undefined ? userKeys.me() : userKeys.profile(identifier),
    queryFn: () =>
      identifier === undefined ? userService.fetchMe() : userService.fetchProfile(identifier),
  })
}

export function useFriendships() {
  return useQuery({
    queryKey: userKeys.friendships(),
    queryFn: async () => {
      const [friends, received, sent] = await Promise.all([
        userService.fetchFriends(),
        userService.fetchReceivedRequests(),
        userService.fetchSentRequests(),
      ])
      return { friends, received, sent }
    },
  })
}

export function useRelationship(userId: string, enabled = true) {
  return useQuery({
    queryKey: userKeys.relationship(userId),
    queryFn: () => userService.fetchRelationshipStatus(userId),
    enabled,
  })
}

export function usePaginatedList<T>(
  key: QueryKey,
  fetcher: (params: PaginationParams) => Promise<Paginated<T>>,
  page: number,
  limit = 10,
) {
  return useQuery({
    queryKey: [...key, { page, limit }],
    queryFn: () => fetcher({ page, limit }),
    placeholderData: keepPreviousData,
  })
}
