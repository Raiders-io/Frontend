import { useSearchLesson } from "@/utils/hooks/useSearch"
import { useSearchFiles } from "@/utils/hooks/useSearchFiles"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { LoaderCircle } from "lucide-react"
import { useLocation } from "react-router-dom"
import SkeletonCard from "../ui/skeletonCard"
import LessonCard from "../lesson/LessonCard"
import FileCard from "./FileCard"

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
  const isFile = resource === "file"
  const enabled = isFocus && query.trim().length >= 2
  const lessonSearch = useSearchLesson({ query, limit: 5, enabled: enabled && !isFile })
  const fileSearch = useSearchFiles({ query, limit: 10, enabled: enabled && isFile })
  const total = isFile ? fileSearch.total : lessonSearch.total
  const loading = isFile ? fileSearch.loading : lessonSearch.loading
  const isOpen = enabled && (loading || (isFile ? fileSearch.items : lessonSearch.items)?.length > 0)
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
              : isFile
                ? fileSearch.items?.length > 0
                  ? fileSearch.items.map((file) => (
                    <FileCard
                      key={file.name}
                      file={file}
                      variant="preview"
                      className="w-full"
                    />
                  ))
                  : <p className="px-2 py-1 text-sm text-muted-foreground">No results found</p>
                : lessonSearch.items?.length > 0
                  ? lessonSearch.items.map((item) => (
                    <LessonCard
                      key={item.lessonId}
                      lesson={item}
                      variant="preview"
                      className="w-full max-h-20"
                    />
                  ))
                  : <p className="px-2 py-1 text-sm text-muted-foreground">No results found</p>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
