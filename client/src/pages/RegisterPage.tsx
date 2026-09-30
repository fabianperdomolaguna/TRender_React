import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { register } from '@api/endpoints'
import { setSession } from '@auth/session'
import { showError, success } from '@utils/alerts'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (password.length < 6) {
      void showError('La contraseña debe tener al menos 6 dígitos')
      return
    }
    setLoading(true)
    try {
      const response = await register(name.trim(), email.trim().toLowerCase(), password)
      setSession(response.access_token, response.user)
      await success('Usuario registrado de forma exitosa')
      await navigate({ to: '/home' })
    } catch (err) {
      void showError('No fue posible registrarse', err instanceof Error ? err.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow-sm box-form">
        <div className="card-body p-4">
          <h3 className="text-center mb-4">Registro</h3>
          <form onSubmit={(e) => void handleSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Ingrese su nombre completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Ingrese su correo"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Ingrese su contraseña con al menos 6 dígitos"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-dark flex-grow-1" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                )}
                Registrar
              </button>
              <Link to="/login">
                <button type="button" className="btn btn-outline-dark">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
