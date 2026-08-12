import FileListWidget from '@/components/FileListWidget'

export default function IndexPage() {
	return(
		<>
			<FileListWidget mode="full" showPagination={true} showUpload={true} initialLimit={10} />
		</>
	)
}
