import api from '@/utils/lib/axios'
import type { AuthResponse, LoginPayload, SignupPayload } from '@/utils/types/auth'

export const authService = {
	login: async (payload: LoginPayload): Promise<AuthResponse> => {
		const { data } = await api.post<AuthResponse>('/api/v1/auth/login', payload)
		return data
	},

	signup: async (payload: SignupPayload): Promise<AuthResponse> => {
		const { data } = await api.post<AuthResponse>('/api/v1/auth/signup', payload)
		return data
	},
}