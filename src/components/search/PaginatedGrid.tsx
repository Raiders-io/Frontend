import SkeletonCard from "@/components/ui/skeletonCard"
import Pagination from "@/components/search/Pagination"
import type { SerializedSearchItem } from "@/utils/types/component"
import React from "react"

interface PaginatedGridProps<T> {
  items: SerializedSearchItem<T>[]
  renderItem: (item: SerializedSearchItem<T>) => React.ReactNode
  getKey: (item: SerializedSearchItem<T>) => React.Key
  loading: boolean
  limit: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function PaginatedGrid<T>({
  items,
  renderItem,
  getKey,
  loading,
  limit,
  className,
  currentPage,
  totalPages,
  onPageChange
}: PaginatedGridProps<T>) {
  
  return (
    <div className={className}>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] items-stretch">
        {loading ? (
          Array.from({ length: limit }).map((_, index) => (
            <SkeletonCard key={index} className="" />
          ))
        ) : items && items.length > 0 ? (
          items.map((item, index) => {
            const key = getKey ? getKey(item) : index
            return <React.Fragment key={key}>{renderItem(item)}</React.Fragment>
          })
        ) : (
          <div className="text-center font-bold text-2xl p-6">
            <h1>No items found</h1>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
}