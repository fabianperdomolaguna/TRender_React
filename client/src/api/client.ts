const API_URL: string = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'trender_token'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown
  headers?: Record<string, string>
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers } = options

  const requestHeaders: Record<string, string> = { ...headers }
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 401 && !path.startsWith('/auth/')) {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/login'
    throw new ApiError(401, 'Sesion expirada o invalida')
  }

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null)
    let detail = response.statusText
    if (
      errorBody &&
      typeof errorBody === 'object' &&
      'detail' in errorBody &&
      typeof (errorBody as { detail: unknown }).detail === 'string'
    ) {
      detail = (errorBody as { detail: string }).detail
    } else if (errorBody) {
      detail = JSON.stringify(errorBody)
    }
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}
