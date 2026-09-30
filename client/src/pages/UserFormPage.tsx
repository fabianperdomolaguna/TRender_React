import { useEffect, useState, type SubmitEvent } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { getUser, updateUser } from '@api/endpoints'
import { ROLES, USER_STATUS } from '../constants'
import { showError, success } from '@utils/alerts'

export function UserFormPage() {
  const { usuarioId } = useParams({ strict: false })
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getUser(usuarioId as string)
      .then((user) => {
        setName(user.name)
        setRole(user.role ?? '')
        setStatus(user.status ?? '')
      })
      .catch((err) => showError('No fue posible cargar el usuario', err instanceof Error ? err.message : undefined))
      .finally(() => setLoading(false))
  }, [usuarioId])

  const handleUpdate = async (event: SubmitEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateUser(usuarioId as string, { role, status })
      await success('Usuario modificado de manera exitosa')
      await navigate({ to: '/usuarios' })
    } catch (err) {
      void showError('No fue posible actualizar el usuario', err instanceof Error ? err.message : undefined)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border" role="status" aria-hidden="true" />
      </div>
    )
  }

  return (
    <section className="box-form">
      <h1 className="h3 text-center mb-4">Editar Usuario</h1>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={(e) => void handleUpdate(e)}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input className="form-control text-center" type="text" value={name} readOnly disabled />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Rol
              </label>
              <select id="role" className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Seleccionar</option>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="form-label">
                Estado
              </label>
              <select id="status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Seleccionar</option>
                {USER_STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success flex-grow-1" disabled={saving}>
                {saving && (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                )}
                Actualizar
              </button>
              <Link to="/usuarios">
                <button type="button" className="btn btn-outline-danger">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
