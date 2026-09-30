import { useEffect, useMemo, useState, type SubmitEvent } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  createSale,
  getSale,
  getNextSaleNumber,
  listActiveCourses,
  listActiveSubjects,
  updateSale,
} from '@api/endpoints'
import type { Course, SaleRow, Subject } from '@api/types'
import { formatCOP } from '@utils/format'
import { confirmDialog, showError, success } from '@utils/alerts'

interface LineUI {
  key: number
  course: string
  subject: string
  quantity: number
  selectedCourse: Course | null
}

const EMPTY_LINE = (key: number): LineUI => ({
  key,
  course: '',
  subject: '',
  quantity: 1,
  selectedCourse: null,
})

export function SaleFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const params = useParams({ strict: false })
  const navigate = useNavigate()

  const [saleNumber, setSaleNumber] = useState('SO-…')
  const [clientName, setClientName] = useState('')
  const [clientIdentity, setClientIdentity] = useState('')
  const [lines, setLines] = useState<LineUI[]>([EMPTY_LINE(0)])
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nextKey, setNextKey] = useState(1)

  useEffect(() => {
    const load = async () => {
      try {
        const [activeCourses, activeSubjects] = await Promise.all([
          listActiveCourses(),
          listActiveSubjects(),
        ])
        setCourses(activeCourses)
        setSubjects(activeSubjects)

        if (mode === 'create') {
          setSaleNumber((await getNextSaleNumber()).saleNumber)
        } else {
          const sale = await getSale(params.ventaId as string)
          setSaleNumber(sale.saleNumber)
          setClientName(sale.clientName)
          setClientIdentity(sale.clientIdentity)
          setLines(
            sale.rows.map((row, index) => ({
              key: index,
              course: row.course,
              subject: row.subject,
              quantity: row.quantity,
              selectedCourse: activeCourses.find((c) => c.course === row.course) ?? null,
            })),
          )
          setNextKey(sale.rows.length)
        }
      } catch (err) {
        void showError('No fue posible cargar el formulario', err instanceof Error ? err.message : undefined)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [mode, params.ventaId])

  const updateLine = (key: number, changes: Partial<LineUI>) => {
    setLines((previous) =>
      previous.map((line) => (line.key === key ? { ...line, ...changes } : line)),
    )
  }

  const changeCourse = (key: number, courseName: string) => {
    const selectedCourse = courses.find((c) => c.course === courseName) ?? null
    updateLine(key, { course: courseName, selectedCourse })
  }

  const addLine = () => {
    setLines((previous) => [...previous, EMPTY_LINE(nextKey)])
    setNextKey((n) => n + 1)
  }

  const removeLine = async (key: number) => {
    if (lines.length === 1) {
      return
    }
    if (await confirmDialog('¿Quitar esta línea de la venta?', 'Sí, quitar')) {
      setLines((previous) => previous.filter((line) => line.key !== key))
    }
  }

  const lineTotal = (line: LineUI): number =>
    line.selectedCourse ? line.selectedCourse.cost * line.quantity : 0

  const saleTotal = useMemo(
    () => lines.reduce((sum, line) => sum + lineTotal(line), 0),
    [lines],
  )

  const totalCourses = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  )

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    const invalid = lines.some((l) => !l.course || !l.subject || l.quantity < 1)
    if (!clientName.trim() || !clientIdentity.trim() || invalid) {
      void showError('Faltan campos por introducir', 'Revise el cliente y que cada línea tenga curso, area y cantidad.')
      return
    }
    setSaving(true)
    const rows: SaleRow[] = lines.map((line) => ({
      course: line.course,
      subject: line.subject,
      quantity: line.quantity,
      price: line.selectedCourse?.cost ?? 0,
      total: lineTotal(line),
    }))
    try {
      if (mode === 'create') {
        await createSale({ clientName: clientName.trim(), clientIdentity: clientIdentity.trim(), rows })
        await success('¡Venta guardada!')
      } else {
        await updateSale(params.ventaId as string, {
          clientName: clientName.trim(),
          clientIdentity: clientIdentity.trim(),
          rows,
        })
        await success('¡Venta actualizada!')
      }
      await navigate({ to: '/ventas' })
    } catch (err) {
      void showError('No fue posible guardar la venta', err instanceof Error ? err.message : undefined)
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
    <section>
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <i className="bi bi-cart-plus" />
          <strong>{mode === 'create' ? 'Registrar Ventas' : 'Editar Ventas'}</strong>
          <button type="button" className="btn btn-success btn-sm ms-auto" onClick={addLine}>
            <i className="bi bi-plus-lg me-1" /> Agregar línea
          </button>
        </div>
        <div className="card-body">
          <form onSubmit={(e) => void handleSubmit(e)}>
            <div className="row g-3 align-items-end mb-4">
              <div className="col-md-2">
                <label className="form-label small text-muted">Número de venta</label>
                <div className="card text-white bg-dark text-center">
                  <div className="card-header fw-bold">{saleNumber}</div>
                </div>
              </div>
              <div className="col-md-4">
                <label htmlFor="clientName" className="form-label">
                  Nombre del Cliente
                </label>
                <input
                  id="clientName"
                  className="form-control"
                  type="text"
                  placeholder="Nombre cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="clientIdentity" className="form-label">
                  Identificación del Cliente
                </label>
                <input
                  id="clientIdentity"
                  className="form-control"
                  type="text"
                  placeholder="Identificación del cliente"
                  value={clientIdentity}
                  onChange={(e) => setClientIdentity(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="total" className="form-label">
                  Total
                </label>
                <input
                  id="total"
                  className="form-control text-center fw-bold"
                  type="text"
                  value={formatCOP(saleTotal)}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle ancho-minimo">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Curso</th>
                    <th>Area</th>
                    <th style={{ width: 110 }}>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                    <th style={{ width: 90 }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.key}>
                      <td>
                        <select
                          className="form-select text-center"
                          aria-label="Curso"
                          value={line.course}
                          onChange={(e) => changeCourse(line.key, e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.course}>
                              {course.course}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-select text-center"
                          aria-label="Area"
                          value={line.subject}
                          onChange={(e) => updateLine(line.key, { subject: e.target.value })}
                        >
                          <option value="">Seleccionar</option>
                          {subjects.map((subject) => (
                            <option key={subject.id} value={subject.subject}>
                              {subject.subject}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control text-center"
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(line.key, { quantity: Math.max(1, Number(e.target.value) || 1) })
                          }
                        />
                      </td>
                      <td className="text-center">
                        {line.selectedCourse ? formatCOP(line.selectedCourse.cost) : '—'}
                      </td>
                      <td className="text-center">{formatCOP(lineTotal(line))}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => void removeLine(line.key)}
                          disabled={lines.length === 1}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                {totalCourses} curso(s) en la venta
              </span>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving && (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                  )}
                  {mode === 'create' ? 'Confirma' : 'Actualizar'}
                </button>
                <Link to="/ventas">
                  <button type="button" className="btn btn-dark">
                    Cancelar
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
