import React, { useState, useEffect } from "react";
import '../App.css';
import { getDatos, getCurso, consultarDocumentoDatabase,actualizarDocumentoDatabase } from '../conexion-bd/funciones';
import Swal from 'sweetalert2'
import { Link, useParams } from "react-router-dom"

const _defaultCosts = [];

const RegistrarVentas = () => {
    const [listaCursos, setListaCursos] = useState([]);
    const [usuarioBd, setUsuarioBd] = useState([])
    const [cursosVentadb, setUcursosVentadb] = useState([])
    const { idVendedor } = useParams()
    const { idVenta } = useParams()
  


    const consultarUsuario = async (idUsuario) => {
        const Usuarios = await consultarDocumentoDatabase('usuarios', idUsuario)
        setUsuarioBd(Usuarios)
        return usuarioBd
    }
    const consultarVenta = async (idVenta) => {
        const cursosVenta = await consultarDocumentoDatabase('ventas', idVenta)
        setListaCursos(cursosVenta.filas)
        setUcursosVentadb(cursosVenta)
        document.getElementById("NumeroVenta").innerHTML = cursosVenta.NumeroVenta
        document.getElementById("NombreClienteV").value = cursosVenta.NombreClienteV
        document.getElementById("IdentiClienteV").value = cursosVenta.IdentiClienteV
        document.getElementById("TotalVenta").value = cursosVenta.TotalVenta
        const tableVentas = document.getElementById('tablaResgistrarVentas');
        for (var i = 1, row; row = tableVentas.rows[i]; i++) {
            var id = row.cells[0].id
            await CargarSelect('CursoClienteV' + id, 'cursos')
            await CargarSelect('AreaClienteV' + id, 'areas')
        }
        return cursosVentadb
    }

    useEffect(() => {
        if (idVendedor) {
            consultarUsuario(idVendedor);
            consultarVenta(idVenta);
        }
    }, [idVendedor, idVenta])




    const [loading, setLoading] = useState(false)
    function loadData() {
        setLoading(true)
    }

    // esta funcion elimina lla fila de la tabla
    function eliminar_row_edit(row) {
        var rowIndex = row.target.parentNode.parentNode.parentNode.rowIndex
        document.getElementById("tablaResgistrarVentas").deleteRow(rowIndex);
        calcularTotal()
    };

    // esta funcion carga los selects de cursos y areas 
    async function CargarSelect(idSelector, baseDatos) {
        const querySnapshot = await getDatos(baseDatos);
        var selector = document.getElementById(idSelector);
        querySnapshot.forEach(doc => {
            if (doc.data().Estado == 'Activo') {
                var option = document.createElement("option");
                option.innerHTML = doc.data().Curso;
                option.value = doc.data().Curso;
                selector.append(option);
            }
        }
        )
    };

    const calcularTotal = async (e) => {
        const tableVentas = document.getElementById('tablaResgistrarVentas');
        var total = 0;
        var subTotal = 0;
        for (var i = 1, row; row = tableVentas.rows[i]; i++) {
            var id = row.cells[0].id
            subTotal = document.getElementById('TotalV' + id).value.trim();
            subTotal = subTotal.substring(subTotal.indexOf('$') + 1, subTotal.length);
            subTotal = subTotal.replace('.', '');
            total += parseInt(subTotal);
        };

        total = new Intl.NumberFormat('es-CO').format(total);
        document.getElementById('TotalVenta').value = '$' + total;
    };

    const ponerPrecio = async (e) => {
        var idVentas = e.target.id
        idVentas = idVentas.substring(idVentas.indexOf('V') + 1, idVentas.length);
        const stateQueryRes = await getCurso(e.target.value);
        var cantACtual = document.getElementById('CantidadV' + idVentas).value;
        if (cantACtual === "") {
            cantACtual = document.getElementById('CantidadV' + idVentas).placeholder;
        }
        document.getElementById('CantidadV' + idVentas).value = cantACtual;
        stateQueryRes.forEach(doc => {
            var precio = doc.data().Costo
            var precioUnitario = new Intl.NumberFormat('es-CO').format(precio);
            document.getElementById('PrecioCursoV' + idVentas).value = '$' + precioUnitario;
            var total = precio * document.getElementById('CantidadV' + idVentas).value
            total = new Intl.NumberFormat('es-CO').format(total);
            document.getElementById('TotalV' + idVentas).value = '$' + total;

        })
        calcularTotal()
    }


    const [costs, setCosts] = useState(_defaultCosts);

    const addNewLine = async () => {
        var oRows = document.getElementById('tablaResgistrarVentas').getElementsByTagName('tr');
        var iRowCount = oRows.length;
        setCosts(prevCosts => [...prevCosts, {
            id: iRowCount,
            cursos: "CursoClienteV" + iRowCount,
            area: "AreaClienteV" + iRowCount,
            cantidad: "CantidadV" + iRowCount,
            precio: "PrecioCursoV" + iRowCount,
            total: "TotalV" + iRowCount,

        },]);

        await CargarSelect('CursoClienteV' + iRowCount, 'cursos')
        await CargarSelect('AreaClienteV' + iRowCount, 'areas')
    };

    const ActualiarTotal = (e) => {
        var idVentas = e.target.id
        idVentas = idVentas.substring(idVentas.indexOf('V') + 1, idVentas.length);
        var precio = document.getElementById('PrecioCursoV' + idVentas).value
        precio = precio.substring(precio.indexOf('$') + 1, precio.length);
        precio = precio.replace('.', '');
        var cantidad = document.getElementById('CantidadV' + idVentas).value
        var total = precio * cantidad
        total = new Intl.NumberFormat('es-CO').format(total);
        document.getElementById('TotalV' + idVentas).value = '$' + total;
        calcularTotal()
    };

    // Esta funcion valida el fromulario antes de enviarlo
    function validacion() {
        var nombreCliente = document.getElementById('NombreClienteV').value
        var identificacionCliente = document.getElementById('IdentiClienteV').value
        if (nombreCliente === '' | identificacionCliente == '') {
            Swal.fire({

                confirmButtonText: 'Ok',
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            }).then(() => {
                setLoading(false)

            });


            return false;
        }
        return true;
    }

    // Esta funcion envia los datos a la base de datos
    const enviarInfo = ('submit', async (e) => {
        const filas = [];
        e.preventDefault();
        var val = validacion()
        const tableVentas = document.getElementById('tablaResgistrarVentas');
        if (val) {
            var totalCursos = 0;
            for (var i = 1, row; row = tableVentas.rows[i]; i++) {
                var id = row.cells[0].id
                var select = document.getElementById("CursoClienteV" + id);
                const CursoClienteV = select.options[select.selectedIndex].value.trim();
                var select = document.getElementById("AreaClienteV" + id);
                const AreaClienteV = select.options[select.selectedIndex].value.trim();
                const PrecioCursoV = document.getElementById('PrecioCursoV' + id).value.trim();
                var CantidadV = document.getElementById('CantidadV' + id).value.trim();
                if(CantidadV === ""){

                    CantidadV = document.getElementById('CantidadV' + id).placeholder.trim();
                }
                var totalV = document.getElementById('TotalV' + id).value.trim();
                if(totalV === ""){

                    totalV = document.getElementById('TotalV' + id).placeholder.trim();
                }
                var select = document.getElementById("EstadoV" + id);
                if (CursoClienteV == 'Seleccionar' | AreaClienteV == 'Seleccionar') {
                    val = false
                }
                totalCursos += parseInt(CantidadV);
                var fila = {
                    CursoClienteV,
                    AreaClienteV,
                    PrecioCursoV,
                    CantidadV,
                    totalV,
                };
                filas.push(fila)
            }
            const NumeroVenta = document.getElementById('NumeroVenta').innerText;
            const NombreClienteV = document.getElementById('NombreClienteV').value;
            const IdentiClienteV = document.getElementById('IdentiClienteV').value;
            const TotalVenta = document.getElementById('TotalVenta').value.trim();
            const EstadoV = 'Cerrada';
            const Vendedor = usuarioBd.nombre;
            let fecha = new Date().toISOString().slice(0, 10)
        
            if (val) {
                await actualizarDocumentoDatabase('ventas',idVenta,
             { "fecha": fecha,
                    "NumeroVenta": NumeroVenta,
                    "NombreClienteV": NombreClienteV,
                    "IdentiClienteV": IdentiClienteV,
                    "filas": filas,
                    "EstadoV": EstadoV,
                    "TotalVenta": TotalVenta,
                    "Vendedor": Vendedor,
                    "totalCursos": totalCursos,
                })

                Swal.fire({
                    confirmButtonText: 'Ok',
                    icon: 'success',
                    title: 'Update!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/ventas/${idVendedor}`;
                    }
                })
            }
            else {
                Swal.fire({
                    confirmButtonText: 'Ok',
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                }).then(() => {
                    setLoading(false)

                });
            }
        }
    }
    );

    return (

        <div className="content-wrapper">
            <section>
                <form id='registrar-ventas' onSubmit={enviarInfo}>
                    <div className=" card divPrinciplaRV">
                        <h5 className="card-header text-align: center"> <i className=" text-align: center fas fa-cart-plus"></i>
                            Editar Ventas
                            <br />
                            <br />
                            <button type="button" className=" text-center btn btn-success btn-rounded btn-sm my-0" onClick={addNewLine}>
                                Agregar línea
                            </button>
                        </h5>
                        <div className="row">
                            <div className="card text-white bg-dark  mb-4 inputSO">
                                <div id="NumeroVenta" className="card-header"></div>
                            </div>
                            <div className="col-lg-3 col-sm-1">
                                <div className="form-floating mb-1 inputClient" >
                                    <input className="form-control" id="NombreClienteV" type="text"
                                        placeholder="Nombre Cliente" />
                                    <label>Nombre del Cliente</label>
                                </div>
                            </div>

                            <div className="col-lg-3 col-sm-1">
                                <div className="form-floating mb-1 inputClient" >
                                    <input className="form-control" id="IdentiClienteV" type="text"
                                        placeholder="Identicacion del Cliente" />
                                    <label>Identificación del Cliente</label>
                                </div>
                            </div>

                            <div className="col-lg-3 col-sm-1">
                                <div className="form-floating mb-1 inputClient">
                                    <input className="form-control" id="TotalVenta" type="text" disabled
                                        placeholder="Total" />
                                    <label for="TotalVenta">Total</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-body text-center ">
                            <table id="tablaResgistrarVentas" className="table table-hover table-striped" >
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th className="text-center">Curso</th>
                                        <th className="text-center">Area</th>
                                        <th className="text-center">Cantidad</th>
                                        <th className="text-center">Precio Unitario</th>
                                        <th className="text-center">Total</th>
                                        <th className="text-center">Accion</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listaCursos.map((item, index) => (
                                            <tr>
                                                <td id={index}>
                                                    <select id={"CursoClienteV" + index}
                                                        className="form-select text-center" aria-label="Rol"
                                                        onChange={ponerPrecio}>
                                                        <option value={item.CursoClienteV} selected>{item.CursoClienteV}</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select id={'AreaClienteV' + index}
                                                        className="form-select text-center" aria-label="Rol">
                                                        <option value={item.AreaClienteV} selected>{item.AreaClienteV}</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="number" min="1" id={'CantidadV' + index} className="text-center" onChange={(e) => {ActualiarTotal(e) }} placeholder={item.CantidadV} />
                                                </td>
                                                <td>
                                                    <input id={'PrecioCursoV' + index} className="text-center" placeholder="Precio Unitario" disabled value={item.PrecioCursoV} />
                                                </td>
                                                <td>
                                                    <input id={'TotalV' + index} className="text-center" disabled placeholder={item.totalV} />
                                                </td>
                                                <td>
                                                    <span className="table-remove text-center">
                                                        <button type="button"
                                                            onClick={eliminar_row_edit}
                                                            className=" text-center btn btn-danger btn-rounded btn-sm my-0"
                                                            value="Delete">
                                                            Eliminar
                                                        </button>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {costs ?
                                        costs.map((item) => (
                                            <tr>
                                                <td id={item.id}>
                                                    <select id={item.cursos}
                                                        className="form-select text-center" aria-label="Rol"
                                                        onChange={ponerPrecio}>
                                                        <option value="Seleccionar" selected>Seleccionar</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select id={item.area} name='AreaClienteV1'
                                                        className="form-select text-center" aria-label="Rol">
                                                        <option value="Seleccionar" selected>Seleccionar</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="number" min="1" id={item.cantidad} class="text-center"
                                                        onChange={ActualiarTotal} placeholder="Cantidad" />
                                                </td>
                                                <td>
                                                    <input id={item.precio} className="text-center" placeholder="Precio Unitario" onChange={ActualiarTotal} disabled />
                                                </td>
                                                <td>
                                                    <input id={item.total} className="text-center" placeholder="Total" disabled />
                                                </td>
                                                <td>
                                                    <span className="table-remove text-center">
                                                        <button type="button"
                                                            onClick={eliminar_row_edit}
                                                            className=" text-center btn btn-danger btn-rounded btn-sm my-0"
                                                            value="Delete"
                                                            onmouseover="this.style.cursor='hand'" >
                                                            Eliminar
                                                        </button>
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : ""}
                                </tbody>
                            </table>
                            <div className="card-footer text-end">
                                <button type='submit' onClick={loadData} className="btn btn-success" disabled={loading} >
                                    {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                    Actualizar</button>
                                <Link className="col" to={`/ventas/${idVendedor}`}>
                                    <button className="btn btn-dark" type="button">  Cancelar</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default RegistrarVentas;