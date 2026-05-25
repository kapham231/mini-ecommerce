import { STORAGE_LEGACY_ACCESS_TOKEN_KEY, STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from './constants'
import type { User } from '~/types/auth'

export function saveAuthToStorage(token: string, user: User) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token)
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
}

export function clearAuthStorage() {
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_LEGACY_ACCESS_TOKEN_KEY)
  localStorage.removeItem(STORAGE_USER_KEY)
}

export function readAuthFromStorage(): { token: string; user: User } | null {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY) ?? localStorage.getItem(STORAGE_LEGACY_ACCESS_TOKEN_KEY)
  const rawUser = localStorage.getItem(STORAGE_USER_KEY)
  if (!token || !rawUser) return null
  try {
    const user = JSON.parse(rawUser) as User
    return { token, user }
  } catch {
    clearAuthStorage()
    return null
  }
}
