import { BookCheck, BookOpen } from "lucide-react"
import { userService } from "@/services/user/user_service"
import { formatDate } from "./utils"
import { ItemRow, PaginatedSection } from "@/components/user/PaginatedSection"

export function MyLearning() {
  return (
    <div className="space-y-6">
      <PaginatedSection
        title="Ongoing lessons"
        fetcher={userService.fetchOngoingLessons}
        emptyText="No ongoing lessons at the moment."
        errorText="Impossible to load lessons."
        renderItem={(l) => (
          <ItemRow
            icon={BookOpen}
            title={`Leçon ${l.lesson_id.slice(0, 8)}`}
            subtitle={`Commencée le ${formatDate(l.started_at)}`}
          />
        )}
      />
      <PaginatedSection
        title="Completed lessons"
        fetcher={userService.fetchCompletedLessons}
        emptyText="No completed lessons at the moment."
        errorText="Impossible to load lessons."
        renderItem={(l) => (
          <ItemRow
            icon={BookCheck}
            title={`Lesson ${l.lesson_id.slice(0, 8)}`}
            subtitle={`Finished on ${formatDate(l.completed_at)}`}
          />
        )}
      />
    </div>
  )
}
