import api from "@/utils/lib/axios"
import type { PaginationParams, Paginated } from "@/utils/types/common"
import type {
  CreatedExam,
  CreatedLesson,
  Friendship,
  LessonCompleted,
  LessonOngoing,
  LessonStatus,
  PrivateProfile,
  PublicProfile,
  ReceivedFriendRequest,
  RelationshipStatus,
  SentFriendRequest,
  UpdateMePayload,
  UserSearchResult } from "@/utils/types/user"

const PROFILE = "/api/v1/profile"
const ME = `${PROFILE}/me`
const FRIENDS = `${ME}/friends`
const LESSONS = `${ME}/lessons`

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const userService = {
  fetchMe: async (): Promise<PrivateProfile> => {
    const { data } = await api.get<PrivateProfile>(ME)
    return data
  },

  async updateMe(payload: UpdateMePayload) {
    const form = new FormData()

    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue
      if (value === null) form.append(key, "")
      else form.append(key, value)
    }

    const { data } = await api.patch(ME, form)
    return data
  },

  fetchUserById: async (id: string): Promise<PublicProfile> => {
    const { data } = await api.get<PublicProfile>(`${PROFILE}/${id}`)
    return data
  },

  fetchUserByUsername: async (username: string) => {
    const { data } = await api.get<PublicProfile>(`${PROFILE}/u/${encodeURIComponent(username)}`)
    return data
  },

  fetchProfile: (identifier?: string) => {
    if (!identifier) return userService.fetchMe()
    return UUID_RE.test(identifier)
      ? userService.fetchUserById(identifier)
      : userService.fetchUserByUsername(identifier)
  },

  getAvatar: (id: string): string => `${api.defaults.baseURL ?? ""}${PROFILE}/${id}/avatar`,
  getBackground: (id: string): string => `${api.defaults.baseURL ?? ""}${PROFILE}/${id}/background`,

  searchUsers: async (
    q: string,
    { page, limit }: PaginationParams = {}
  ): Promise<Paginated<UserSearchResult>> => {
    const { data } = await api.get<Paginated<UserSearchResult>>(`${PROFILE}/search`, {
      params: { q, page, limit },
    })
    return data
  },

  fetchRelationshipStatus: async (friendId: string): Promise<RelationshipStatus> => {
    const { data } = await api.get<RelationshipStatus>(`${FRIENDS}/${friendId}`)
    return data
  },

  fetchFriends: async (): Promise<PublicProfile[]> => {
    const { data } = await api.get<PublicProfile[]>(FRIENDS)
    return data
  },

  fetchReceivedRequests: async (): Promise<ReceivedFriendRequest[]> => {
    const { data } = await api.get<ReceivedFriendRequest[]>(`${FRIENDS}/requests`)
    return data
  },

  fetchSentRequests: async (): Promise<SentFriendRequest[]> => {
    const { data } = await api.get<SentFriendRequest[]>(`${FRIENDS}/requests/sent`)
    return data
  },

  sendFriendRequest: async (friendId: string): Promise<Friendship> => {
    const { data } = await api.post<Friendship>(`${FRIENDS}/requests/${friendId}`)
    return data
  },

  cancelFriendRequest: async (friendId: string): Promise<void> => {
    await api.delete(`${FRIENDS}/requests/${friendId}`)
  },

  acceptFriendRequest: async (askingId: string): Promise<Friendship> => {
    const { data } = await api.patch<Friendship>(`${FRIENDS}/requests/${askingId}/accept`)
    return data
  },

  declineFriendRequest: async (askingId: string): Promise<void> => {
    await api.patch(`${FRIENDS}/requests/${askingId}/decline`)
  },

  unfriend: async (friendId: string): Promise<void> => {
    await api.delete(`${FRIENDS}/${friendId}`)
  },

  fetchCompletedLessons: async (
    params: PaginationParams = {}
  ): Promise<Paginated<LessonCompleted>> => {
    const { data } = await api.get<Paginated<LessonCompleted>>(`${LESSONS}/completed`, { params })
    return data
  },

  fetchOngoingLessons: async (
    params: PaginationParams = {}
  ): Promise<Paginated<LessonOngoing>> => {
    const { data } = await api.get<Paginated<LessonOngoing>>(`${LESSONS}/ongoing`, { params })
    return data
  },

  fetchLessonStatus: async (lessonId: string): Promise<LessonStatus> => {
    const { data } = await api.get<LessonStatus>(`${LESSONS}/${lessonId}`)
    return data
  },

  subscribeLesson: async (lessonId: string): Promise<LessonOngoing> => {
    const { data } = await api.post<LessonOngoing>(`${LESSONS}/${lessonId}/subscribe`)
    return data
  },

  unsubscribeLesson: async (lessonId: string): Promise<void> => {
    await api.delete(`${LESSONS}/${lessonId}/unsubscribe`)
  },

  fetchCreatedLessons: async (
    userId: string,
    params: PaginationParams = {}
  ): Promise<Paginated<CreatedLesson>> => {
    const { data } = await api.get<Paginated<CreatedLesson>>(`${PROFILE}/${userId}/lessons`, { params })
    return data
  },

  fetchCreatedExams: async (
    userId: string,
    params: PaginationParams = {}
  ): Promise<Paginated<CreatedExam>> => {
    const { data } = await api.get<Paginated<CreatedExam>>(`${PROFILE}/${userId}/exams`, { params })
    return data
  },
}
