import LessonCard from "@/components/lesson/LessonCard"
import ExamCard from "@/components/exam/ExamCard"
import FileCard from "@/components/search/FileCard"
import type { Lesson } from "@/utils/types/lesson"
import type { ExamSummary } from "@/utils/types/exam"
import type { FileObject } from "@/utils/types/object"
import type { SerializedSearchItem } from "@/utils/types/component"
import type { SearchableItem } from "@/utils/hooks/useSearchResource"

/** Variants shared by every search card (LessonCard, FileCard, ExamCard). */
export type SearchCardVariant = "default" | "preview"

/** Renders a search result with the card matching its `kind`. */
export function renderSearchItem(
  item: SerializedSearchItem<SearchableItem>,
  variant: SearchCardVariant = "default",
  className?: string,
) {
  if ("lessonId" in item.data) {
    return <LessonCard lesson={item.data as Lesson} variant={variant} className={className} />
  }
  if ("name" in item.data) {
    return <FileCard file={item.data as FileObject} variant={variant} className={className} />
  }
  return <ExamCard exam={item.data as ExamSummary} variant={variant} className={className} />
}

/** Stable React key for a search result, based on its `kind`. */
export function getSearchItemKey(item: SerializedSearchItem<SearchableItem>): string {
  switch (item.kind) {
    case "lesson":
      return (item.data as Lesson).lessonId
    case "exam":
      return (item.data as ExamSummary).id
    case "file":
      return (item.data as FileObject).name
    default:
      return "None"
  }
}
