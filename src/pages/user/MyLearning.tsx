import { BookCheck, BookOpen } from "lucide-react"
import { userService } from "@/services/user_service"
import { formatDate } from "./utils"
import { ItemRow, PaginatedSection } from "../../components/user/PaginatedSection"

export function MyLearning() {
  return (
    <div className="space-y-6">
      <PaginatedSection
        title="Leçons en cours"
        fetcher={userService.fetchOngoingLessons}
        emptyText="Aucune leçon en cours."
        errorText="Impossible de charger les leçons."
        renderItem={(l) => (
          <ItemRow
            icon={BookOpen}
            title={`Leçon ${l.lesson_id.slice(0, 8)}`}
            subtitle={`Commencée le ${formatDate(l.started_at)}`}
          />
        )}
      />
      <PaginatedSection
        title="Leçons terminées"
        fetcher={userService.fetchCompletedLessons}
        emptyText="Aucune leçon terminée pour le moment."
        errorText="Impossible de charger les leçons."
        renderItem={(l) => (
          <ItemRow
            icon={BookCheck}
            title={`Leçon ${l.lesson_id.slice(0, 8)}`}
            subtitle={`Terminée le ${formatDate(l.completed_at)}`}
          />
        )}
      />
    </div>
  )
}
