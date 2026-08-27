import axios from 'axios'
import { useAuthStore } from '@/utils/stores/auth_store'
import i18next from 'i18next'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? 'https://localhost:4443/',
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token)
		config.headers.Authorization = i18next.t('bearerToken', 'Bearer {{token}}', { token })
	return config
})

export default api