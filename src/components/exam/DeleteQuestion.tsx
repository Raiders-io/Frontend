import type { Question } from "@/utils/types/exam"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useTranslation } from 'react-i18next'

type DeleteQuestionProps = {
  question: Question
  onDelete: (question: Question) => void
}

export function DeleteQuestion({ question, onDelete }: DeleteQuestionProps) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-2 py-2">
      <Button
        type="button"
        variant="destructive"
        size="icon"
        aria-label={t('deleteQuestion', 'Delete question')}
        title={t('deleteQuestion', 'Delete question')}
        onClick={() => void onDelete(question)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}
