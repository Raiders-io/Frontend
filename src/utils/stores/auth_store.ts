import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Credentials } from "@/utils/types/auth"

interface AuthState {
  user: Credentials | null
  token: string | null
  setAuth: (user: Credentials | null, token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
