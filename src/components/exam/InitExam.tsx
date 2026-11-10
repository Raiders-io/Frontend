import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExamTagsInput } from "@/components/exam/ExamTagsInput"
import { useTranslation } from 'react-i18next'

export function InitExam({
  title,
  setTitle,
  tags,
  removeTag,
  tagInput,
  setTagInput,
  addTag,
  description,
  setDescription,
  handleCreateExam,
}: {
  title: string
  setTitle: (title: string) => void
  tags: string[]
  removeTag: (tag: string) => void
  tagInput: string
  setTagInput: (tag: string) => void
  addTag: () => void
  description: string
  setDescription: (description: string) => void
  handleCreateExam: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  const { t } = useTranslation()
  return (
    <form className="flex flex-col gap-3" onSubmit={handleCreateExam}>
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={t('examName', 'Exam Name')}
        id="input-required"
        required
      />

      <ExamTagsInput
        tags={tags}
        onRemoveTag={removeTag}
        value={tagInput}
        onChange={setTagInput}
        onAddTag={addTag}
      />

      <Textarea
        className="w-full min-h-24"
        placeholder={t('examDescription', 'Exam Description')}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <Button variant="default" type="submit" disabled={!title.trim()}>
        {t('createExam', 'Create exam')}
      </Button>
    </form>
  )
}
