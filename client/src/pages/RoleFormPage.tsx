import { useEffect, useState, type SubmitEvent } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { createRole, getRole, updateRole } from '@api/endpoints'
import { showError, success } from '@utils/alerts'

export function RoleFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { rolId } = useParams({ strict: false })
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== 'edit' || !rolId) {
      return
    }
    getRole(rolId)
      .then((role) => setName(role.name))
      .catch((err) => showError('No fue posible cargar el rol', err instanceof Error ? err.message : undefined))
      .finally(() => setLoading(false))
  }, [mode, rolId])

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      void showError('Faltan campos por introducir')
      return
    }
    setSaving(true)
    try {
      if (mode === 'create') {
        await createRole(name.trim())
        await success('El rol fue añadido satisfactoriamente')
      } else {
        await updateRole(rolId as string, name.trim())
        await success('El rol fue actualizado satisfactoriamente')
      }
      await navigate({ to: '/roles' })
    } catch (err) {
      void showError('No fue posible guardar el rol', err instanceof Error ? err.message : undefined)
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
      <h3 className="text-center mb-4">{mode === 'create' ? 'Formulario Rol' : 'Editar Rol'}</h3>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Nombre del Rol
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-dark flex-grow-1" disabled={saving}>
                {saving && (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                )}
                Enviar
              </button>
              <Link to="/roles">
                <button type="button" className="btn btn-outline-dark">
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
