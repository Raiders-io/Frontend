type FileListUploadFeedbackProps = {
	uploadError: string | null
	uploadSuccess: string | null
}

export default function FileListUploadFeedback({ uploadError, uploadSuccess }: FileListUploadFeedbackProps) {
	if (!uploadError && !uploadSuccess) {
		return null
	}

	return (
		<>
			{uploadError && (
				<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
					{uploadError}
				</div>
			)}
			{uploadSuccess && (
				<div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
					{uploadSuccess}
				</div>
			)}
		</>
	)
}