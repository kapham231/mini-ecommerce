export type User = {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN'
}

export type AuthResponse = {
  token: string
  user: User
}

export type RegisterSuccessResponse = AuthResponse | { message?: string }

export function isAuthResponse(data: RegisterSuccessResponse): data is AuthResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'token' in data &&
    'user' in data &&
    typeof (data as AuthResponse).token === 'string' &&
    typeof (data as AuthResponse).user?.role === 'string' &&
    ((data as AuthResponse).user.role === 'USER' || (data as AuthResponse).user.role === 'ADMIN')
  )
}
