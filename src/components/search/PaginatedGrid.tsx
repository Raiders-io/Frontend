import Pagination from "@/components/search/Pagination"
import ItemGrid, { type ItemLayout } from "@/components/search/ItemGrid"
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
  layout?: ItemLayout
}

/** ItemGrid + pagination controls above and below. */
export default function PaginatedGrid<T>({
  items,
  loading,
  limit,
  className,
  currentPage,
  totalPages,
  renderItem,
  getKey,
  onPageChange,
  layout = "grid",
}: PaginatedGridProps<T>) {
  const pagination = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  )

  return (
    <div className={className}>
      {totalPages > 1 && (
        <>
          {pagination}
          <hr className="my-6 border-t border-border" />
        </>
      )}

      <ItemGrid
        items={items}
        loading={loading}
        skeletonCount={limit}
        layout={layout}
        renderItem={renderItem}
        getKey={getKey}
      />

      {totalPages > 1 && (
        <>
          <hr className="my-6 border-t border-border" />
          {pagination}
        </>
      )}
    </div>
  )
}
