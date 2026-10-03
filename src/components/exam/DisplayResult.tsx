type DisplayResultProps = {
  goodAnswersIds: number[]
  totalPoints: number
}

export function DisplayResult({
  goodAnswersIds,
  totalPoints,
}: DisplayResultProps) {
  return (
    <div>
      <p>Good Answers: {goodAnswersIds.join(", ")}</p>
      <p>Total Points: {totalPoints}</p>
    </div>
  )
}
