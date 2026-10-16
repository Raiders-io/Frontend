import type { Lesson, Tag } from "@/utils/types/lesson"
import type { FileObject } from "./types/object"

export const mockTag: Tag[] = [
  {
    id: 1,
    name: "Math",
  },
  {
    id: 2,
    name: "Science",
  },
  {
    id: 3,
    name: "History",
  },
]

export const mockFiles: { filename: string }[] = [
  { filename: "File 1" },
  { filename: "File 2" },
  { filename: "File 3" },
]

export const mockLesson: Lesson[] = [
  {
    title: "Sample Lesson 1",
    description: "Hello here is some desctiption",
    UUID: "uuid-1",
    slug: "sample-lesson-1",
    authorId: "dam-03",
    tags: mockTag,
    author: { username: "dam", id: "dam-03" }
  },
  {
    title: "Sample Lesson 2",
    description: "Hello here is some veeeeeeeee rrryyyyyya yyyyyyyyy looooooa oooooooooooooooo oooooooooooog desctiption",
    UUID: "uuid-2",
    slug: "sample-lesson-2",
    authorId: "dam-03",
    tags: mockTag,
    author: { username: "dam", id: "dam-03" }

  },
  {
    title: "Sample Lesson 3",
    UUID: "uuid-3",
    slug: "sample-lesson-3",
    authorId: "enz-03",
    tags: mockTag,
    author: { username: "enz", id: "enz-03" }

  },
  {
    title: "Sample Lesson 4",
    UUID: "uuid-4",
    slug: "sample-lesson-4",
    authorId: "enz-03",
    tags: mockTag,
    author: { username: "enz", id: "enz-03" }

  }
]

export const mockObjFile: FileObject[] = [
  {
    name: 'Carrote'
  },
  {
    name: 'potato'
  },
  {
    name: 'Apple'
  },
  {
    name: 'Orange'
  },
  {
    name: 'Grape'
  },
  {
    name: 'Berry'
  },
]
