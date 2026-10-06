import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination"
import { Button } from "../ui/button"
interface LessonPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function LessonPagination({
  currentPage,
  totalPages,
  onPageChange,
}: LessonPaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              return onPageChange(currentPage - 1)
            }}
            disabled={currentPage == 1}
          />
        </PaginationItem>
        {currentPage > 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => {
                return onPageChange(1)
              }}
              disabled={currentPage == 1}
            >
              1
            </Button>
          </PaginationItem>
        )}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage > 2 && (
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => {
                return onPageChange(currentPage - 1)
              }}
            >
              {currentPage - 1}
            </Button>
          </PaginationItem>
        )}
        <PaginationItem>
          <Button variant="ghost" disabled={true}>
            {`[${currentPage}]`}
          </Button>
        </PaginationItem>
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => {
                return onPageChange(currentPage + 1)
              }}
            >
              {currentPage + 1}
            </Button>
          </PaginationItem>
        )}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage < totalPages && (
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => {
                return onPageChange(totalPages)
              }}
              disabled={currentPage == totalPages}
            >
              {totalPages}
            </Button>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              return onPageChange(currentPage + 1)
            }}
            disabled={currentPage == totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
