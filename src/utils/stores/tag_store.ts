import { create } from "zustand"
import type { Tag } from "../types/lesson"
import { lessonService } from "@/services/lesson_service"

interface tagState {
  tags: Tag[]
  Error: Error | null
  loading: boolean
  isFetched: boolean
  fetchData: () => Promise<void>
  setTags: (tags: Tag[]) => void
}


export const useTagStore = create<tagState>() (set => ({
  tags: [],
  Error: null,
  loading: false,
  isFetched: false,
  fetchData: async () => {
    set({ loading: true, Error: null })
    try {
      const tags = await lessonService.getAllTags()
      if (tags?.length === 0) 
        throw new Error(`getAllTags returned ${typeof tags}, expected an array`)
      set({ tags })
    } catch (error) {
      set({ Error: error as Error })
    } finally {
      set({ loading: false, isFetched: true })
    }
  },
  setTags: (tags: Tag[]) => set({ tags }),
}))
