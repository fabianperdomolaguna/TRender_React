import { useSyncExternalStore } from 'react'
import { getCurrentUser } from '@api/endpoints'
import type { User } from '@api/types'

const TOKEN_KEY = 'trender_token'

let currentUser: User | null = null
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) {
    listener()
  }
}

export const session = {
  get: () => currentUser,
  set(next: User | null) {
    currentUser = next
    notify()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function setSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  session.set(user)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  session.set(null)
}

export async function hydrateSession(): Promise<void> {
  if (!localStorage.getItem(TOKEN_KEY) || session.get()) {
    return
  }
  try {
    session.set(await getCurrentUser())
  } catch {
    clearSession()
  }
}

export function useSession(): User | null {
  return useSyncExternalStore(session.subscribe, session.get, () => null)
}

export function useIsAdmin(): boolean {
  const user = useSession()
  return user?.role === 'Administrador'
}
