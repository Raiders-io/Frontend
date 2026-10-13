export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  fullName: string
  email: string
  password: string
}

export interface Credentials {
  id: string
  email: string
}

export interface AuthResponse {
  data: {
    user: Credentials
    token: string
  }
}
