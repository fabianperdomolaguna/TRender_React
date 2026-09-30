import { Link, useNavigate } from '@tanstack/react-router'
import { clearSession, useIsAdmin, useSession } from '@auth/session'
import type { User } from '@api/types'

interface Item {
  to: string
  icon: string
  label: string
  visible: (user: User) => boolean
}

const ITEMS: Item[] = [
  { to: '/home', icon: 'bi-house-door', label: 'Inicio', visible: () => true },
  {
    to: '/cursos',
    icon: 'bi-journal-bookmark',
    label: 'Cursos',
    visible: (u) => u.role === 'Administrador' || u.role === 'Estudiante' || u.role === 'Vendedor',
  },
  {
    to: '/ventas',
    icon: 'bi-cart-plus',
    label: 'Venta de Cursos',
    visible: (u) => u.role === 'Administrador' || u.role === 'Vendedor',
  },
  { to: '/usuarios', icon: 'bi-people', label: 'Usuarios', visible: (u) => u.role === 'Administrador' },
  { to: '/roles', icon: 'bi-shield-lock', label: 'Roles', visible: (u) => u.role === 'Administrador' },
]

export function Sidebar() {
  const user = useSession()
  const isAdmin = useIsAdmin()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const handleLogout = () => {
    clearSession()
    void navigate({ to: '/login' })
  }

  return (
    <nav className="sidebar bg-dark text-white flex-shrink-0 p-3 d-none d-md-block" style={{ width: 250 }}>
      <Link to="/home" className="d-flex align-items-center gap-2 text-white text-decoration-none mb-4">
        <img src="/assets/TRender.png" alt="TRender" width={36} height={36} className="rounded" />
        <span className="fw-semibold">Trender University</span>
      </Link>

      <div className="d-flex align-items-center gap-2 mb-4 p-2 rounded bg-secondary bg-opacity-25">
        <img src="/assets/User1.jpg" alt="Usuario" width={40} height={40} className="rounded-circle" />
        <div className="small lh-sm overflow-hidden">
          <div className="fw-semibold text-truncate">{user.name}</div>
          <div className={user.role ? 'text-info' : 'text-secondary'}>
            {user.role || 'Sin rol asignado'}
          </div>
        </div>
      </div>

      <ul className="nav nav-pills flex-column gap-1">
        {ITEMS.filter((item) => item.visible(user)).map((item) => (
          <li key={item.to} className="nav-item">
            <Link to={item.to} className="nav-link text-white d-flex align-items-center gap-2" activeProps={{ className: 'nav-link text-white d-flex align-items-center gap-2 active' }}>
              <i className={`bi ${item.icon}`} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="border-secondary" />
      {isAdmin && (
        <p className="small text-secondary px-2">Sesión de administrador</p>
      )}
      <button type="button" className="btn btn-outline-danger w-100" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-1" /> LogOut
      </button>
    </nav>
  )
}
