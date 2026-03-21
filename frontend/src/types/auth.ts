export type User = {
  id: string
  email: string
  name?: string
}

export type AuthResponse = {
  accessToken: string
  user: User
}

/** Backend may return only a message after register (no token). */
export type RegisterSuccessResponse = AuthResponse | { message?: string }
