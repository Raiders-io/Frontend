import { useCallback, useState } from "react"
import { BookCheck, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "./utils"
import type { LessonCompleted, LessonOngoing } from "@/utils/types/user"
import { userService } from "@/services/user_service"
import type { PaginationParams, Paginated } from "@/utils/types/common"

const PAGE_SIZE = 10

type LessonRow = (LessonCompleted | LessonOngoing) & { id: number; lesson_id: string }

interface ListProps<T extends LessonRow> {
  fetcher: (params: PaginationParams) => Promise<Paginated<T>>
  getDate: (item: T) => string
  dateLabel: string
  emptyText: string
  icon: typeof BookOpen
}

function LessonList<T extends LessonRow>({
  fetcher,
  getDate,
  dateLabel,
  emptyText,
  icon: Icon,
}: ListProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadPage = useCallback(
    async (target: number) => {
      try {
        const res = await fetcher({ page: target, limit: PAGE_SIZE })
        setItems((prev) => (target === 1 ? res.data : [...prev, ...res.data]))
        setPage(res.meta.current_page)
        setLastPage(res.meta.last_page)
        setError(false)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    },
    [fetcher]
  )

  /*useEffect(() => {
    void loadPage(1)
  }, [loadPage])*/

  if (loading && items.length === 0) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-muted-foreground text-sm">Impossible de charger les leçons.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLoading(true)
            void loadPage(1)
          }}
        >
          Réessayer
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground py-10 text-center text-sm">{emptyText}</p>
  }

  return (
    <div className="space-y-3">
      <ul className="divide-border divide-y rounded-lg border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              {/* L'API ne renvoie que l'id de la leçon : à remplacer par son titre si dispo */}
              <p className="truncate text-sm font-medium">Leçon {item.lesson_id.slice(0, 8)}</p>
              <p className="text-muted-foreground text-xs">
                {dateLabel} {formatDate(getDate(item))}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {page < lastPage && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={() => {
              setLoading(true)
              void loadPage(page + 1)
            }}
          >
            {loading ? "Chargement…" : "Voir plus"}
          </Button>
        </div>
      )}
    </div>
  )
}

export function LessonsTab() {
  return (
    <Tabs defaultValue="ongoing">
      <TabsList variant="line">
        <TabsTrigger value="ongoing">En cours</TabsTrigger>
        <TabsTrigger value="completed">Terminées</TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing" className="pt-3">
        <LessonList
          fetcher={userService.fetchOngoingLessons}
          getDate={(l: LessonOngoing) => l.started_at}
          dateLabel="Commencée le"
          emptyText="Aucune leçon en cours."
          icon={BookOpen}
        />
      </TabsContent>
      <TabsContent value="completed" className="pt-3">
        <LessonList
          fetcher={userService.fetchCompletedLessons}
          getDate={(l: LessonCompleted) => l.completed_at}
          dateLabel="Terminée le"
          emptyText="Aucune leçon terminée pour le moment."
          icon={BookCheck}
        />
      </TabsContent>
    </Tabs>
  )
}
