import { axiosInstance } from '~/lib/axios'
import type { AuthResponse } from '~/types/auth'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

function toAuthUser(user: {
  id: number | string
  email: string
  name?: string
}): AuthResponse['user'] {
  return {
    id: String(user.id),
    email: user.email,
    name: user.name
  }
}

/**
 * POST /api/auth/login
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload)
  return {
    accessToken: data.accessToken,
    user: toAuthUser(data.user)
  }
}

/**
 * POST /api/auth/register
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload)
  return {
    accessToken: data.accessToken,
    user: toAuthUser(data.user)
  }
}
