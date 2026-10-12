import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CodeQuestionEditorProps = {
  onMainFileChange: (file: File | null) => void
  onReferenceFileChange: (file: File | null) => void
  onSubmit: () => void
}

export function CodeQuestionEditor({
  onMainFileChange,
  onReferenceFileChange,
  onSubmit,
}: CodeQuestionEditorProps) {
  const [mainFile, setMainFile] = useState<File | null>(null)
  const [referenceFile, setReferenceFile] = useState<File | null>(null)

  const handleMainFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    setMainFile(selectedFile)
    onMainFileChange(selectedFile)
  }

  const handleReferenceFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0] ?? null
    setReferenceFile(selectedFile)
    onReferenceFileChange(selectedFile)
  }

  return (
    <div>
      <label htmlFor="c-main-file">Expected main.c</label>
      <Input
        id="c-main-file"
        type="file"
        accept=".c"
        onChange={handleMainFileChange}
        aria-label="Upload C main"
      />
      <label htmlFor="c-reference-file">Expected function.c</label>
      <Input
        id="c-reference-file"
        type="file"
        accept=".c"
        onChange={handleReferenceFileChange}
        aria-label="Upload C reference function"
      />
      <Button
        type="button"
        disabled={!mainFile || !referenceFile}
        onClick={onSubmit}
      >
        Add question
      </Button>
    </div>
  )
}