import api from '@/utils/lib/axios'
import type { Lesson } from '@/utils/types/lesson'

export const lessonService = {
  getAllLessons: async (): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>('/lessons')
    return data
  },

  getLessonBySlug: async (slug: string): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/lessons/${slug}`)
    return data
  },
  
  getLessonsByTags: async (tags: string[]): Promise<Lesson[]> => {
    const queryParams = tags.map((tag) => `tags=${encodeURIComponent(tag)}`).join('&')
    const { data } = await api.get<Lesson[]>(`/lessons/by-tags?${queryParams}`)
    return data
  },

  getLessonById: async (id: number): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/lessons/${id}`)
    return data
  },

  createLesson: async (lesson: Partial<Lesson>): Promise<Lesson> => {
    const { data } = await api.post<Lesson>('/lessons', lesson)
    return data
  },

  updateLesson: async (id: string, lesson: Partial<Lesson>): Promise<Lesson> => {
    const { data } = await api.put<Lesson>(`/lessons/${id}`, lesson)
    return data
  },

  deleteLesson: async (id: string): Promise<void> => {
    await api.delete(`/lessons/${id}`)
  },

  searchLessons: async (query: string): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>(`/search?query=${encodeURIComponent(query)}`)
    return data
  }
}