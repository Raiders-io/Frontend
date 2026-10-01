import axios from 'axios'
import { useAuthStore } from '@/utils/stores/auth_store'

const api = axios.create({
	baseURL: 'http://localhost:3333',
	withCredentials: true,
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token)
		config.headers.Authorization = `Bearer ${token}`
	return config
})

export default api