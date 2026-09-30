import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { deleteCourse, listCourses } from '@api/endpoints'
import type { Course } from '@api/types'
import { formatCOP } from '@utils/format'
import { confirmDialog, showError, success } from '@utils/alerts'

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setCourses(await listCourses())
    } catch (err) {
      void showError('No fue posible cargar los cursos', err instanceof Error ? err.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    if (!search) {
      return courses
    }
    const pattern = new RegExp(search, 'i')
    return courses.filter((c) => pattern.test(c.course) || pattern.test(c.instructor))
  }, [courses, search])

  const handleDelete = async (course: Course) => {
    if (!(await confirmDialog(`¿De verdad quieres eliminar el curso "${course.course}"?`))) {
      return
    }
    try {
      await deleteCourse(course.id)
      await success('Curso eliminado correctamente')
      await load()
    } catch (err) {
      void showError('No fue posible eliminar el curso', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0 me-auto">Gestor de Cursos</h1>
        <div style={{ width: 260 }}>
          <input
            id="search"
            type="text"
            className="form-control"
            placeholder="Curso o Instructor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link to="/cursos/nuevo">
          <button type="button" className="btn btn-success">
            <i className="bi bi-plus-lg me-1" /> Agregar Curso
          </button>
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Nombre del curso</th>
                <th className="text-center">Area</th>
                <th className="text-center">Instructor</th>
                <th className="text-center">Precio</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No hay cursos para mostrar
                  </td>
                </tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course.id}>
                    <td className="text-center">{course.course}</td>
                    <td className="text-center">{course.subject}</td>
                    <td className="text-center">{course.instructor}</td>
                    <td className="text-center">{formatCOP(course.cost)}</td>
                    <td className="text-center">
                      <span className={`badge ${course.status === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link to="/cursos/$cursoId/editar" params={{ cursoId: course.id }}>
                        <button type="button" className="btn btn-sm btn-outline-primary me-1" title="Editar">
                          <i className="bi bi-pencil" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar"
                        onClick={() => void handleDelete(course)}
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
