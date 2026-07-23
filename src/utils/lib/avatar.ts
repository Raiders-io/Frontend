const AVATAR_COLORS = [
	'bg-rose-500',
	'bg-orange-500',
	'bg-amber-500',
	'bg-emerald-500',
	'bg-teal-500',
	'bg-sky-500',
	'bg-indigo-500',
	'bg-violet-500',
]

export function avatarColor(seed: string): string {
	let hash = 0
	for (const char of seed)
		hash = (hash * 31 + char.charCodeAt(0)) | 0
	return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function initials(name: string): string {
	const parts = name.trim().split(/\s+/)
	if (parts.length >= 2)
		return (parts[0][0] + parts[1][0]).toUpperCase()
	return name.slice(0, 2).toUpperCase()
}