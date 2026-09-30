import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Modal } from 'react-bootstrap'
import { deleteSale, getSale, listSales } from '@api/endpoints'
import type { Sale } from '@api/types'
import { useSession } from '@auth/session'
import { formatCOP } from '@utils/format'
import { confirmDialog, showError, success } from '@utils/alerts'

export function SalesPage() {
  const user = useSession()
  const [sales, setSales] = useState<Sale[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saleDetail, setSaleDetail] = useState<Sale | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      setSales(await listSales())
    } catch (err) {
      void showError('No fue posible cargar las ventas', err instanceof Error ? err.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleDelete = async (sale: Sale) => {
    if (!(await confirmDialog(`¿Desea eliminar la orden ${sale.saleNumber}?`))) {
      return
    }
    try {
      await deleteSale(sale.id)
      await success('Se eliminó correctamente')
      await load()
    } catch (err) {
      void showError('No fue posible eliminar la venta', err instanceof Error ? err.message : undefined)
    }
  }

  const handleView = async (sale: Sale) => {
    try {
      setSaleDetail(await getSale(sale.id))
    } catch (err) {
      void showError('No fue posible cargar la venta', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0 me-auto">
          <i className="bi bi-cart-plus me-2" />
          Ventas
        </h1>
        <div style={{ width: 260 }}>
          <input
            id="search"
            type="text"
            className="form-control"
            placeholder="Inserte un caracter a buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link to="/ventas/nueva">
          <button type="button" className="btn btn-success">
            Registrar Venta
          </button>
        </Link>
      </div>

      {user?.role === 'Vendedor' && (
        <p className="text-muted small">Estás viendo solo tus propias ventas.</p>
      )}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle mb-0 tabla-ventas">
            <thead className="table-dark text-center">
              <tr>
                <th>Fecha</th>
                <th># Venta</th>
                <th>Cliente</th>
                <th>Identificación</th>
                <th>Cursos</th>
                <th>Total</th>
                <th>Vendedor</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Cargando…
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">
                    No hay ventas para mostrar
                  </td>
                </tr>
              ) : (
                sales
                  .filter((sale) => {
                    if (!search) {
                      return true
                    }
                    const pattern = new RegExp(search, 'i')
                    return (
                      pattern.test(sale.saleNumber) ||
                      pattern.test(sale.clientName) ||
                      pattern.test(sale.clientIdentity) ||
                      pattern.test(sale.seller)
                    )
                  })
                  .map((sale) => (
                    <tr key={sale.id}>
                      <td className="text-center">{sale.date}</td>
                      <td className="text-center fw-semibold">{sale.saleNumber}</td>
                      <td className="text-center">{sale.clientName}</td>
                      <td className="text-center">{sale.clientIdentity}</td>
                      <td className="text-center">{sale.totalCourses}</td>
                      <td className="text-center">{formatCOP(sale.total)}</td>
                      <td className="text-center">{sale.seller}</td>
                      <td className="text-center">{sale.saleStatus}</td>
                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary me-1"
                          title="Ver detalle"
                          onClick={() => void handleView(sale)}
                        >
                          <i className="bi bi-eye" />
                        </button>
                        <Link to="/ventas/$ventaId/editar" params={{ ventaId: sale.id }}>
                          <button type="button" className="btn btn-sm btn-outline-primary me-1" title="Editar">
                            <i className="bi bi-pencil" />
                          </button>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          title="Eliminar"
                          onClick={() => void handleDelete(sale)}
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

      <Modal show={saleDetail !== null} onHide={() => setSaleDetail(null)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ver Venta {saleDetail?.saleNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saleDetail && (
            <>
              <div className="row g-2 mb-3">
                <div className="col-md-3">
                  <div className="card text-white bg-dark">
                    <div className="card-header">{saleDetail.saleNumber}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Nombre</label>
                  <input className="form-control" type="text" value={saleDetail.clientName} readOnly />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Identificación</label>
                  <input className="form-control" type="text" value={saleDetail.clientIdentity} readOnly />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Total</label>
                  <input className="form-control" type="text" value={formatCOP(saleDetail.total)} readOnly />
                </div>
              </div>
              <table className="table table-hover table-striped text-center">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Curso</th>
                    <th>Area</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {saleDetail.rows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.course}</td>
                      <td>{row.subject}</td>
                      <td>{row.quantity}</td>
                      <td>{formatCOP(row.price)}</td>
                      <td>{formatCOP(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSaleDetail(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}
