import api from '@/utils/lib/axios'
import type { Lesson, LessonSearchParams, PaginatedLessonsResponse, Tag } from '@/utils/types/lesson'

export const lessonService = {
  getAllLessons: async (): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>('/api/v1/lessons')
    return data
  },

  getLessonBySlug: async (slug: string): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/api/v1/lessons/${slug}`)
    return data
  },

  getLessonById: async (id: number): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/api/v1/lessons/${id}`)
    return data
  },

  createLesson: async (lesson: Partial<Lesson>): Promise<Lesson> => {
    const { data } = await api.post<Lesson>('/api/v1/lessons', lesson)
    return data
  },

  updateLesson: async (id: string, lesson: Partial<Lesson>): Promise<Lesson> => {
    const { data } = await api.put<Lesson>(`/api/v1/lessons/${id}`, lesson)
    return data
  },

  deleteLesson: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/lessons/${id}`)
  },

  searchLessons: async (params: LessonSearchParams = {}): Promise<PaginatedLessonsResponse> => {
    const { data } = await api.get<PaginatedLessonsResponse>('/api/v1/search', {
      params,
      paramsSerializer: {
        indexes: null,
      },
    })
    return data
  },

  getAllTags: async (): Promise<Tag[]> => {
    const { data } = await api.get<Tag[]>('/api/v1/lessons/tags')
    return data
  },
}