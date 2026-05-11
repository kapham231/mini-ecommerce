import { axiosInstance } from '~/lib/axios'
import type { AuthResponse } from '~/types/auth'
import type { ApiEnvelope } from './types'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

type AuthResponseBody = {
  token?: string
  accessToken?: string
  user: {
    id: number | string
    email: string
    name?: string
    role?: 'USER' | 'ADMIN'
  }
}

function toAuthUser(user: {
  id: number | string
  email: string
  name?: string
  role?: 'USER' | 'ADMIN'
}): AuthResponse['user'] {
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role === 'ADMIN' ? 'ADMIN' : 'USER'
  }
}

function unwrapAuthBody(payload: AuthResponseBody | ApiEnvelope<AuthResponseBody>): AuthResponseBody {
  if ('data' in payload) {
    return payload.data
  }
  return payload
}

/**
 * POST /api/auth/login
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponseBody | ApiEnvelope<AuthResponseBody>>('/auth/login', payload)
  const body = unwrapAuthBody(response.data)
  const token = body.token ?? body.accessToken
  if (!token) {
    throw new Error('Thiếu token trong phản hồi đăng nhập')
  }
  return {
    token,
    user: toAuthUser(body.user)
  }
}

/**
 * POST /api/auth/register
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponseBody | ApiEnvelope<AuthResponseBody>>('/auth/register', payload)
  const body = unwrapAuthBody(response.data)
  const token = body.token ?? body.accessToken
  if (!token) {
    throw new Error('Thiếu token trong phản hồi đăng ký')
  }
  return {
    token,
    user: toAuthUser(body.user)
  }
}
