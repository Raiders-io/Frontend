export interface LoginPayload {
	email: string
	password: string
}

export interface SignupPayload {
	fullName: string
	email: string
	password: string
}

export interface User {
	id: string
	fullName: string
	email: string
}

export interface AuthResponse {
	data: {
		user: User
		token: string
	}
}