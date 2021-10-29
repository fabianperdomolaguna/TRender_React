import React, { useEffect, useState } from "react";
import '../App.css';
import { Link, useParams } from "react-router-dom"
import { consultarVentas, consultarDocumentoDatabase, eliminarDocumentoDatabase } from '../conexion-bd/funciones';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'


const Ventas = () => {
    const [listaVentas, setListaVentas] = useState([]);
    const [listaCursos, setListaCursos] = useState([]);
    const [usuarioBd, setUsuarioBd] = useState([]);
    const { id } = useParams();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [NombreClienteV, setNombreClienteV] = React.useState('');
    const [NumeroVenta, setNumeroVenta] = React.useState('');
    const [TotalVenta, setTotalVenta] = React.useState('');
    const [IdentiClienteV, setIdentiClienteV] = React.useState('');
    const [loading, setLoading] = useState(false)
    const [busqueda, setBusqueda] = useState('')
    const handleShow = () => setShow(true);

    async function editarOrden(e) {
        setShow(true);
        setLoading(true)
        const idVentaUn = e.target.id.substring(e.target.id.indexOf('/') + 1, e.target.id.length);
        const id = e.target.id.substring(0, e.target.id.indexOf('/'));
        setNumeroVenta(document.getElementById('NumeroVenta' + id).innerHTML)
        setNombreClienteV(document.getElementById('NombreClienteV' + id).innerHTML)
        setIdentiClienteV(document.getElementById('IdentiClienteV' + id).innerHTML)
        setTotalVenta(document.getElementById('TotalVenta' + id).innerHTML)

        const Usuarios = await consultarDocumentoDatabase('ventas', idVentaUn)
        setListaCursos(Usuarios.filas)
        setLoading(false)

    }

    const consultarUsuario = async (idUsuario) => {
        const Usuarios = await consultarDocumentoDatabase('usuarios', idUsuario)
        setUsuarioBd(Usuarios)
        return usuarioBd
    }
    const handleCargarDatos = async () => {
        var listaVentas = await consultarVentas();
        setListaVentas(listaVentas)
    }

    const FilterVenta = (search, lista) => {
        if (search == '') {
            return lista
        } else {
            var expression = new RegExp(search, 'i');
            var listFiletered = [];
            lista.forEach((C) => {
                if (expression.test(C.NumeroVenta) || expression.test(C.NombreClienteV) || expression.test(C.IdentiClienteV) || expression.test(C.Vendedor)) {
                    listFiletered.push(C)
                }
            })
            return listFiletered;
        }
    }

    useEffect(() => {
        consultarUsuario(id);
        handleCargarDatos();
    }, [id])

    const eliminarVenta = ('submit', async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Desea eliminar la orden?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await eliminarDocumentoDatabase('ventas', e.target.id)
                Swal.fire({
                    confirmButtonText: 'Ok',
                    title: 'Se elimino correctamente',
                    icon: 'success'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/ventas/${id}`
                    };

                })
            };


        }
        );
    });




    var ventas = [];
    if (usuarioBd.rol === 'Vendedor') {
        ventas = FilterVenta(usuarioBd.nombre, listaVentas);
    }
    else {
        ventas = listaVentas
    }

    ventas = FilterVenta(busqueda, ventas);

    return (
        <>
            <div className="content-wrapper" >
                <section>
                    <h1 className="card-header text-align: right "> <i className="fas fa-cart-plus"></i>
                        Ventas
                    </h1>
                    <Link className="col" to={`/registrar_ventas/${id}`}>
                        <button className="btn btn-success positionTabal2" type="button">  Registrar Venta</button>
                    </Link>
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-sm-1 align-text-bottom"><h5>Buscar:</h5></div>
                        <div className="col-sm-5">
                            <input id="busqueda" type="text" className="form-control" placeholder="Inserte un carater a buscar" onChange={event => setBusqueda(event.target.value)} />
                        </div>
                    </div>
                    <div id="ventas1" className="positionTabal">

                        <table id='TablaVentas' className=" table table-hover table-striped positionTabal2 " >

                            <thead className="table-dark text-center">
                                <tr>
                                    <th c>Fecha</th>
                                    <th># Venta</th>
                                    <th>Cliente</th>
                                    <th>Identificación</th>
                                    <th>Cursos</th>
                                    <th>Total</th>
                                    <th>Vendedor</th>
                                    <th>Estado</th>
                                    <th>Accion</th>
                                </tr>

                            </thead>
                            {/* <Spinner id="spinner" className='lds-dual-ring' color="success" /> */}
                            <tbody>

                                {
                                    ventas.map((venta, index) => {
                                        return (
                                            <tr key={venta.id}>
                                                <td id={'fecha' + index} className="text-center">{venta.fecha}</td>
                                                <td id={'NumeroVenta' + index} className="text-center">{venta.NumeroVenta}</td>
                                                <td id={'NombreClienteV' + index} className="text-center">{venta.NombreClienteV}</td>
                                                <td id={'IdentiClienteV' + index} className="text-center">{venta.IdentiClienteV}</td>
                                                <td id={'totalCursos' + index} className="text-center">{venta.totalCursos}</td>
                                                <td id={'TotalVenta' + index} className="text-center">{venta.TotalVenta}</td>
                                                <td id={'Vendedor' + index} className="text-center">{venta.Vendedor}</td>
                                                <td id={'EstadoV' + index} className="text-center">{venta.EstadoV}</td>
                                                <td>
                                                    <button id={venta.id} type="submit" className="btn btn-danger" onClick={(e) => { eliminarVenta(e) }}>
                                                        <i id={venta.id} className="fas fa-trash-alt"></i>
                                                    </button>
                                                    <Link to={`/Editar_Ventas/${venta.id}/${id}`}>
                                                        <button id={venta.id} type="button" className="btn btn-primary">
                                                            <i className="fas fa-pencil-alt"> </i>
                                                        </button>
                                                    </Link>
                                                    <button id={venta.id} type="button" className="btn btn-warning" onClick={(e) => { handleShow(e); editarOrden(e) }}>
                                                        <i id={index + '/' + venta.id} className="fas fa-adjust" > </i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}

                            </tbody>
                        </table>
                    </div >
                </section>
                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    size='xl'
                    centered>

                    <Modal.Header closeButton>
                        <Modal.Title id='Title'>Ver Venta </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <h5 className="card-header text-align: right">
                            </h5>
                            <div className="row">
                                <div className="card text-white bg-dark  mb-4 inputSO">
                                    <div id="NumeroVenta" className="card-header">{NumeroVenta}</div>
                                </div>
                                <div className="col-lg-3 col-sm-1">
                                    <div className="form-floating mb-1 inputClient" >
                                        <input className="form-control" type="text"
                                            placeholder="Nombre cliente" value={NombreClienteV} />
                                        <label >Nombre</label>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-1">
                                    <div className="form-floating mb-1 inputClient" >
                                        <input className="form-control" id="IdentiClienteV" type="text"
                                            placeholder="Identicacion del Cliente" value={IdentiClienteV} />
                                        <label >Identificación</label>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-1">
                                    <div className="form-floating mb-1 inputClient">
                                        <input className="form-control" id="TotalVenta" type="text" disabled
                                            placeholder="Total" value={TotalVenta} onChange={(e) => setTotalVenta(e.target.value)} />
                                        <label >Total</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body text-center ">
                            <table id="tablaEditarVentas" className="table table-hover table-striped" >
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th className="text-center">Curso</th>
                                        <th className="text-center">Area</th>
                                        <th className="text-center">Cantidad</th>
                                        <th className="text-center">Precio Unitario</th>
                                        <th className="text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listaCursos.map((item, index) => (
                                            <tr>
                                                <td>{item.CursoClienteV}</td>
                                                <td>{item.AreaClienteV}</td>
                                                <td>{item.CantidadV}</td>
                                                <td>{item.PrecioCursoV} </td>
                                                <td>{item.totalV}</td>
                                            </tr>
                                        ))

                                    }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={(e) => { handleClose(e) }} disabled={loading}>
                            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default Ventas;