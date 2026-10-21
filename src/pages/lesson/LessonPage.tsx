import {
  CustomResizablePanelGroup,
  CustomResizablePanelLeftZone,
  CustomResizablePanelRightZone,
  CustomResizablePanelHandle,
} from "@/components/CustomResizablePanel"
import LessonDisplay from "@/components/lesson/LessonDisplay"
import { mockFiles } from "@/utils/mock"
import { lessonService } from "@/services/lesson_service"
import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Lesson } from "@/utils/types/lesson"
import { ArrowLeft, PanelLeftClose, PanelRightClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/lib/shadcn"

interface LessonPageProps {
  className?: string
}

export default function LessonPage({ className }: LessonPageProps) {
  const files = mockFiles
  const { author, slug } = useParams<{ author: string; slug: string }>()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Panel state
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  useEffect(() => {
    if (!author || !slug) return
    const fetchLesson = async () => {
      setLoading(true)
      try {
        const data = await lessonService.getLessonByAuthorAndContent(author, slug)
        setLesson(data)
      } catch (error) {
        console.error("Error fetching lesson:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [author, slug])

  const toggleLeft = () => setLeftCollapsed(!leftCollapsed)
  const toggleRight = () => setRightCollapsed(!rightCollapsed)

  if (!loading && !lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">Lesson not found.</p>
          <Link to="/">
            <Button variant="link" className="mt-2">← Back to lessons</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex h-screen w-full flex-col bg-background", className)}>
      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">All lessons</span>
            </Button>
          </Link>
          <div className="h-5 w-px bg-border" />
          <h1 className="truncate text-sm font-semibold text-foreground">
            {loading ? "Loading…" : lesson?.title ?? "Untitled lesson"}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLeft}
            aria-label={leftCollapsed ? "Show lesson panel" : "Hide lesson panel"}
            className="text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose
              className={cn(
                "h-4 w-4 transition-transform",
                leftCollapsed && "rotate-180"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRight}
            aria-label={rightCollapsed ? "Show exam panel" : "Hide exam panel"}
            className="text-muted-foreground hover:text-foreground"
          >
            <PanelRightClose
              className={cn(
                "h-4 w-4 transition-transform",
                rightCollapsed && "-rotate-180"
              )}
            />
          </Button>
        </div>
      </header>

      {/* ---------- Resizable body ---------- */}
      <div className="relative flex-1 overflow-hidden">
        <CustomResizablePanelGroup>
          {/* LEFT — Lesson */}
          {!leftCollapsed && (
            <>
              <CustomResizablePanelLeftZone>
                <div className="h-full overflow-y-auto">
                  {loading ? (
                    <LessonSkeleton />
                  ) : lesson ? (
                    <LessonDisplay lesson={lesson} files={files} />
                  ) : (
                    <EmptyState message="No lesson available." />
                  )}
                </div>
              </CustomResizablePanelLeftZone>
              <CustomResizablePanelHandle />
            </>
          )}

          {/* RIGHT — Exam WIP */}
          {!rightCollapsed && (
            <CustomResizablePanelRightZone>
              <div className="h-full overflow-y-auto p-6">
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6">
                  <h2 className="text-lg font-semibold tracking-tight">Exam</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This section is under development.
                  </p>
                </div>
              </div>
            </CustomResizablePanelRightZone>
          )}
        </CustomResizablePanelGroup>

        {/* Floating re-open buttons when a panel is collapsed */}
        {leftCollapsed && (
          <button
            onClick={toggleLeft}
            aria-label="Open lesson panel"
            className="absolute left-3 top-3 z-10 rounded-md border border-border bg-background/90 p-2 text-muted-foreground shadow-sm backdrop-blur transition hover:border-primary/50 hover:text-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
        {rightCollapsed && (
          <button
            onClick={toggleRight}
            aria-label="Open exam panel"
            className="absolute right-3 top-3 z-10 rounded-md border border-border bg-background/90 p-2 text-muted-foreground shadow-sm backdrop-blur transition hover:border-primary/50 hover:text-foreground"
          >
            <PanelRightClose className="h-4 w-4 -scale-x-100" />
          </button>
        )}
      </div>
    </div>
  )
}

function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}