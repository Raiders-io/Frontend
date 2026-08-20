export const formatFileSize = (bytes?: number) => {
	if (!bytes || bytes <= 0) {
		return "0 B"
	}

	const units = ["B", "KB", "MB", "GB", "TB"]
	const index = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	)
	const size = bytes / 1024 ** index

	return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
	}

export const formatDate = (dateString?: string) => {
	if (!dateString) {
		return "-"
	}

 	const date = new Date(dateString)
	if (Number.isNaN(date.getTime())) {
		return dateString
	}

	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date)
}
