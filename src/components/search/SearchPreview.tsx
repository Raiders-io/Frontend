import { useSearchLesson } from "@/utils/hooks/useSearch"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { LoaderCircle } from "lucide-react"
import { useLocation } from "react-router-dom"
import SkeletonCard from "../ui/skeletonCard"
import LessonCard from "../lesson/LessonCard"
import { useTranslation } from 'react-i18next'

interface SearchPreviewProps {
  isFocus: boolean
  query: string
  className?: string
  children: React.ReactNode
}

export function SearchPreview({ isFocus, query, children, className }: SearchPreviewProps) {
  const { t } = useTranslation()
  const enabled = isFocus && query.trim().length >= 2
  const { items, total, loading } = useSearchLesson({ query, limit: 5, enabled })
  const isOpen = enabled && (loading || items?.length > 0)
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
              t('totalSearchResults', '{{total}} Search Results', { total })
            )}
          </p>
          <div className="flex flex-col gap-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} className="w-full max-h-20" />
              ))
              : items?.length > 0 ? items.map((item) => (
                <LessonCard
                  key={item.lessonId}
                  lesson={item}
                  variant="preview"
                  className="w-full max-h-20"
                />
              ))
                : <p className="px-2 py-1 text-sm text-muted-foreground">{t('noResultsFound', 'No results found')}</p>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
