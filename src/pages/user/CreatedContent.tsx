import { useCallback } from "react"
import { BookOpen, ClipboardList } from "lucide-react"
import { userService } from "@/services/user_service"
import type { PaginationParams } from "@/utils/types/common"
import { formatDate } from "./utils"
import { ItemRow, PaginatedSection } from "../../components/user/PaginatedSection"

/** Public : ce que ce profil a créé (leçons et examens). */
export function CreatedContent({ userId }: { userId: string }) {
  const fetchLessons = useCallback(
    (p: PaginationParams) => userService.fetchCreatedLessons(userId, p),
    [userId]
  )
  const fetchExams = useCallback(
    (p: PaginationParams) => userService.fetchCreatedExams(userId, p),
    [userId]
  )

  return (
    <div className="space-y-6">
      <PaginatedSection
        title="Leçons créées"
        fetcher={fetchLessons}
        emptyText="Aucune leçon créée pour le moment."
        errorText="Impossible de charger les leçons."
        renderItem={(l) => (
          <ItemRow icon={BookOpen} title={l.title} subtitle={`Créée le ${formatDate(l.created_at)}`} />
        )}
      />
      <PaginatedSection
        title="Examens créés"
        fetcher={fetchExams}
        emptyText="Aucun examen créé pour le moment."
        errorText="Impossible de charger les examens."
        renderItem={(e) => (
          <ItemRow icon={ClipboardList} title={e.title} subtitle={`Créé le ${formatDate(e.created_at)}`} />
        )}
      />
    </div>
  )
}
