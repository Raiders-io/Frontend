import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FileListPaginationProps = {
	currentPage: number
	lastPage: number
	limit: number
	hasPreviousPage: boolean
	hasNextPage: boolean
	onPreviousPage: () => void
	onNextPage: () => void
	onLimitChange: (value: number) => void
}

export default function FileListPagination({
	currentPage,
	lastPage,
	limit,
	hasPreviousPage,
	hasNextPage,
	onPreviousPage,
	onNextPage,
	onLimitChange,
}: FileListPaginationProps) {
	return (
		<div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-end md:justify-between">
			<div className="space-y-1">
				<p className="text-sm font-medium">Pagination</p>
				<p className="text-sm text-muted-foreground">
					Page {currentPage} sur {lastPage}
				</p>
			</div>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
				<div className="space-y-2">
					<Label htmlFor="limit">Files per page</Label>
					<Input
						id="limit"
						type="number"
						min={1}
						value={limit}
						onChange={(event) => onLimitChange(Number(event.target.value))}
						className="w-28"
					/>
				</div>
				<div className="flex gap-2">
					<Button type="button" variant="outline" onClick={onPreviousPage} disabled={!hasPreviousPage}>
						Previous
					</Button>
					<Button type="button" variant="outline" onClick={onNextPage} disabled={!hasNextPage}>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}