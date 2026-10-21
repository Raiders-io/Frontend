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
  layout?: 'grid' | 'list' // Handles layout switching
}

/**
 * "Reading focus": while the pointer is over one card, the other cards in the
 * container fade slightly, so the card being read stands out.
 * Applies to the direct children (the cards) of the container.
 */
const focusDim =
  "[&>*]:transition-opacity [&:has(>*:hover)>*:not(:hover)]:opacity-70"

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
  layout = 'grid' // Defaults to grid
}: PaginatedGridProps<T>) {

  const showEmptyState = !loading && (!items || items.length === 0);

  /*
   * Grid: auto-fill columns with a minimum width. The number of columns adapts
   * to the available space instead of fixed breakpoints, and each card always
   * fits its cell, so cards can no longer overlap when the screen is resized.
   * `min(100%, 18rem)` keeps a single column valid on very narrow screens.
   *
   * List: one card per line, each stretched over the full width.
   */
  const containerClass = layout === 'list'
    ? `flex flex-col gap-4 w-full ${focusDim}`
    : `grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-4 ${focusDim}`

  return (
    <div className={className}>
      {totalPages > 1 && (
        <>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          <hr className="my-6 border-t border-border" />
        </>
      )}

      {showEmptyState ? (
        <div className="text-center font-bold text-2xl p-12">
          <h1>No items found</h1>
        </div>
      ) : (
        <div className={containerClass}>
          {loading ? (
            Array.from({ length: limit }).map((_, index) => (
              // Skeleton uses the same variant as the real card for each layout
              <SkeletonCard
                key={`skeleton-${index}`}
                variant={layout === 'list' ? 'preview' : 'default'}
              />
            ))
          ) : (
            items.map((item, index) => {
              const key = getKey ? getKey(item) : index
              return (
                <React.Fragment key={key}>
                  {renderItem(item)}
                </React.Fragment>
              )
            })
          )}
        </div>
      )}

      {totalPages > 1 && (
        <>
          <hr className="my-6 border-t border-border" />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </div>
  )
}