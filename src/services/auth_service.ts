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

	deleteAccount: async (): Promise<void> => {
		await api.delete('/api/v1/auth/users/')
	},

	logout: async (): Promise<void> => {
		await api.post('/api/v1/account/logout')
	},

	oauthLogin: async (provider: string): Promise<AuthResponse> => {
		const { data } = await api.get<AuthResponse>(`/api/v1/auth/${provider}/redirect`)
		return data
	},
}
