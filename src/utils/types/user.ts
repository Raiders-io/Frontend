
export interface PublicUser {
  id: string
  username: string
  firstname: string | null
  lastname: string | null
  bio: string | null
  avatarUrl: string | null
  currentStreak: number
}

export interface Me extends PublicUser {
  longestStreak: number
  lastActivityDate: string | null
  lessonsCompletedCount: number
}

export interface UpdateMePayload {
  username?: string
  firstname?: string
  lastname?: string
  bio?: string
  avatar?: File | Blob
}

export interface UserSearchResult {
  id: string
  username: string
  firstname: string | null
  lastname: string | null
  avatar_url: string | null
}

export interface UserModel {
  id: string
  username: string
  firstname: string | null
  lastname: string | null
  bio: string | null
  avatar_url: string | null
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  created_at: string | null
  updated_at: string | null
}

export type FriendshipStatus = "pending" | "accepted"

export interface Friendship {
  id: number
  user_id: string
  friend_id: string
  status: FriendshipStatus
  created_at: string | null
  updated_at: string | null
}

export interface ReceivedFriendRequest extends Friendship {
  user: UserModel
}

export interface SentFriendRequest extends Friendship {
  friend: UserModel
}

export type LessonStatus = "none" | "ongoing" | "completed"

export interface LessonCompleted {
  id: number
  user_id: string
  lesson_id: string
  completed_at: string
  created_at: string | null
  updated_at: string | null
}

export interface LessonOngoing {
  id: number
  user_id: string
  lesson_id: string
  started_at: string
  created_at: string | null
  updated_at: string | null
}
