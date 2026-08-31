export type QuestionType = 
{
  id: string
  text: string
  type: 'multiple_choice' | 'exact_answer'
  answer?: string
  choices?: string[]
}

export type ExamType = 
{
  name: string
  description?: string
  questions: QuestionType[]
}
