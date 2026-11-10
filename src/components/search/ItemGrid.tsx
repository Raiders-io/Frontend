import React from "react"
import SkeletonCard from "@/components/ui/skeletonCard"
import { useTranslation } from 'react-i18next'

export type ItemLayout = "grid" | "list"

interface ItemGridProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  getKey: (item: T) => React.Key
  loading?: boolean
  /** Number of skeleton cards shown while loading. */
  skeletonCount?: number
  layout?: ItemLayout
  /** Replaces the default "No items found" state. */
  emptyState?: React.ReactNode
  className?: string
}

/**
 * "Reading focus": while the pointer is over one card, the other cards in the
 * container fade slightly, so the card being read stands out.
 */
const focusDim =
  "[&>*]:transition-opacity [&:has(>*:hover)>*:not(:hover)]:opacity-70"

/**
 * Grid: auto-fill columns with a minimum width, so cards never overlap on resize.
 * `min(100%, 18rem)` keeps a single column valid on very narrow screens.
 * List: one card per line, full width.
 */
const layoutClass: Record<ItemLayout, string> = {
  list: `flex flex-col gap-4 w-full ${focusDim}`,
  grid: `grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-4 ${focusDim}`,
}

export default function ItemGrid<T>({
  items,
  renderItem,
  getKey,
  loading = false,
  skeletonCount = 6,
  layout = "grid",
  emptyState,
  className,
}: ItemGridProps<T>) {
  const { t } = useTranslation()
  if (!loading && (!items || items.length === 0)) {
    return (
      <>
        {emptyState ?? (
          <div className="p-12 text-center text-2xl font-bold">
            <h1>{t('noItemsFound', 'No items found')}</h1>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={`${layoutClass[layout]} ${className ?? ""}`}>
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
          // Skeleton uses the same variant as the real card for each layout
          <SkeletonCard
            key={`skeleton-${i}`}
            variant={layout === "list" ? "preview" : "default"}
          />
        ))
        : items.map((item) => (
          <React.Fragment key={getKey(item)}>{renderItem(item)}</React.Fragment>
        ))}
    </div>
  )
}
