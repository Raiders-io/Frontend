import axios from 'axios'
import { toast } from 'sonner'
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

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status
		if (status >= 500)
			toast.error("Internal server error", { id: "server-error" })
		else if (!error.response)
			toast.error("Can't join server", { id: "network-error" })
		return Promise.reject(error)
	},
)

export default api