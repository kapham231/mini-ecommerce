import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { store } from '~/app/store'
import { logout } from '~/features/auth/authSlice'
import { clearCart } from '~/features/cart/cartSlice'
import { clearAuthStorage } from './authStorage'

const baseURL =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL
    : '/api'

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let isRefreshing = false
let refreshWaitQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processRefreshQueue(error: unknown | null) {
  refreshWaitQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }
    resolve(undefined)
  })
  refreshWaitQueue = []
}

function shouldSkipAuthRecovery(url: string) {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/me')
  )
}

function handleAuthFailure() {
  clearAuthStorage()
  store.dispatch(logout())
  store.dispatch(clearCart())
  if (!window.location.pathname.startsWith('/login')) {
    window.location.assign('/login')
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const url = originalRequest?.url ?? ''

    if (error.response?.status !== 401 || !originalRequest || shouldSkipAuthRecovery(url)) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      handleAuthFailure()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshWaitQueue.push({ resolve, reject })
      }).then(() => axiosInstance(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await axiosInstance.post('/auth/refresh')
      processRefreshQueue(null)
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      processRefreshQueue(refreshError)
      handleAuthFailure()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
