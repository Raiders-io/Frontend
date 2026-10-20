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
    title: "Introduction to C++",
    description:
      "Learn the fundamentals of C++, including variables, functions, classes, references, and memory management. This lesson includes practical examples and exercises for beginners.",
    UUID: "uuid-1",
    slug: "introduction-to-cpp",
    authorId: "dam-03",
    author: { username: "dam", id: "dam-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-09-12T10:30:00.000Z",
    updatedAt: "2026-09-15T14:20:00.000Z",
  },
  {
    title: "Understanding Docker and Containers",
    description:
      "A practical introduction to Docker, container images, volumes, networks, and Docker Compose. Build a complete development environment using multiple interconnected services.",
    UUID: "uuid-2",
    slug: "understanding-docker-containers",
    authorId: "dam-03",
    author: { username: "dam", id: "dam-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-09-18T08:15:00.000Z",
    updatedAt: "2026-10-01T16:45:00.000Z",
  },
  {
    title: "Advanced Memory Management in C++",
    description:
      "Explore pointers, references, dynamic allocation, RAII, smart pointers, and common memory-related bugs. Includes code examples demonstrating ownership and lifetime management.",
    UUID: "uuid-3",
    slug: "advanced-memory-management-cpp",
    authorId: "enz-03",
    author: { username: "enz", id: "enz-03" },
    tags: mockTag,
    isPrivate: true,
    createdAt: "2026-10-02T12:00:00.000Z",
    updatedAt: "2026-10-10T09:30:00.000Z",
  },
  {
    title: "Building REST APIs with Node.js",
    description:
      "Learn how to design and implement REST APIs with Node.js and TypeScript. Covers routing, request validation, error handling, authentication, and database integration.",
    UUID: "uuid-4",
    slug: "building-rest-apis-nodejs",
    authorId: "enz-03",
    author: { username: "enz", id: "enz-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-08-20T11:00:00.000Z",
    updatedAt: "2026-09-05T17:10:00.000Z",
  },
  {
    title: "Git Branching and Collaboration",
    description:
      "Master the Git workflow with branches, merges, rebases, conflict resolution, and pull requests. Understand how to collaborate effectively on team projects without losing work.",
    UUID: "uuid-5",
    slug: "git-branching-collaboration",
    authorId: "luc-03",
    author: { username: "luc", id: "luc-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-07-14T09:00:00.000Z",
    updatedAt: "2026-07-14T09:00:00.000Z",
  },
  {
    title: "Linux Command Line Essentials",
    description:
      "An introduction to navigating Linux systems, manipulating files, managing processes, handling permissions, and writing shell scripts. Suitable for developers who want to become more comfortable with the terminal.",
    UUID: "uuid-6",
    slug: "linux-command-line-essentials",
    authorId: "mar-03",
    author: { username: "mar", id: "mar-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-09-22T15:30:00.000Z",
    updatedAt: "2026-10-03T10:00:00.000Z",
  },
  {
    title: "React Hooks: From Basics to Custom Hooks",
    description:
      "Understand useState, useEffect, useContext, and useMemo, then learn to extract reusable logic into custom hooks. Includes examples of common mistakes and how to avoid unnecessary renders.",
    UUID: "uuid-7",
    slug: "react-hooks-basics-custom-hooks",
    authorId: "dam-03",
    author: { username: "dam", id: "dam-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-10-05T13:45:00.000Z",
    updatedAt: "2026-10-12T18:20:00.000Z",
  },
  {
    title: "Database Design and SQL Fundamentals",
    description:
      "Learn relational database design, primary and foreign keys, normalization, joins, indexes, and transactions. Practice writing SQL queries against a realistic example database.",
    UUID: "uuid-8",
    slug: "database-design-sql-fundamentals",
    authorId: "luc-03",
    author: { username: "luc", id: "luc-03" },
    tags: mockTag,
    isPrivate: true,
    createdAt: "2026-10-08T07:30:00.000Z",
    updatedAt: "2026-10-16T11:15:00.000Z",
  },
  {
    title: "Pointers Explained with Visual Examples",
    description:
      "A visual guide to pointers, addresses, dereferencing, arrays, and pointer arithmetic. Start with simple examples before exploring more complex relationships between pointers and memory.",
    UUID: "uuid-9",
    slug: "pointers-visual-examples",
    authorId: "enz-03",
    author: { username: "enz", id: "enz-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-08-02T14:00:00.000Z",
    updatedAt: "2026-08-18T09:45:00.000Z",
  },
  {
    title: "A Very Long Lesson Title to Test Card Layouts and Text Wrapping Across Different Screen Sizes",
    description:
      "This lesson is specifically designed to test how your interface handles unusually long content. It contains enough text to check truncation, expanded descriptions, responsive layouts, and the alignment of cards with different content lengths. Use it to verify that your grid remains readable on mobile, tablet, and desktop screens.",
    UUID: "uuid-10",
    slug: "very-long-lesson-title-layout-testing",
    authorId: "mar-03",
    author: { username: "mar", id: "mar-03" },
    tags: mockTag,
    isPrivate: false,
    createdAt: "2026-10-17T20:00:00.000Z",
    updatedAt: "2026-10-19T08:30:00.000Z",
  },
  {
    title: "Empty Description Test",
    description: "",
    UUID: "uuid-11",
    slug: "empty-description-test",
    authorId: "luc-03",
    author: { username: "luc", id: "luc-03" },
    tags: [],
    isPrivate: false,
    createdAt: "2026-10-19T12:00:00.000Z",
  },
  {
    title: "Work in Progress",
    UUID: "uuid-12",
    slug: "work-in-progress",
    authorId: "mar-03",
    author: { username: "mar", id: "mar-03" },
    tags: [],
    isPrivate: true,
    createdAt: "2026-10-20T08:00:00.000Z",
  },
];

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
