import api from "@/utils/lib/axios"
import type {
  Lesson,
  LessonSearchParams,
  PaginatedLessonsResponse,
  Tag,
  file,
} from "@/utils/types/lesson"
import type {
  CreateLessonPayload,
  CreateLessonResponse,
  FileOperationPayload,
  UpdateLessonPayload,
} from "@/utils/schema/lessonSchema" // Adjust path to your schemas file

export const lessonService = {

  getAllLessons: async (): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>("/api/v1/lessons")
    return data
  },

  getLessonByAuthor: async (author: string): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>(`/api/v1/lessons/cnt/${author}`)
    return data
  },

  getLessonByAuthorAndContent: async (author: string, content: string): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/api/v1/lessons/cnt/${author}/${content}`)
    return data
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/api/v1/lessons/byId/${id}`)
    return data
  },

  createLesson: async (payload: CreateLessonPayload): Promise<CreateLessonResponse> => {
    const { data } = await api.post<CreateLessonResponse>("/api/v1/lessons", payload)
    return data
  },

  updateLessonById: async (id: string, payload: UpdateLessonPayload): Promise<string> => {
    const { data } = await api.put<string>(`/api/v1/lessons/byId/${id}`, payload)
    return data
  },

  updateLessonByAuthorAndContent: async (
    author: string, 
    content: string, 
    payload: UpdateLessonPayload
  ): Promise<string> => {
    const { data } = await api.put<string>(`/api/v1/lessons/cnt/${author}/${content}`, payload)
    return data
  },

  deleteLessonById: async (id: string): Promise<string> => {
    const { data } = await api.delete<string>(`/api/v1/lessons/byId/${id}`)
    return data
  },

  deleteLessonByAuthorAndContent: async (author: string, content: string): Promise<string> => {
    const { data } = await api.delete<string>(`/api/v1/lessons/cnt/${author}/${content}`)
    return data
  },

  searchLessons: async (
    params: LessonSearchParams = {},
    signal?: AbortSignal,
  ): Promise<PaginatedLessonsResponse> => {
    const { data } = await api.get<PaginatedLessonsResponse>("/api/v1/search", {
      params,
      paramsSerializer: {
        indexes: null, // Ensures tags array is serialized correctly (e.g., tags=a&tags=b)
      },
      signal,
    })
    return data
  },

  getAllTags: async (): Promise<Tag[]> => {
    const { data } = await api.get<Tag[]>("/api/v1/lessons/tags")
    return data
  },

  // ==========================================
  // Files (Relations only)
  // ==========================================

  getFilesByLessonId: async (lessonId: string): Promise<file[]> => {
    const { data } = await api.get<file[]>(`/api/v1/lessons/byId/${lessonId}/files`)
    return data
  },

  attachFilesToLesson: async (lessonId: string, payload: FileOperationPayload): Promise<unknown> => {
    const { data } = await api.post(`/api/v1/lessons/byId/${lessonId}/files`, payload)
    return data
  },

  detachFilesFromLesson: async (lessonId: string, payload: FileOperationPayload): Promise<unknown> => {
    // Axios requires the `data` property to send a body with a DELETE request
    const { data } = await api.delete(`/api/v1/lessons/byId/${lessonId}/files`, { 
      data: payload 
    })
    return data
  },

  getFileByLessonIdAndName: async (lessonId: string, filename: string): Promise<file> => {
    const { data } = await api.get<file>(`/api/v1/lessons/byId/${lessonId}/files/${filename}`)
    return data
  },

  getLessonsByFile: async (filename: string): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>(`/api/v1/lessons/files/${filename}`)
    return data
  },

  deleteFileByName: async (filename: string): Promise<unknown> => {
    const { data } = await api.delete(`/api/v1/lessons/files/${filename}`)
    return data
  },
}