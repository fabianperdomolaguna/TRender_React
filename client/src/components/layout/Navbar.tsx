import { Link, useNavigate } from '@tanstack/react-router'
import { clearSession, useSession } from '@auth/session'

interface Props {
  onToggleSidebar: () => void
}

export function Navbar({ onToggleSidebar }: Props) {
  const user = useSession()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearSession()
    void navigate({ to: '/login' })
  }

  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-3 py-2 sticky-top">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm d-inline-block"
        onClick={onToggleSidebar}
        aria-label="Alternar menú"
      >
        <i className="bi bi-list" />
      </button>

      <Link to="/home" className="navbar-brand ms-2 d-none d-sm-inline">
        <img src="/assets/TRender.png" alt="" width={24} height={24} className="me-1" />
        TRender
      </Link>

      <div className="ms-auto d-flex align-items-center gap-2">
        {user ? (
          <>
            <span className="small text-muted d-none d-md-inline">
              {user.name} {user.role ? `· ${user.role}` : ''}
            </span>
            <button type="button" className="btn btn-danger btn-sm" onClick={handleLogout}>
              LogOut
            </button>
          </>
        ) : (
          <Link to="/login">
            <button type="button" className="btn btn-dark btn-sm">
              <i className="bi bi-box-arrow-in-right me-1" /> LogIn
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}
