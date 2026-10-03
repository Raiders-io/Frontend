import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function InitExam({
  title,
  setTitle,
  handleCreateExam,
}: {
  title: string
  setTitle: (title: string) => void
  handleCreateExam: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form className="flex flex-col gap-3" onSubmit={handleCreateExam}>
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Exam Name"
        id="input-required"
        required
      />

      <Textarea className="w-full min-h-24" placeholder="Exam Description" />

      <Button variant="default" type="submit" disabled={!title.trim()}>
        Create exam
      </Button>
    </form>
  )
}
