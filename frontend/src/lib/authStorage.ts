import { STORAGE_ACCESS_TOKEN_KEY, STORAGE_USER_KEY } from './constants'
import type { User } from '~/types/auth'

export function saveAuthToStorage(accessToken: string, user: User) {
  localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
}

export function clearAuthStorage() {
  localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)
  localStorage.removeItem(STORAGE_USER_KEY)
}

export function readAuthFromStorage(): { accessToken: string; user: User } | null {
  const token = localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)
  const rawUser = localStorage.getItem(STORAGE_USER_KEY)
  if (!token || !rawUser) return null
  try {
    const user = JSON.parse(rawUser) as User
    return { accessToken: token, user }
  } catch {
    clearAuthStorage()
    return null
  }
}
