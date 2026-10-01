import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, api } from '@api/client'

const TOKEN_KEY = 'trender_token'
const BASE_URL = 'http://api.test'

const realLocation = window.location
const locationStub = { href: realLocation.href }

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: locationStub,
  })
  locationStub.href = realLocation.href
})

afterEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: realLocation,
  })
})

function jsonResponse(body: unknown, status = 200, statusText = 'OK') {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: () => Promise.resolve(body),
  }
}

function errorResponse(status: number, statusText: string) {
  return {
    ok: false,
    status,
    statusText,
    json: () => Promise.reject(new Error('no json')),
  }
}

const fetchMock = vi.fn()

beforeEach(() => {
  localStorage.clear()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api()', () => {
  it('usa la URL base configurada', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))

    await api('/courses')

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/courses`,
      expect.anything(),
    )
  })

  it('no envía Authorization cuando no hay token', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))

    await api('/courses')

    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers.Authorization).toBeUndefined()
  })

  it('envía Authorization cuando hay token en localStorage', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-123')
    fetchMock.mockResolvedValue(jsonResponse([]))

    await api('/courses')

    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers.Authorization).toBe('Bearer token-123')
  })

  it('serializa el body y agrega Content-Type JSON', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))

    await api('/auth/login', {
      method: 'POST',
      body: { email: 'ana@ejemplo.com', password: '123456' },
    })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(`${BASE_URL}/auth/login`)
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(init.body).toBe(
      JSON.stringify({ email: 'ana@ejemplo.com', password: '123456' }),
    )
  })

  it('no envía Content-Type cuando no hay body', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))

    await api('/courses')

    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers['Content-Type']).toBeUndefined()
    expect(init.body).toBeUndefined()
  })

  it('devuelve el JSON en respuestas ok', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: '1' }))

    await expect(api('/courses/1')).resolves.toEqual({ id: '1' })
  })

  it('devuelve undefined en respuestas 204', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
      json: () => Promise.reject(new Error('no body')),
    })

    await expect(api('/users/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('lanza ApiError con el detail del body en errores', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: 'Ya existe un usuario con este email' }, 409, 'Conflict'),
    )

    const promise = api('/auth/register', { method: 'POST', body: {} })

    await expect(promise).rejects.toBeInstanceOf(ApiError)
    await expect(promise).rejects.toMatchObject({
      status: 409,
      message: 'Ya existe un usuario con este email',
    })
  })

  it('usa statusText cuando el body de error no es JSON', async () => {
    fetchMock.mockResolvedValue(errorResponse(500, 'Internal Server Error'))

    await expect(api('/courses')).rejects.toMatchObject({
      status: 500,
      message: 'Internal Server Error',
    })
  })

  it('lanza ApiError 401, limpia el token y redirige a /login cuando la sesión expira', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-viejo')
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Invalid Token' }, 401))

    await expect(api('/courses')).rejects.toMatchObject({
      status: 401,
      message: 'Sesion expirada o invalida',
    })
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(locationStub.href).toBe('/login')
  })

  it('en /auth no limpia el token ni lanza el error de sesión expirada', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: 'Incorrect email or password' }, 401),
    )

    await expect(api('/auth/login', { method: 'POST', body: {} })).rejects.toMatchObject({
      status: 401,
      message: 'Incorrect email or password',
    })
  })
})
