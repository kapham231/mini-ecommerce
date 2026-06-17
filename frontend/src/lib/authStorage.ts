import { STORAGE_LEGACY_ACCESS_TOKEN_KEY, STORAGE_USER_KEY } from './constants'
import type { User } from '~/types/auth'

export function saveUserToStorage(user: User) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
}

export function clearAuthStorage() {
  localStorage.removeItem(STORAGE_LEGACY_ACCESS_TOKEN_KEY)
  localStorage.removeItem('token')
  localStorage.removeItem(STORAGE_USER_KEY)
}

export function readUserFromStorage(): User | null {
  const rawUser = localStorage.getItem(STORAGE_USER_KEY)
  if (!rawUser) return null

  try {
    return JSON.parse(rawUser) as User
  } catch {
    clearAuthStorage()
    return null
  }
}
