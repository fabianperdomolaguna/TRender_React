import {
  Outlet,
  Link,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { AppLayout } from '@components/layout/AppLayout'
import { hydrateSession, session } from '@auth/session'
import { HomePage } from '@pages/HomePage'
import { LoginPage } from '@pages/LoginPage'
import { RegisterPage } from '@pages/RegisterPage'
import { CoursesPage } from '@pages/CoursesPage'
import { CourseFormPage } from '@pages/CourseFormPage'
import { SalesPage } from '@pages/SalesPage'
import { SaleFormPage } from '@pages/SaleFormPage'
import { UsersPage } from '@pages/UsersPage'
import { UserFormPage } from '@pages/UserFormPage'
import { RolesPage } from '@pages/RolesPage'
import { RoleFormPage } from '@pages/RoleFormPage'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <NavigationIndicator />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <div className="text-center py-5">
      <h1 className="h3">Página no encontrada</h1>
      <Link to="/home" className="btn btn-primary mt-3">
        Volver al inicio
      </Link>
    </div>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: async () => {
    await hydrateSession()
    if (session.get()) {
      throw redirect({ to: '/home' })
    }
  },
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registro',
  beforeLoad: async () => {
    await hydrateSession()
    if (session.get()) {
      throw redirect({ to: '/home' })
    }
  },
  component: RegisterPage,
})

function requireAuth() {
  if (!session.get()) {
    throw redirect({ to: '/login' })
  }
}

function requireRole(...roles: string[]) {
  const user = session.get()
  if (!user) {
    throw redirect({ to: '/login' })
  }
  if (roles.length > 0 && !roles.includes(user.role ?? '')) {
    throw redirect({ to: '/home' })
  }
}

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  beforeLoad: async () => {
    await hydrateSession()
    requireAuth()
  },
  component: AppLayout,
})

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/home',
  component: HomePage,
})

const coursesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cursos',
  beforeLoad: () => requireRole('Administrador', 'Vendedor', 'Estudiante'),
  component: CoursesPage,
})

const newCourseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cursos/nuevo',
  beforeLoad: () => requireRole('Administrador', 'Vendedor'),
  component: () => <CourseFormPage mode="create" />,
})

const editCourseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cursos/$cursoId/editar',
  beforeLoad: () => requireRole('Administrador', 'Vendedor'),
  component: () => <CourseFormPage mode="edit" />,
})

const salesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/ventas',
  beforeLoad: () => requireRole('Administrador', 'Vendedor'),
  component: SalesPage,
})

const newSaleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/ventas/nueva',
  beforeLoad: () => requireRole('Administrador', 'Vendedor'),
  component: () => <SaleFormPage mode="create" />,
})

const editSaleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/ventas/$ventaId/editar',
  beforeLoad: () => requireRole('Administrador', 'Vendedor'),
  component: () => <SaleFormPage mode="edit" />,
})

const usersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/usuarios',
  beforeLoad: () => requireRole('Administrador'),
  component: UsersPage,
})

const editUserRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/usuarios/$usuarioId/editar',
  beforeLoad: () => requireRole('Administrador'),
  component: UserFormPage,
})

const rolesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/roles',
  beforeLoad: () => requireRole('Administrador'),
  component: RolesPage,
})

const newRoleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/roles/nuevo',
  beforeLoad: () => requireRole('Administrador'),
  component: () => <RoleFormPage mode="create" />,
})

const editRoleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/roles/$rolId/editar',
  beforeLoad: () => requireRole('Administrador'),
  component: () => <RoleFormPage mode="edit" />,
})

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/home' })
  },
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  layoutRoute.addChildren([
    indexRoute,
    homeRoute,
    coursesRoute,
    newCourseRoute,
    editCourseRoute,
    salesRoute,
    newSaleRoute,
    editSaleRoute,
    usersRoute,
    editUserRoute,
    rolesRoute,
    newRoleRoute,
    editRoleRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function NavigationIndicator() {
  const isNavigating = useRouterState({ select: (state) => state.status === 'pending' })
  if (!isNavigating) {
    return null
  }
  return (
    <div className="indicador-carga">
      <div className="progress" style={{ height: 3 }}>
        <div className="progress-bar progress-bar-striped progress-bar-animated w-100" />
      </div>
    </div>
  )
}
