import axios from 'axios'

export class ApiError extends Error {
  readonly status: number | undefined
  readonly code: string | undefined

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError<{ message?: string; code?: string }>(error)) {
    return new ApiError(
      error.response?.data.message ?? error.message,
      error.response?.status,
      error.response?.data.code,
    )
  }

  return error instanceof ApiError
    ? error
    : new ApiError('An unexpected error occurred.')
}