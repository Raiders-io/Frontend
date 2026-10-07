import axios from 'axios'
import { useAuthStore } from '@/utils/stores/auth_store'

const api = axios.create({
	baseURL: 'http://localhost:3333',
	withCredentials: true,
	timeout: 3000,
	transitional: {
		clarifyTimeoutError: true,
	},
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token)
		config.headers.Authorization = `Bearer ${token}`
	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			axios.isAxiosError(error) &&
			(error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED')
		) {
			error.message = 'Request timeout'
		}
		return Promise.reject(error)
	},
)

export default api