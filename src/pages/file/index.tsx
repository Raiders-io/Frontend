import FileListWidget from '@/components/FileListWidget'
import { QuotaTable } from '@/components/QuotaTable'

export default function IndexPage() {
	return(
		<>
			<FileListWidget mode="full" showPagination={true} showUpload={true} initialLimit={10} />
			<QuotaTable />
		</>
	)
}
