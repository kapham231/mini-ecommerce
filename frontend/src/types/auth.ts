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

export function isAuthResponse(data: RegisterSuccessResponse): data is AuthResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'accessToken' in data &&
    'user' in data &&
    typeof (data as AuthResponse).accessToken === 'string'
  )
}
