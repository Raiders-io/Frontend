import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/utils/types/auth'

interface AuthState {
	user: User | null
	token: string | null
	setAuth: (user: User | null, token: string | null) => void
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
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ user: state.user, token: state.token }),
		},
	),
)
