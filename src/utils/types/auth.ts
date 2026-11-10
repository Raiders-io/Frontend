export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  email: string
  password: string
  passwordConfirmation: string
}

export interface ChangePasswordPayload {
  password: string
  passwordConfirmation: string
}

export interface ChangeEmailPayload {
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

export interface User {
  id: string
  fullName: string
  email: string
}