import { useSearchResource } from "@/utils/hooks/useSearchResource"
import { getSearchItemKey, renderSearchItem } from "@/utils/utils/searchItem"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { Fragment } from "react"
import { LoaderCircle } from "lucide-react"
import { useLocation } from "react-router-dom"
import SkeletonCard from "../ui/skeletonCard"

interface SearchPreviewProps {
  isFocus: boolean
  resource?: string
  query: string
  className?: string
  children: React.ReactNode
}

export function SearchPreview({
  isFocus,
  resource,
  query,
  children,
  className,
}: SearchPreviewProps) {
  const enabled = isFocus && query.trim().length >= 2
  const limit = resource === "file" ? 10 : 5
  const { items, total, loading } = useSearchResource({
    resource,
    query,
    limit,
    enabled,
  })
  const isOpen = enabled && (loading || items.length > 0)
  const location = useLocation()

  if (location.pathname.startsWith("/search")) {
    return <div className={`${className} relative w-full`}>{children}</div>
  }

  return (
    <div className={`${className} relative w-full`}>
      <Popover open={isOpen}>
        <PopoverAnchor asChild>
          <div>{children}</div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()} // keep focus in the input
        >
          <p className="px-2 pb-2 text-sm font-medium">
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              `${total} Search Results`
            )}
          </p>
          <div className="flex flex-col gap-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} className="w-full max-h-20" />
              ))
              : items.length > 0
                ? items.map((item) => (
                  <Fragment key={getSearchItemKey(item)}>
                    {renderSearchItem(item, "preview", "w-full max-h-20")}
                  </Fragment>
                ))
                : <p className="px-2 py-1 text-sm text-muted-foreground">No results found</p>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
