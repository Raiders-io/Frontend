import axios from "axios"
import { toast } from 'sonner'
import { useAuthStore } from "@/utils/stores/auth_store"
import i18next from 'i18next'

export const baseURL = import.meta.env.VITE_API_URL

const api = axios.create({
	baseURL: baseURL,
	timeout: 10000,
})

/* i18next-disable */
api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token) config.headers.Authorization = i18next.t('bearerToken', 'Bearer {{token}}', { token })
	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status
		if (status >= 500)
			toast.error(i18next.t('internalServerError', 'Internal server error'), { id: "server-error" })
		else if (!error.response)
			toast.error(i18next.t('cantJoinServer', 'Can\'t join server'), { id: "network-error" })
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
/* i18next-enable */

export default api
