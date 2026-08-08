import FileListWidget from '@/components/FileListWidget'
import { ModeToggle } from '@/components/mode-toggle'

export default function IndexPage() {
	return(
		<>
			<ModeToggle />
			<FileListWidget mode="full" showPagination={true} showUpload={true} initialLimit={10} />
		</>
	)
}
