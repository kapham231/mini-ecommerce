export type User = {
  id: string
  email: string
  name?: string
}

export type AuthResponse = {
  accessToken: string
  user: User
}

export type RegisterSuccessResponse = AuthResponse | { message?: string }
