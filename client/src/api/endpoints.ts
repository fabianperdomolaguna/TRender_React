import { api } from '@api/client'
import type { AuthResponse, Course, Role, Sale, SaleInput, Subject, User } from './types'

export function login(email: string, password: string) {
  return api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } })
}

export function register(name: string, email: string, password: string) {
  return api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  })
}

export function getCurrentUser() {
  return api<User>('/auth/me')
}

export const listCourses = () => api<Course[]>('/courses')
export const listActiveCourses = () => api<Course[]>('/courses/active')
export const getCourse = (id: string) => api<Course>(`/courses/${id}`)

export function createCourse(data: Omit<Course, 'id'>) {
  return api<Course>('/courses', { method: 'POST', body: data })
}

export function updateCourse(id: string, data: Omit<Course, 'id'>) {
  return api<Course>(`/courses/${id}`, { method: 'PUT', body: data })
}

export function deleteCourse(id: string) {
  return api<{ deleted: boolean }>(`/courses/${id}`, { method: 'DELETE' })
}

export const listRoles = () => api<Role[]>('/roles')
export const getRole = (id: string) => api<Role>(`/roles/${id}`)

export function createRole(name: string) {
  return api<Role>('/roles', { method: 'POST', body: { name } })
}

export function updateRole(id: string, name: string) {
  return api<Role>(`/roles/${id}`, { method: 'PUT', body: { name } })
}

export function deleteRole(id: string) {
  return api<{ deleted: boolean }>(`/roles/${id}`, { method: 'DELETE' })
}

export const listUsers = () => api<User[]>('/users')
export const getUser = (id: string) => api<User>(`/users/${id}`)

export function updateUser(id: string, data: { name?: string; role?: string; status?: string }) {
  return api<User>(`/users/${id}`, { method: 'PUT', body: data })
}

export const listActiveSubjects = () => api<Subject[]>('/subjects/active')

export function listSales(params?: { q?: string }) {
  const query = params?.q ? `?q=${encodeURIComponent(params.q)}` : ''
  return api<Sale[]>(`/sales${query}`)
}

export const getSale = (id: string) => api<Sale>(`/sales/${id}`)
export const getNextSaleNumber = () => api<{ saleNumber: string }>('/sales/sequence')

export function createSale(data: SaleInput) {
  return api<Sale>('/sales', { method: 'POST', body: data })
}

export function updateSale(id: string, data: SaleInput) {
  return api<Sale>(`/sales/${id}`, { method: 'PUT', body: data })
}

export function deleteSale(id: string) {
  return api<{ deleted: boolean }>(`/sales/${id}`, { method: 'DELETE' })
}
