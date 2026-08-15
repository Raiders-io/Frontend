import axios from 'axios'
import { useAuthStore } from '@/utils/stores/auth_store'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? 'https://localhost:4443/',
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token)
		config.headers.Authorization = `Bearer ${token}`
	return config
})

export default api