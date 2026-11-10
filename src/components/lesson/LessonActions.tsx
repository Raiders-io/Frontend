import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Edit,
  Trash2,
  Lock,
  Globe,
  MoreHorizontal,
  FileText,
} from "lucide-react"
import type { Lesson } from "@/utils/types/lesson"
import { changePageLessonEdit } from "@/utils/router/changePage"
import { useTranslation } from 'react-i18next'

interface LessonActionsProps {
  lesson: Lesson
  onTogglePrivacy: (lessonId: string) => void
  onDelete: (lessonId: string) => void
}

export default function LessonActions({
  lesson,
  onTogglePrivacy,
  onDelete,
}: LessonActionsProps) {
  const { t } = useTranslation()
  const { author, slug, lessonId } = lesson

  // Fix: Use 'id' instead of 'UUID'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative z-10 h-8 w-8"
          aria-label={t('lessonActions', 'Lesson actions')}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="gap-2 cursor-pointer"
          onSelect={(e) => {
            e.stopPropagation();
            changePageLessonEdit(author.username, slug)
          }}
        >
          <Edit className="h-4 w-4" />
          {t('editLesson', 'Edit lesson')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            console.log("DEBUG: Privacy toggle")
            e.stopPropagation();
            onTogglePrivacy(lessonId)
          }}
          className="gap-2 cursor-pointer"
        >
          {lesson.isPrivate ? (
            <>
              <Globe className="h-4 w-4" />
              {t('makePublic', 'Make public')}
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              {t('makePrivate', 'Make private')}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer"
          onSelect={(e) => {
            e.stopPropagation();
            //TODO when the page is ready
            //changePageLessonEditFiles(author.username, slug)
          }}
        >
          <FileText className="h-4 w-4" />
          {t('manageFiles', 'Manage files')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(lessonId)}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {t('deleteLesson', 'Delete lesson')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
