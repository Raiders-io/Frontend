import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useTranslation } from 'react-i18next'

export function ExamTagsInput({
  tags,
  onRemoveTag,
  value,
  onChange,
  onAddTag,
}: {
  tags: string[]
  onRemoveTag: (tag: string) => void
  value: string
  onChange: (value: string) => void
  onAddTag: () => void
}) {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t('addATag', 'Add a tag')}
          aria-label={t('addAnExamTag', 'Add an exam tag')}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onAddTag()
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={onAddTag}
          disabled={!value.trim()}
        >
          {t('addTag', 'Add tag')}
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label={t('examTags', 'Exam tags')}>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="h-7 gap-1">
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                aria-label={t('removeTagTag', 'Remove tag {{tag}}', { tag })}
                className="rounded-full p-0.5 hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </>
  )
}
