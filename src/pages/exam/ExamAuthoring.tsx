import { CreateQuestion } from "@/pages/exam/Question"
import { DisplayQuestion } from "@/components/exam/DisplayQuestion"
import { DeleteQuestion } from "@/components/exam/DeleteQuestion"
import type { Question } from "@/utils/types/exam"
import { examApi, toQuestion } from "@/utils/lib/exam_api"
import { GripVertical } from "lucide-react"
import { useState } from "react"
import { InitExam } from "@/components/exam/InitExam"

export default function ExamAuthoring() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [draggedQuestionIndex, setDraggedQuestionIndex] = useState<
    number | null
  >(null)

  async function handleAddQuestion(question: Question) {
    try {
      const { data } = await examApi.createQuestion({
        title: question.text,
        questionType:
          question.type === "multiple_choice"
            ? "MCQ"
            : question.type === "exact_answer"
              ? "TEXT"
              : "DEFAULT",
        goodAnswers:
          question.type === "multiple_choice"
            ? (question.choices
                ?.filter((choice) => choice.isCorrect)
                .map((choice) => choice.text) ?? [])
            : (question.answers ?? []),
        badAnswers:
          question.choices
            ?.filter((choice) => !choice.isCorrect)
            .map((choice) => choice.text) ?? [],
        points: question.points,
      })
      const createdQuestion = toQuestion(data, questions.length + 1)
      setQuestions((previousQuestions) => [
        ...previousQuestions,
        { ...createdQuestion, points: question.points },
      ])
      setMessage("Question created.")
    } catch {
      setMessage("Failed to create question.")
    }
  }

  async function handleRemoveQuestion(question: Question) {
    try {
      await examApi.deleteQuestion(Number(question.id))
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
        questions: questions.map((question, index) => ({
          id: Number(question.id),
          position: index + 1,
          points: question.points,
        })),
      })
      setMessage("Exam created.")
      setTitle("")
    } catch {
      setMessage("Failed to create exam.")
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Exam Authoring</h1>
      <InitExam
        title={title}
        setTitle={setTitle}
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
                  <strong>Question {question.pos}:</strong> {question.text}
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
