import { axiosInstance } from '~/lib/axios'
import type { AuthResponse, User } from '~/types/auth'
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

type AuthUserBody = {
  id: number | string
  email: string
  name?: string
  role?: 'USER' | 'ADMIN'
}

type AuthResponseBody = {
  user: AuthUserBody
}

function toAuthUser(user: AuthUserBody): User {
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
  return {
    user: toAuthUser(body.user)
  }
}

/**
 * POST /api/auth/register
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponseBody | ApiEnvelope<AuthResponseBody>>('/auth/register', payload)
  const body = unwrapAuthBody(response.data)
  return {
    user: toAuthUser(body.user)
  }
}

/**
 * GET /api/auth/me
 */
export async function getMe(): Promise<AuthResponse> {
  const response = await axiosInstance.get<ApiEnvelope<AuthResponseBody>>('/auth/me')
  return {
    user: toAuthUser(response.data.data.user)
  }
}

/**
 * POST /api/auth/logout
 */
export async function logoutRequest(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

/**
 * POST /api/auth/refresh
 */
export async function refreshSession(): Promise<AuthResponse> {
  const response = await axiosInstance.post<ApiEnvelope<AuthResponseBody>>('/auth/refresh')
  return {
    user: toAuthUser(response.data.data.user)
  }
}
