import { useCallback } from "react"
import { BookOpen, ClipboardList } from "lucide-react"
import { userService } from "@/services/user/user_service"
import type { PaginationParams } from "@/utils/types/common"
import { formatDate } from "./utils"
import {
  ItemRow,
  PaginatedSection,
} from "../../components/user/PaginatedSection"

/** Public: what this profile has created (lessons and exams). */
export function CreatedContent({ userId }: { userId: string }) {
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
        title="Lessons created"
        fetcher={fetchLessons}
        emptyText="No lessons created yet."
        errorText="Failed to load lessons."
        renderItem={(l) => (
          <ItemRow
            icon={BookOpen}
            title={l.title}
            subtitle={`Created on ${formatDate(l.created_at)}`}
          />
        )}
      />
      <PaginatedSection
        title="Exams created"
        fetcher={fetchExams}
        emptyText="No exams created yet."
        errorText="Failed to load exams."
        renderItem={(e) => (
          <ItemRow
            icon={ClipboardList}
            title={e.title}
            subtitle={`Created on ${formatDate(e.created_at)}`}
          />
        )}
      />
    </div>
  )
}
