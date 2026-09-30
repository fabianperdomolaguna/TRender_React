import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { login } from '@api/endpoints'
import { setSession } from '@auth/session'
import { showError } from '@utils/alerts'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await login(email.trim(), password)
      setSession(response.access_token, response.user)
      await navigate({ to: '/home' })
    } catch (err) {
      void showError(
        'Usuario o contraseña inválidos',
        err instanceof Error ? err.message : undefined,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow-sm box-form">
        <div className="card-body p-4">
          <h3 className="text-center mb-1">
            <strong>TRender University</strong>
          </h3>
          <p className="text-muted text-center mb-4">
            Aquí encontrarás los mejores cursos que te ayudarán en tu crecimiento profesional
          </p>
          <form onSubmit={(e) => void handleSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Ingresa tu correo"
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
                placeholder="Ingresa tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline-success w-100" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              )}
              ACCEDER
            </button>
          </form>
          <hr />
          <div className="text-center">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="fw-semibold">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
