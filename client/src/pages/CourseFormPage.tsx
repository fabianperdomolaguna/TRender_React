import { useEffect, useState, type SubmitEvent } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { createCourse, getCourse, updateCourse } from '@api/endpoints'
import { COURSE_STATUS, SUBJECTS } from '../constants'
import { showError, success } from '@utils/alerts'

interface FormState {
  course: string
  subject: string
  instructor: string
  cost: string
  status: string
}

const EMPTY: FormState = { course: '', subject: '', instructor: '', cost: '', status: 'Activo' }

export function CourseFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { cursoId } = useParams({ strict: false })
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== 'edit' || !cursoId) {
      return
    }
    getCourse(cursoId)
      .then((course) =>
        setForm({
          course: course.course,
          subject: course.subject,
          instructor: course.instructor,
          cost: String(course.cost),
          status: course.status,
        }),
      )
      .catch((err) => showError('No fue posible cargar el curso', err instanceof Error ? err.message : undefined))
      .finally(() => setLoading(false))
  }, [mode, cursoId])

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (!form.course || !form.subject || !form.instructor || form.cost === '') {
      void showError('Faltan campos por introducir')
      return
    }
    setSaving(true)
    const body = {
      course: form.course.trim(),
      subject: form.subject,
      instructor: form.instructor.trim(),
      cost: Number(form.cost),
      status: form.status,
    }
    try {
      if (mode === 'create') {
        await createCourse(body)
        await success('El curso fue añadido satisfactoriamente')
      } else {
        await updateCourse(cursoId as string, body)
        await success('El curso fue actualizado satisfactoriamente')
      }
      await navigate({ to: '/cursos' })
    } catch (err) {
      void showError('No fue posible guardar el curso', err instanceof Error ? err.message : undefined)
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
      <h3 className="text-center mb-4">{mode === 'create' ? 'Formulario Cursos' : 'Editar Curso'}</h3>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="course" className="form-label">
                Nombre del Curso
              </label>
              <input
                id="course"
                type="text"
                className="form-control"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                Area
              </label>
              <select
                id="subject"
                className="form-select"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                {SUBJECTS.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="instructor" className="form-label">
                Instructor
              </label>
              <input
                id="instructor"
                type="text"
                className="form-control"
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cost" className="form-label">
                Precio
              </label>
              <input
                id="cost"
                type="number"
                min={0}
                step={1000}
                className="form-control"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="form-label">
                Estado
              </label>
              <select
                id="status"
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {COURSE_STATUS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-dark flex-grow-1" disabled={saving}>
                {saving && (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                )}
                Enviar
              </button>
              <Link to="/cursos">
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
