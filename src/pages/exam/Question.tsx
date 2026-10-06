import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ExactAnswerEditor } from "@/components/exam/ExactAnswerEditor"
import { MultipleChoiceEditor } from "@/components/exam/MultipleChoiceEditor"
import type { Question, QuestionChoice } from "@/utils/types/exam"
import { ChooseQuestionWeight } from "@/components/exam/ChooseQuestionWeight"
import { CodeQuestionEditor } from "@/components/exam/CodeQuestionEditor"

type CreateQuestionProps = { onAdd?: (question: Question) => void }

export default function Question({ onAdd }: CreateQuestionProps) {
  return <CreateQuestion onAdd={onAdd} />
}

export function CreateQuestion({ onAdd }: CreateQuestionProps) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState<Question["type"]>("multiple_choice")
  const [pos, setPos] = useState(1)
  const [answer, setAnswer] = useState("")
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [choices, setChoices] = useState<QuestionChoice[]>([])
  const [currentChoice, setCurrentChoice] = useState("")
  const [currentPoints, setCurrentPoints] = useState(1)

  function resetForm() {
    setText("")
    setPos((prevPos) => prevPos + 1)
    setType("multiple_choice")
    setAnswer("")
    setAnswers([])
    setCurrentAnswer("")
    setChoices([])
    setCurrentChoice("")
    setCurrentPoints(1)
    setFile(null)
  }

  function handleTypeChange(nextType: Question["type"]) {
    setType(nextType)
    setAnswer("")
    setCurrentAnswer("")
    if (nextType === "exact_answer") {
      setChoices([])
      setCurrentChoice("")
    } else {
      setAnswers([])
    }
  }

  function submitQuestion(codeAnswer = answer) {
    if (!text.trim()) return
    if (type === "multiple_choice") {
      if (choices.length < 2 || !choices.some((choice) => choice.isCorrect))
        return
    } else if (type === "exact_answer" && answers.length === 0) {
      return
    }
    onAdd?.({
      id: Date.now().toString(),
      pos,
      text: text.trim(),
      type,
      points: currentPoints,
      starterCode: type === "c_function" ? codeAnswer.trim() || undefined : undefined,
      answers:
        type === "exact_answer" && answers.length > 0 ? answers : undefined,
      choices:
        type === "multiple_choice" && choices.length > 0 ? choices : undefined,
    })
    resetForm()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitQuestion()
  }

  function addChoice() {
    const trimmedChoice = currentChoice.trim()
    if (!trimmedChoice) return
    setChoices((previousChoices) => [
      ...previousChoices,
      {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: trimmedChoice,
        isCorrect: false,
      },
    ])
    setCurrentChoice("")
  }

  function addAnswer() {
    const trimmedAnswer = currentAnswer.trim()
    if (!trimmedAnswer) return
    setAnswers((previousAnswers) => [...previousAnswers, trimmedAnswer])
    setCurrentAnswer("")
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Question"
      />
      <ChooseQuestionWeight
        currentPoints={currentPoints}
        setCurrentPoints={setCurrentPoints}
      />
      <select
        className="border rounded-md p-2"
        value={type}
        onChange={(event) =>
          handleTypeChange(event.target.value as Question["type"])
        }
      >
        <option value="multiple_choice">Choix</option>
        <option value="exact_answer">Réponses possibles</option>
        <option value="c_function">C function</option>
      </select>
      {(() => {
        switch (type) {
          case "multiple_choice":
            return (
              <MultipleChoiceEditor
                choices={choices}
                currentChoice={currentChoice}
                onCurrentChoiceChange={setCurrentChoice}
                onAddChoice={addChoice}
                onToggleChoice={(choiceId) =>
                  setChoices((previousChoices) =>
                    previousChoices.map((choice) =>
                      choice.id === choiceId
                        ? { ...choice, isCorrect: !choice.isCorrect }
                        : choice,
                    ),
                  )
                }
                onRemoveChoice={(choiceId) =>
                  setChoices((previousChoices) =>
                    previousChoices.filter((choice) => choice.id !== choiceId),
                  )
                }
              />
            )
          case "exact_answer":
            return (
              <ExactAnswerEditor
                answers={answers}
                currentAnswer={currentAnswer}
                onCurrentAnswerChange={setCurrentAnswer}
                onAddAnswer={addAnswer}
                onRemoveAnswer={(index) =>
                  setAnswers((previousAnswers) =>
                    previousAnswers.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  )
                }
              />
            )
          case "c_function":
            return (
              <CodeQuestionEditor
                onFileChange={setFile}
                onSubmit={() => {
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = () => {
                      const fileContent = reader.result as string
                      submitQuestion(fileContent)
                    }
                    reader.readAsText(file)
                  }
                }}
              />
            )
        }
      })()}
    </form>
  )
}
