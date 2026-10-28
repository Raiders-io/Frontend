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
import { Link } from "react-router-dom"
import type { Lesson } from "@/utils/types/lesson"

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
  const author = lesson.author?.username ?? ""
  const editUrl = `/lesson/${author}/${lesson.slug}/edit`
  const filesUrl = `/lesson/${author}/${lesson.slug}/files`

  // Fix: Use 'id' instead of 'UUID'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative z-10 h-8 w-8"
          aria-label="Lesson actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <Link to={editUrl}>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <Edit className="h-4 w-4" />
            Edit lesson
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onSelect={(e) => {
            console.log("DEBUG: Privacy toggle")
            e.stopPropagation();
            onTogglePrivacy(lesson.lessonId)
          }}
          className="gap-2 cursor-pointer"
        >
          {lesson.isPrivate ? (
            <>
              <Globe className="h-4 w-4" />
              Make public
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Make private
            </>
          )}
        </DropdownMenuItem>
        <Link to={filesUrl}>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <FileText className="h-4 w-4" />
            Manage files
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(lesson.lessonId)}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete lesson
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
