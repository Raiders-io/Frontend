import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/exam/CodeEditor"
import {
  toQuestion,
  type ExamPaper as ExamPaperData,
} from "@/utils/lib/exam_api"

type ExamPaperProps = {
  paper: ExamPaperData
  answers: Record<number, string>
  onAnswerChange: (answerId: number, value: string) => void
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

function selectedChoices(value: string | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : [value]
  } catch {
    return [value]
  }
}

export default function ExamPaper({
  paper,
  answers,
  onAnswerChange,
  onSubmit,
}: ExamPaperProps) {
  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold">{paper.exam?.title}</h2>
      {paper.answers.map((answer, index) => {
        const backendQuestion = answer.examsQuestion?.question
        if (!backendQuestion) return null

        const question = toQuestion(backendQuestion, index + 1)
        const currentAnswer = answers[answer.id] ?? ""

        return (
          <fieldset className="flex flex-col gap-2" key={answer.id}>
            <legend className="font-semibold">
              {index + 1}. {question.text}
            </legend>
            {question.type === "multiple_choice" &&
              question.choices?.map((choice) => (
                <label className="flex items-center gap-2" key={choice.id}>
                  <input
                    type="checkbox"
                    name={`answer-${answer.id}`}
                    value={choice.text}
                    checked={selectedChoices(currentAnswer).includes(
                      choice.text,
                    )}
                    onChange={(event) => {
                      const currentChoices = selectedChoices(currentAnswer)
                      const nextChoices = event.target.checked
                        ? [...currentChoices, choice.text]
                        : currentChoices.filter(
                            (selectedChoice) => selectedChoice !== choice.text,
                          )
                      onAnswerChange(answer.id, JSON.stringify(nextChoices))
                    }}
                  />
                  <span>{choice.text}</span>
                </label>
              ))}
            {question.type === "exact_answer" && (
              <input
                className="rounded-md border p-2"
                type="text"
                value={currentAnswer}
                onChange={(event) =>
                  onAnswerChange(answer.id, event.target.value)
                }
              />
            )}
            {question.type === "c_code" && (
              <CodeEditor
                language="c"
                value={currentAnswer}
                onChange={(value) => onAnswerChange(answer.id, value)}
              />
            )}
          </fieldset>
        )
      })}
      <Button type="submit">Submit answers</Button>
    </form>
  )
}
