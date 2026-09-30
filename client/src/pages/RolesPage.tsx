import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { deleteRole, listRoles } from '@api/endpoints'
import type { Role } from '@api/types'
import { confirmDialog, showError, success } from '@utils/alerts'

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setRoles(await listRoles())
    } catch (err) {
      void showError('No fue posible cargar los roles', err instanceof Error ? err.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleDelete = async (role: Role) => {
    if (!(await confirmDialog(`¿De verdad quieres eliminar el rol "${role.name}"?`))) {
      return
    }
    try {
      await deleteRole(role.id)
      await success('Rol eliminado correctamente')
      await load()
    } catch (err) {
      void showError('No fue posible eliminar el rol', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0 me-auto">Gestor de Roles</h1>
        <div style={{ width: 240 }}>
          <input type="text" className="form-control" placeholder="Nombre" disabled />
        </div>
        <Link to="/roles/nuevo">
          <button type="button" className="btn btn-success">
            <i className="bi bi-plus-lg me-1" /> Agregar Rol
          </button>
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Indice</th>
                <th className="text-center">Nombre</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Cargando…
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No hay roles para mostrar
                  </td>
                </tr>
              ) : (
                roles.map((role, index) => (
                  <tr key={role.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{role.name}</td>
                    <td className="text-center">
                      <Link to="/roles/$rolId/editar" params={{ rolId: role.id }}>
                        <button type="button" className="btn btn-sm btn-outline-primary me-1" title="Editar">
                          <i className="bi bi-pencil" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar"
                        onClick={() => void handleDelete(role)}
                      >
                        <i className="bi bi-trash" />
                      </button>
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
