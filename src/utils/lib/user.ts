
interface NameLike {
  firstname: string | null
  lastname: string | null
  username: string
}

const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-500",
]

export function avatarColor(seed: string): string {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getInitials(user: NameLike): string {
  const initials = [user.firstname, user.lastname]
    .filter(Boolean)
    .map((part) => part![0])
    .join("")
  return (initials || user.username.slice(0, 2)).toUpperCase()
}

export function getDisplayName(user: NameLike): string {
  const full = [user.firstname, user.lastname].filter(Boolean).join(" ")
  return full || user.username
}