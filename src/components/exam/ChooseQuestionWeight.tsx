import { Input } from "@/components/ui/input"

export function ChooseQuestionWeight({
  currentPoints,
  setCurrentPoints,
}: {
  currentPoints: number
  setCurrentPoints: (points: number) => void
}) {
  return (
    <fieldset className="flex items-center gap-4">
      <legend className="mr-2 text-sm font-medium">Question weight</legend>
      {[1, 2, 3].map((points) => (
        <label
          key={points}
          htmlFor={`question-weight-${points}`}
          className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
        >
          <Input
            type="radio"
            id={`question-weight-${points}`}
            name="question-weight"
            value={points}
            checked={currentPoints === points}
            onChange={(event) => setCurrentPoints(Number(event.target.value))}
          />

          <span>{points}</span>
        </label>
      ))}
      <Input
        type="number"
        min={1}
        max={999}
        placeholder="N"
        value={currentPoints}
        onChange={(event) => setCurrentPoints(Number(event.target.value))}
        className="w-16 h-12"
      />
    </fieldset>
  )
}
