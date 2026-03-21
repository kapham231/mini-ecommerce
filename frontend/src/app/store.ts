import { configureStore } from '@reduxjs/toolkit'
import authReducer from '~/features/auth/authSlice'
import type { AuthState } from '~/features/auth/authSlice'
import { readAuthFromStorage } from '~/lib/authStorage'

const preloaded = readAuthFromStorage()

const preloadedAuth: AuthState | undefined = preloaded
  ? {
      user: preloaded.user,
      accessToken: preloaded.accessToken,
      isAuthenticated: true
    }
  : undefined

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  preloadedState: preloadedAuth !== undefined ? { auth: preloadedAuth } : undefined
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
