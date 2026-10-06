import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CodeQuestionEditorProps = {
  onFileChange: (file: File | null) => void
  onSubmit: () => void
}

export function CodeQuestionEditor({ onFileChange, onSubmit }: CodeQuestionEditorProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    setFile(selectedFile)
    onFileChange(selectedFile)
  }

  return (
    <div>
      <Input
        type="file"
        accept=".c"
        onChange={handleFileChange}
        placeholder="Upload C main"
      />
      <Button type="button" disabled={!file} onClick={onSubmit}>
        Ajouter la question
      </Button>
    </div>
  )
}