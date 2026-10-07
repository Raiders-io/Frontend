import axios from "axios"
import { toast } from 'sonner'
import { useAuthStore } from "@/utils/stores/auth_store"

export const baseURL = import.meta.env.VITE_API_URL

const api = axios.create({
	baseURL: baseURL,
	timeout: 10000,
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token) config.headers.Authorization = `Bearer ${token}`
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
		//Check if relevant
		else if (
			axios.isAxiosError(error) &&
			(error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED')
		) {
			error.message = 'Request timeout'
		}
		return Promise.reject(error)
	},
)

export default api
