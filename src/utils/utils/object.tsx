import i18next from 'i18next'
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

	return i18next.t('valVal2', '{{val}} {{val2}}', { val: size.toFixed(size >= 10 || index === 0 ? 0 : 1), val2: units[index] })
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
