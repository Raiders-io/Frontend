import type { ExamPaper as ExamPaperData } from "@/utils/lib/exam_api"

type DisplayResultProps = {
  examPaper: ExamPaperData
  goodAnswersIds: string[]
}

export function DisplayResult({
  examPaper,
  goodAnswersIds,
}: DisplayResultProps) {
  return (
    <div className="flex flex-col gap-4">
      {examPaper.answers.map((answer) => {
        const question = answer.examsQuestion?.question
        if (!question) return null

        const parseAnswers = (value: string[] | string | null): string[] => {
          if (Array.isArray(value)) return value
          if (!value) return []
          try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : [value]
          } catch {
            return [value]
          }
        }

        const goodAnswers = parseAnswers(question.goodAnswers)
        const candidateAnswers = parseAnswers(answer.answer)
        const isQuestionCorrect = goodAnswersIds.includes(question.id)

        if (question.questionType === "C_FUNCTION") {
          return (
            <div key={answer.id} className="flex flex-col gap-2">
              <p className="font-semibold">{question.title}</p>
              <p
                className={`rounded-md p-2 ${
                  isQuestionCorrect
                    ? "bg-green-100 text-green-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {isQuestionCorrect ? "OK :D" : "KO :("}
              </p>
            </div>
          )
        }

        const possibleAnswers = [
          ...goodAnswers,
          ...parseAnswers(question.badAnswers),
          ...candidateAnswers.filter(
            (candidateAnswer) =>
              !goodAnswers.includes(candidateAnswer) &&
              !parseAnswers(question.badAnswers).includes(candidateAnswer),
          ),
        ]

        return (
          <div key={answer.id} className="flex flex-col gap-2">
            <p className="font-semibold">{question.title}</p>
            {possibleAnswers.map((possibleAnswer, index) => {
              const isSelected = candidateAnswers.includes(possibleAnswer)

              return (
                <p
                  key={`${answer.id}-${possibleAnswer}-${index}`}
                  className={`rounded-md p-2 ${
                    isSelected && isQuestionCorrect
                      ? "bg-green-100 text-green-900"
                      : isSelected
                        ? "bg-red-100 text-red-900"
                        : "bg-muted"
                  }`}
                >
                  {possibleAnswer}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
