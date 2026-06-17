import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '~/types/auth'

export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isBootstrapped: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isBootstrapped: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setBootstrapped: (state, action: PayloadAction<boolean>) => {
      state.isBootstrapped = action.payload
    }
  }
})

export const { setCredentials, logout, setBootstrapped } = authSlice.actions
export default authSlice.reducer
