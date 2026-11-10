import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from 'react-i18next'

type CodeQuestionEditorProps = {
  mainFile: File | null
  referenceFile: File | null
  onMainFileChange: (file: File | null) => void
  onReferenceFileChange: (file: File | null) => void
}

export function CodeQuestionEditor({
  mainFile,
  referenceFile,
  onMainFileChange,
  onReferenceFileChange,
}: CodeQuestionEditorProps) {
  const { t } = useTranslation()
  const handleMainFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    onMainFileChange(selectedFile)
  }

  const handleReferenceFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0] ?? null
    onReferenceFileChange(selectedFile)
  }

  return (
    <div>
      <label htmlFor="c-main-file">{t('expectedMainc', 'Expected main.c')}</label>
      <Input
        id="c-main-file"
        type="file"
        accept=".c"
        onChange={handleMainFileChange}
        aria-label={t('uploadCMain', 'Upload C main')}
      />
      <label htmlFor="c-reference-file">{t('expectedFunctionc', 'Expected function.c')}</label>
      <Input
        id="c-reference-file"
        type="file"
        accept=".c"
        onChange={handleReferenceFileChange}
        aria-label={t('uploadCReferenceFunction', 'Upload C reference function')}
      />
      <Button type="submit" disabled={!mainFile || !referenceFile}>
        {t('submit', 'Submit')}
      </Button>
    </div>
  )
}
