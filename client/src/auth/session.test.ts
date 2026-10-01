import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@api/types'

vi.mock('@api/endpoints', () => ({
  getCurrentUser: vi.fn(),
}))

import { getCurrentUser } from '@api/endpoints'
import { clearSession, hydrateSession, session, setSession } from '@auth/session'

const TOKEN_KEY = 'trender_token'

const user: User = {
  id: '1',
  name: 'Ana Perez',
  email: 'ana@ejemplo.com',
  role: 'Administrador',
  status: 'Activo',
}

const getCurrentUserMock = vi.mocked(getCurrentUser)

beforeEach(() => {
  localStorage.clear()
  getCurrentUserMock.mockReset()
  session.set(null)
})

describe('session store', () => {
  it('inicia sin usuario', () => {
    expect(session.get()).toBeNull()
  })

  it('setSession guarda el token y el usuario', () => {
    setSession('token-123', user)

    expect(localStorage.getItem(TOKEN_KEY)).toBe('token-123')
    expect(session.get()).toEqual(user)
  })

  it('clearSession borra el token y el usuario', () => {
    setSession('token-123', user)

    clearSession()

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(session.get()).toBeNull()
  })

  it('notifica a los suscriptores al cambiar la sesión', () => {
    const listener = vi.fn()
    const unsubscribe = session.subscribe(listener)

    session.set(user)

    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    session.set(null)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe('hydrateSession', () => {
  it('no llama a la API cuando no hay token', async () => {
    await hydrateSession()

    expect(getCurrentUserMock).not.toHaveBeenCalled()
    expect(session.get()).toBeNull()
  })

  it('no llama a la API cuando ya hay un usuario en memoria', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-123')
    session.set(user)

    await hydrateSession()

    expect(getCurrentUserMock).not.toHaveBeenCalled()
  })

  it('carga el usuario cuando hay token', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-123')
    getCurrentUserMock.mockResolvedValue(user)

    await hydrateSession()

    expect(session.get()).toEqual(user)
  })

  it('limpia la sesión cuando la API falla', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-123')
    getCurrentUserMock.mockRejectedValue(new Error('401'))

    await hydrateSession()

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(session.get()).toBeNull()
  })
})
