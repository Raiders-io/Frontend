export interface file {
  name: string
  id: string
}

export interface Lesson {
  title: string
  UUID: string
  slug: string
  authorId: number
  isPrivate: boolean
  tags: string[]
  files: file[]
}