import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium">{t('pagination', 'Pagination')}</p>
        <p className="text-sm text-muted-foreground">{t('pageCurrentpageSurLastpage', 'Page {{currentPage}} sur {{lastPage}}', { currentPage, lastPage })}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="limit">{t('filesPerPage', 'Files per page')}</Label>
          <Input
            id="limit"
            type="number"
            min={1}
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="w-28"
          />
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={onPreviousPage}
                disabled={!hasPreviousPage}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={onNextPage} disabled={!hasNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
