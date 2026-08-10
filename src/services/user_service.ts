import api from '@/utils/lib/axios'
import type { User } from '@/utils/types/auth'

export const userService = {
	fetchUsers: async (): Promise<User[]> => {
		const { data } = await api.get<{ data: User[] }>('/api/auth/users')
		return data.data
	},
}
