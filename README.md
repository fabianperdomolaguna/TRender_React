# TRender University

Aplicación web para administrar la venta de cursos online. Es la reinvención moderna del proyecto original **TRender_React**: backend con **FastAPI + MongoDB + JWT**, frontend con **React 19 + Vite + TanStack Router**, y todo dockerizado con Docker Compose.

## Características

- **Autenticación JWT**: registro, login y perfil (`/auth/me`), con token persistido en `localStorage`.
- **Rutas protegidas por rol**: cada módulo se muestra según el rol del usuario (Administrador, Vendedor, Estudiante), con guards en el router.
- **Cursos y áreas (subjects)**: CRUD completo de cursos con precio en COP, instructor y estado.
- **Ventas**: registro de ventas con numeración consecutiva (`SO-10000`, `SO-10001`, …), múltiples líneas por venta y cálculo automático de totales.
- **Usuarios y roles**: el administrador asigna rol y estado a los usuarios registrados.
- **Interfaz**: Bootstrap 5.3 + react-bootstrap, alertas con SweetAlert2 y menú lateral por rol.

## Instalación

Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd TRender_React
```

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
JWT_SECRET=una_clave_larga_y_secreta
JWT_EXPIRATION_MINUTES=120
ADMIN_EMAIL=admin@trender.edu.co
ADMIN_PASSWORD=admin123
```

Levanta todos los servicios:

```bash
docker compose up -d --build
```

## Uso

Abre el navegador en:

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:80/docs |
| Mongo Express UI (mongoku) | http://localhost:3100 |

Al arrancar, la API ejecuta un **seed** que crea los roles, las áreas, unos cursos de ejemplo y el usuario administrador con las credenciales de `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Inicia sesión con esas credenciales y navega por el menú lateral según tu rol.

## Rutas

**Públicas**

- `/login` — inicio de sesión.
- `/registro` — registro de usuarios nuevos.

**Protegidas** (requieren sesión iniciada)

- `/home` — página de inicio (cualquier usuario autenticado).
- `/cursos` — gestor de cursos (Administrador, Vendedor y Estudiante).
- `/ventas` — gestor de ventas (Administrador y Vendedor).
- `/usuarios` — gestor de usuarios (solo Administrador).
- `/roles` — gestor de roles (solo Administrador).

**API** (prefijo en `http://localhost:80`)

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET|POST /courses`, `GET /courses/active`, `GET|PUT|DELETE /courses/{id}`
- `GET /subjects`, `GET /subjects/active`, `POST /subjects`
- `GET|POST /sales`, `GET /sales/sequence`, `GET|PUT|DELETE /sales/{id}`
- `GET /users` (admin), `GET|PUT|DELETE /users/{id}`, `GET /roles`, `POST|PUT /roles`, `DELETE /roles/{id}`

## Estructura del proyecto

```
api/
  app/
    main.py            # App FastAPI, CORS y lifespan con seed
    routers/           # auth, courses, subjects, sales, users, roles
    db/                # Conexión a Mongo y seed
    core/security.py   # JWT, hashing de contraseñas y dependencias de auth
    schemas/           # Modelos Pydantic (entrada/salida)
client/
  src/
    api/               # Cliente fetch tipado y endpoints
    auth/              # Store de sesión (useSyncExternalStore)
    pages/             # Páginas (login, registro, cursos, ventas, usuarios, roles)
    components/layout/ # Navbar, Sidebar, Footer
    router.tsx         # Rutas y guards por rol
```

## Tecnologías utilizadas

- **Frontend**: React 19, TanStack Router, Bootstrap 5.3, react-bootstrap, SweetAlert2, Vite, TypeScript, oxlint.
- **Backend**: FastAPI, PyMongo (async), PyJWT, pwdlib (bcrypt), Ruff.
- **Infraestructura**: Docker Compose, MongoDB 8, mongoku.
