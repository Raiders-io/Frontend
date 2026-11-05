import type { ReactNode } from "react"
import { cn } from "@/utils/lib/shadcn"

interface BackgroundPanelProps {
  title?: ReactNode
  subtitle?: ReactNode
  controls?: ReactNode
  toolbar?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Shared page shell: centered container + tinted enclosed surface
 * (so the solid cards stand out) + optional header and toolbar.
 * Use it for every state of a page (loading, empty, content) so the
 * surface never changes between states.
 */
export default function BackgroundPanel({
  title,
  subtitle,
  controls,
  toolbar,
  children,
  className,
}: BackgroundPanelProps) {
  const hasHeader = title || subtitle || controls

  return (
    <div className="container mx-auto py-6 px-4">
      <div
        className={cn(
          "rounded-lg border border-border bg-muted/60 p-4 shadow-sm md:p-6 dark:bg-muted/30",
          className
        )}
      >
        {hasHeader && (
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {subtitle && (
                <span className="text-sm text-muted-foreground">{subtitle}</span>
              )}
            </div>
            {controls}
          </div>
        )}

        {toolbar && <div className="mb-6">{toolbar}</div>}

        {children}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Usage
 *
 * search.tsx
 *   <BackgroundPanel
 *     title="Search Results"
 *     controls={<SelectPanel options={['grid','list']} ... />}
 *   >
 *     <PaginatedGrid ... />
 *   </BackgroundPanel>
 *
 * ManageLesson.tsx
 *   // loading
 *   <BackgroundPanel title="My Lessons">
 *     <p className="py-20 text-center text-muted-foreground">Loading your lessons...</p>
 *   </BackgroundPanel>
 *
 *   // main
 *   <BackgroundPanel
 *     title="My Lessons"
 *     subtitle={`${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`}
 *     controls={<SelectPanel ... render={PanelRender} />}
 *     toolbar={
 *       <div className={viewMode === "by-file" ? "flex items-center gap-2" : "flex justify-end"}>
 *         {viewMode === "by-file" && <select ...>...</select>}
 *         <Button size="sm" className="gap-2" onClick={changePageLessonCreate}>
 *           <Plus className="h-4 w-4" /> New Lesson
 *         </Button>
 *       </div>
 *     }
 *   >
 *     ...content...
 *   </BackgroundPanel>
 * ------------------------------------------------------------------------- */
