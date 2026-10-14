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
    UUID: "uuid-1",
    slug: "sample-lesson-1",
    authorId: "dam-03",
    tags: mockTag,
    author: "dam"
  },
  {
    title: "Sample Lesson 2",
    UUID: "uuid-2",
    slug: "sample-lesson-2",
    authorId: "dam-03",
    tags: mockTag,
    author: "dam"

  },
  {
    title: "Sample Lesson 3",
    UUID: "uuid-3",
    slug: "sample-lesson-3",
    authorId: "enz-03",
    tags: mockTag,
    author: "enz"

  },
  {
    title: "Sample Lesson 4",
    UUID: "uuid-4",
    slug: "sample-lesson-4",
    authorId: "enz-03",
    tags: mockTag,
    author: "enz"

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