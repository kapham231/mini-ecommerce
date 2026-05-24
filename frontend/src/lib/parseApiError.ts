import axios from 'axios'
import type { NavigateFunction } from 'react-router-dom'
import type { ErrorLocationState } from '~/pages/ErrorPage'

export type ApiErrorPayload = {
  success: false
  message: string
  statusCode: number
  details?: unknown
  timestamp?: string
}

const DEFAULT_MESSAGE = 'Đã có lỗi xảy ra. Vui lòng thử lại.'

function isApiErrorPayload(data: unknown): data is ApiErrorPayload {
  if (!data || typeof data !== 'object') return false
  const payload = data as Record<string, unknown>
  return payload.success === false && typeof payload.message === 'string' && typeof payload.statusCode === 'number'
}

export function parseApiError(error: unknown): { statusCode: number; message: string } {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (isApiErrorPayload(data)) {
      return { statusCode: data.statusCode, message: data.message }
    }
    if (typeof error.response?.status === 'number') {
      return {
        statusCode: error.response.status,
        message: error.message || DEFAULT_MESSAGE
      }
    }
  }

  if (error instanceof Error && error.message) {
    return { statusCode: 500, message: error.message }
  }

  return { statusCode: 500, message: DEFAULT_MESSAGE }
}

export function navigateToError(navigate: NavigateFunction, error: unknown, options?: { replace?: boolean }) {
  const { statusCode, message } = parseApiError(error)
  const state: ErrorLocationState = { statusCode, message }
  navigate('/error', { replace: options?.replace ?? false, state })
}
