export type Question = 
{
  id: string
  pos: number
  text: string
  type: 'multiple_choice' | 'exact_answer' | 'c_code'
  answer?: string
  answers?: string[]
  choices?: QuestionChoice[]
}

export type QuestionChoice =
{
  id: string
  text: string
  isCorrect: boolean
}

export type ExamType = 
{
  name: string
  description?: string
  questions: Question[]
}
