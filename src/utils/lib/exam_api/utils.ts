import type { BackendQuestion } from "@/utils/lib/exam_api/types"
import type { BackendError} from "@/utils/lib/exam_api/types"
import type { Question } from "@/utils/types/exam"

/**
 * Converts a question from the backend API shape into the shape used by React.
 * Position and points are passed separately because they depend on the exam
 * that contains the question, not on the question's content itself.
 */
export function toQuestion(
  question: BackendQuestion,
  position: number,
  points: number
): Question {
  const goodAnswers = asAnswers(question.goodAnswers)
  const badAnswers = asAnswers(question.badAnswers)
  const type: Question["type"] = getQuestionType(question)

  return {
    id: question.id,
    pos: position,
    title: question.title,
    type,
    points: points,
    starterCode: type === "c_function" ? question.starterCode ?? undefined : undefined,
    referenceCode: type === "c_function" ? question.referenceCode ?? undefined : undefined,
    answers: type === "written_answer" ? goodAnswers : undefined,
    choices:
      type === "multiple_choice"
        ? [
            ...goodAnswers.map((text, index) => ({
              id: `good-${index}`,
              text,
              isCorrect: true,
            })),
            ...badAnswers.map((text, index) => ({
              id: `bad-${index}`,
              text,
              isCorrect: false,
            })),
          ]
        : undefined,
  }
}

/**
 * Normalizes backend answer data into a string array.
 * The API may return an array, a JSON-encoded array, a plain string, or null.
 */
export function asAnswers(value: BackendQuestion["goodAnswers"]): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : [value]
    } catch {
      return [value]
    }
  }
  return []
}

/** Maps the backend question type name to the frontend Question type name. */
export function getQuestionType(question: BackendQuestion): Question["type"] {
    switch (question.questionType) {
        case "MCQ":
            return "multiple_choice"
        case "TEXT":
            return "written_answer"
        default:
            return "c_function"
}
}

/**
 * Throws when the response body has the backend's `{ error: string }` shape.
 * Otherwise it returns the body as the response type expected by the caller;
 * this check does not validate every field in that response.
 */
export function rejectBackendError<T>(responseBody: T | BackendError): T {
    if (responseBody !== null && typeof responseBody === "object" && "error" in responseBody)
        throw new Error(responseBody.error)
    else
        return responseBody as T
}
