import { CreateQuestion } from "@/pages/exam/Question"
import { DisplayQuestion } from "@/components/exam/DisplayQuestion"
import { DeleteQuestion } from "@/components/exam/DeleteQuestion"
import type { Question } from "@/utils/types/exam"
import { examApi } from "@/utils/lib/exam_api/requests"
import { toQuestion } from "@/utils/lib/exam_api/utils"
import { GripVertical } from "lucide-react"
import { useState } from "react"
import { InitExam } from "@/components/exam/InitExam"

export default function ExamAuthoring() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState("")
  const [titleTags, setTitleTags] = useState<string[]>([])
  const [manualTags, setManualTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [description, setDescription] = useState("")
  const [message, setMessage] = useState("")
  const [draggedQuestionIndex, setDraggedQuestionIndex] = useState<
    number | null
  >(null)
  const tags = [
    ...new Map(
      [...titleTags, ...manualTags].map((tag) => [
        tag.toLocaleLowerCase(),
        tag,
      ]),
    ).values(),
  ]

  function handleTitleChange(value: string) {
    setTitle(value)
    const words = value
      .split(/\s+/u)
      .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
      .filter(Boolean)
    setTitleTags([
      ...new Map(
        words.map((word) => [word.toLocaleLowerCase(), word]),
      ).values(),
    ])
  }

  function handleAddTag() {
    const tag = tagInput.trim()
    if (
      !tag ||
      tags.some(
        (currentTag) =>
          currentTag.toLocaleLowerCase() === tag.toLocaleLowerCase(),
      )
    )
      return
    setManualTags((currentTags) => [...currentTags, tag])
    setTagInput("")
  }

  async function handleAddQuestion(question: Question): Promise<boolean> {
    try {
      const { data } = await examApi.createQuestion({
        title: question.title,
        questionType:
          question.type === "multiple_choice"
            ? "MCQ"
            : question.type === "written_answer"
              ? "TEXT"
              : "C_FUNCTION",
        goodAnswers:
          question.type === "multiple_choice"
            ? (question.choices
                ?.filter((choice) => choice.isCorrect)
                .map((choice) => choice.text) ?? [])
            : question.type === "written_answer"
              ? (question.answers ?? [])
              : [],
        badAnswers:
          question.type === "multiple_choice"
            ? (question.choices
                ?.filter((choice) => !choice.isCorrect)
                .map((choice) => choice.text) ?? [])
            : [],
        starterCode: question.starterCode ?? "",
        referenceCode: question.referenceCode ?? "",
      })
      const createdQuestion = toQuestion(
        data,
        questions.length + 1,
        question.points,
      )
      setQuestions((previousQuestions) => [
        ...previousQuestions,
        { ...createdQuestion, points: question.points },
      ])
      setMessage("Question created.")
      return true
    } catch {
      setMessage("Failed to create question.")
      return false
    }
  }

  async function handleRemoveQuestion(question: Question) {
    try {
      await examApi.deleteQuestion(question.id)
      setQuestions((previousQuestions) =>
        previousQuestions
          .filter((currentQuestion) => currentQuestion.id !== question.id)
          .map((currentQuestion, index) => ({
            ...currentQuestion,
            pos: index + 1,
          })),
      )
      setMessage("Deleted question.")
    } catch {
      setMessage("Failed to delete question.")
    }
  }

  function handleDropQuestion(targetIndex: number) {
    setQuestions((previousQuestions) => {
      if (draggedQuestionIndex === null || draggedQuestionIndex === targetIndex)
        return previousQuestions

      const reorderedQuestions = [...previousQuestions]
      const [movedQuestion] = reorderedQuestions.splice(draggedQuestionIndex, 1)
      reorderedQuestions.splice(targetIndex, 0, movedQuestion)
      return reorderedQuestions.map((question, questionIndex) => ({
        ...question,
        pos: questionIndex + 1,
      }))
    })
    setDraggedQuestionIndex(null)
  }

  async function handleCreateExam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || questions.length === 0) return
    try {
      await examApi.createExam({
        title: title.trim(),
        description: description.trim(),
        tags,
        questions: questions.map((question, index) => ({
          id: question.id,
          position: index + 1,
          points: question.points,
        })),
      })
      setMessage("Exam created.")
      setTitle("")
      setTitleTags([])
      setDescription("")
      setManualTags([])
      setTagInput("")
    } catch {
      setMessage("Failed to create exam.")
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Create an exam</h1>
      <InitExam
        title={title}
        setTitle={handleTitleChange}
        tags={tags}
        removeTag={(tag) => {
          setTitleTags((current) =>
            current.filter(
              (item) => item.toLocaleLowerCase() !== tag.toLocaleLowerCase(),
            ),
          )
          setManualTags((current) =>
            current.filter(
              (item) => item.toLocaleLowerCase() !== tag.toLocaleLowerCase(),
            ),
          )
        }}
        tagInput={tagInput}
        setTagInput={setTagInput}
        addTag={handleAddTag}
        description={description}
        setDescription={setDescription}
        handleCreateExam={handleCreateExam}
      />
      <section>
        <p>Questions added: {questions.length}</p>
        {questions.map((question, index) => (
          <div
            key={question.id}
            draggable
            onDragStart={() => setDraggedQuestionIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDropQuestion(index)}
            onDragEnd={() => setDraggedQuestionIndex(null)}
            className="flex items-start gap-2 cursor-grab active:cursor-grabbing"
          >
            <GripVertical
              className="text-muted-foreground mt-1 shrink-0"
              aria-hidden="true"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Question {question.pos}:</strong> {question.title}
                </div>

                <DeleteQuestion
                  question={question}
                  onDelete={handleRemoveQuestion}
                />
              </div>

              <DisplayQuestion question={question} />
            </div>
          </div>
        ))}
      </section>
      <CreateQuestion onAdd={handleAddQuestion} />
      {message && <p role="status">{message}</p>}
    </main>
  )
}