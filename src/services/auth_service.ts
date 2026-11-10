import api from "@/utils/lib/axios"
import type {
  AuthResponse,
  ChangeEmailPayload,
  ChangePasswordPayload,
  Credentials,
  LoginPayload,
  SignupPayload,
  User,
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

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await api.patch("/api/v1/account/password", payload)
  },

  changeEmail: async (payload: ChangeEmailPayload): Promise<void> => {
    await api.patch("/api/v1/account/email", payload)
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/api/v1/auth/users/")
  },

  logout: async (): Promise<void> => {
    await api.post("/api/v1/account/logout")
  },

  fetchUsers: async (): Promise<User[]> => {
	const { data } = await api.get<{ data: User[] }>("/api/v1/auth/users")
	return data.data
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
