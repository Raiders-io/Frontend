import api from "@/utils/lib/axios"
import type {
  AuthResponse,
  Credentials,
  LoginPayload,
  SignupPayload,
} from "@/utils/types/auth"

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/api/v1/auth/login", payload)
    return data
  },

  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(
      "/api/v1/auth/signup",
      payload,
    )
    return data
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/api/v1/auth/users/")
  },

  logout: async (): Promise<void> => {
    await api.post("/api/v1/account/logout")
  },

  fetchUserByIds: async (): Promise<Credentials[]> => {
    /**
     * @deprecated Placeholder temporaire : n'appelle plus l'API.
     * Retourne des données factices. À remplacer ou supprimer.
     */
    console.warn("[DEPRECATED] fetchUserByIds est un placeholder et retourne des données factices.")
    return [
      { id: "placeholder-1", email: "placeholder1@example.com" },
      { id: "placeholder-2", email: "placeholder2@example.com" },
    ]
  },
}
