
export interface PublicProfile {
  id: string
  username: string
  firstname: string | null
  lastname: string | null
  bio: string | null
  currentStreak: number
  lessonsCompletedCount: number
  longestStreak: number
  avatarUpdatedAt: string | null
  backgroundUpdatedAt: string | null
}

export interface PrivateProfile extends PublicProfile {
  lastActivityDate: string | null
}

export type Profile = PrivateProfile | PublicProfile

export interface UpdateMePayload {
  username?: string
  firstname?: string | null
  lastname?: string | null
  bio?: string | null
  avatar?: File | Blob
  background?: File | Blob
}

export interface UserSearchResult {
  id: string
  username: string
  firstname: string | null
  lastname: string | null
  avatar_url: string | null
}

export type FriendshipStatus = "pending" | "accepted"

export type RelationshipStatus = 'self' | 'none' | 'friends' | 'pending_sent' | 'pending_received'

export interface Friendship {
  id: number
  user_id: string
  friend_id: string
  status: FriendshipStatus
  created_at: string | null
  updated_at: string | null
}

export interface ReceivedFriendRequest extends Friendship {
  user: PublicProfile
}

export interface SentFriendRequest extends Friendship {
  friend: PublicProfile
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

export interface CreatedLesson {
  id: string
  title: string
  created_at: string
}

export interface CreatedExam {
  id: string
  title: string
  created_at: string
}

