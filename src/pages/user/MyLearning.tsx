import { BookCheck, BookOpen } from "lucide-react"
import { userService } from "@/services/user/user_service"
import { formatDate } from "./utils"
import { ItemRow, PaginatedSection } from "@/components/user/PaginatedSection"
import { useTranslation } from 'react-i18next'

export function MyLearning() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <PaginatedSection
        title={t('ongoingLessons', 'Ongoing lessons')}
        fetcher={userService.fetchOngoingLessons}
        emptyText="No ongoing lessons at the moment."
        errorText="Impossible to load lessons."
        renderItem={(l) => (
          <ItemRow
            icon={BookOpen}
            title={t('leonVal', 'Leçon {{val}}', { val: l.lesson_id.slice(0, 8) })}
            subtitle={t('commenceLeVal', 'Commencée le {{val}}', { val: formatDate(l.started_at) })}
          />
        )}
      />
      <PaginatedSection
        title={t('completedLessons', 'Completed lessons')}
        fetcher={userService.fetchCompletedLessons}
        emptyText="No completed lessons at the moment."
        errorText="Impossible to load lessons."
        renderItem={(l) => (
          <ItemRow
            icon={BookCheck}
            title={t('lessonVal', 'Lesson {{val}}', { val: l.lesson_id.slice(0, 8) })}
            subtitle={t('finishedOnVal', 'Finished on {{val}}', { val: formatDate(l.completed_at) })}
          />
        )}
      />
    </div>
  )
}
