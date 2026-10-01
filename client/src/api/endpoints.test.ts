import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@api/client'
import {
  createSale,
  deleteRole,
  listSales,
  listActiveCourses,
  login,
  updateCourse,
} from '@api/endpoints'

vi.mock('@api/client', () => ({
  api: vi.fn(),
}))

const apiMock = vi.mocked(api)

beforeEach(() => {
  apiMock.mockReset()
})

describe('endpoints', () => {
  it('login llama a /auth/login con POST y credenciales', () => {
    login('ana@ejemplo.com', '123456')

    expect(apiMock).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: { email: 'ana@ejemplo.com', password: '123456' },
    })
  })

  it('listActiveCourses llama a /courses/active sin método explícito', () => {
    listActiveCourses()

    expect(apiMock).toHaveBeenCalledWith('/courses/active')
  })

  it('updateCourse usa PUT con el id en la ruta', () => {
    const course = {
      course: 'React desde cero',
      subject: 'Web',
      instructor: 'Fabian',
      cost: 150000,
      status: 'Activo',
    }
    updateCourse('abc123', course)

    expect(apiMock).toHaveBeenCalledWith('/courses/abc123', {
      method: 'PUT',
      body: course,
    })
  })

  it('deleteRole usa DELETE con el id en la ruta', () => {
    deleteRole('role1')

    expect(apiMock).toHaveBeenCalledWith('/roles/role1', { method: 'DELETE' })
  })

  it('listSales agrega el query de búsqueda codificado', () => {
    listSales({ q: 'ana perez' })

    expect(apiMock).toHaveBeenCalledWith('/sales?q=ana%20perez')
  })

  it('listSales sin query no agrega parámetros', () => {
    listSales()

    expect(apiMock).toHaveBeenCalledWith('/sales')
  })

  it('createSale llama a /sales con POST', () => {
    const sale = {
      clientName: 'Juan Client',
      clientIdentity: '123456789',
      rows: [
        { course: 'React desde cero', subject: 'Web', quantity: 1, price: 150000, total: 150000 },
      ],
    }
    createSale(sale)

    expect(apiMock).toHaveBeenCalledWith('/sales', { method: 'POST', body: sale })
  })
})
