import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { listUsers } from '@api/endpoints'
import type { User } from '@api/types'
import { showError } from '@utils/alerts'

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((err) => showError('No fue posible cargar los usuarios', err instanceof Error ? err.message : undefined))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <h1 className="h3 mb-3">Gestor de Usuarios y Roles</h1>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Indice</th>
                <th className="text-center">Nombre</th>
                <th className="text-center">Correo</th>
                <th className="text-center">Rol</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Cargando…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No hay usuarios para mostrar
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{user.name}</td>
                    <td className="text-center">{user.email}</td>
                    <td className="text-center">
                      {user.role ? (
                        <span className="badge bg-info text-dark">{user.role}</span>
                      ) : (
                        <span className="badge bg-secondary">Sin rol</span>
                      )}
                    </td>
                    <td className="text-center">
                      {user.status ? (
                        <span className={`badge ${user.status === 'Activo' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {user.status}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Sin estado</span>
                      )}
                    </td>
                    <td className="text-center">
                      <Link to="/usuarios/$usuarioId/editar" params={{ usuarioId: user.id }}>
                        <button type="button" className="btn btn-sm btn-outline-primary" title="Editar">
                          <i className="bi bi-pencil" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
