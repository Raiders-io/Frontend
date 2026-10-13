import axios from "axios"
import { useAuthStore } from "@/utils/stores/auth_store"

export const baseURL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: baseURL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
