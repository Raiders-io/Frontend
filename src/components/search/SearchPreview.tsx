import { useSearchLesson } from "@/utils/hooks/useSearch"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { LoaderCircle } from "lucide-react"
import SkeletonCard from "../ui/skeletonCard"
import LessonCard from "../lesson/LessonCard"

interface SearchPreviewProps {
  isFocus: boolean
  query: string
  className?: string
  children: React.ReactNode
}

export function SearchPreview({ isFocus, query, children, className }: SearchPreviewProps) {
  const enabled = isFocus && query.trim().length >= 2
  const { items, total, loading } = useSearchLesson({ query, limit: 5, enabled })
  const isOpen = enabled && (loading || items.length > 0)

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
            : items.map((item) => (
                <LessonCard
                  key={item.UUID}
                  Lesson={item}
                  maxLen={20}
                  className="w-full max-h-20"
                />
              ))}
        </div>
      </PopoverContent>
    </Popover>
    </div>
  )
}