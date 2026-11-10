import { useCallback } from "react"
import { BookOpen, ClipboardList } from "lucide-react"
import { userService } from "@/services/user/user_service"
import type { PaginationParams } from "@/utils/types/common"
import { formatDate } from "./utils"
import {
  ItemRow,
  PaginatedSection,
} from "../../components/user/PaginatedSection"
import { useTranslation } from 'react-i18next'

/** Public: what this profile has created (lessons and exams). */
export function CreatedContent({ userId }: { userId: string }) {
  const { t } = useTranslation()
  const fetchLessons = useCallback(
    (p: PaginationParams) => userService.fetchCreatedLessons(userId, p),
    [userId],
  )
  const fetchExams = useCallback(
    (p: PaginationParams) => userService.fetchCreatedExams(userId, p),
    [userId],
  )

  return (
    <div className="space-y-6">
      <PaginatedSection
        title={t('lessonsCreated', 'Lessons created')}
        fetcher={fetchLessons}
        emptyText="No lessons created yet."
        errorText="Failed to load lessons."
        renderItem={(l) => (
          <ItemRow
            icon={BookOpen}
            title={l.title}
            subtitle={t('createdOnVal', 'Created on {{val}}', { val: formatDate(l.created_at) })}
          />
        )}
      />
      <PaginatedSection
        title={t('examsCreated', 'Exams created')}
        fetcher={fetchExams}
        emptyText="No exams created yet."
        errorText="Failed to load exams."
        renderItem={(e) => (
          <ItemRow
            icon={ClipboardList}
            title={e.title}
            subtitle={t('createdOnVal', 'Created on {{val}}', { val: formatDate(e.created_at) })}
          />
        )}
      />
    </div>
  )
}
