import React from "react";
import '../App.css';
import { Spinner } from 'reactstrap';
import { Link } from "react-router-dom"
// import 'bootstrap/dist/css/bootstrap.min.css'
import { getVentas } from '../conexion-bd/funciones';


function registrarVentas() {

    return (
        <>
            <div className="content-wrapper">
                <section>
                    <div className="container">
                        <form id='registrar-ventas'>
                            <div className=" card divPrinciplaRV">
                                <h5 className="card-header text-align: center"> <i className=" text-align: center fas fa-cart-plus"></i>
                                    Registar Ventas
                                    <br/>
                                    <br/>
                                    <button type="button" className=" text-center btn btn-success btn-rounded btn-sm my-0"
                                        value="Agregar" onmouseover="this.style.cursor='hand'">
                                        Agregar linea
                                    </button>
                                </h5>

                                <div className="row">

                                    <div className="card text-white bg-dark  mb-4 inputSO">
                                        <div id="NumeroVenta" className="card-header">SO-</div>
                                    </div>

                                    <div className="col-lg-3 col-sm-1">
                                        <div className="form-floating mb-1 inputClient" >
                                            <input className="form-control" id="NombreClienteV" type="text"
                                                placeholder="Nombre cliente" autofocus />
                                            <label for="NombreClienteV">Nombre del Cliente</label>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-sm-1">
                                        <div className="form-floating mb-1 inputClient" >
                                            <input className="form-control" id="IdentiClienteV" type="text"
                                                placeholder="Identicacion del Cliente" />
                                            <label for="IdentiClienteV">Identificación del Cliente</label>
                                        </div>
                                    </div>

                                    <div class="col-lg-3 col-sm-1">
                                        <div class="form-floating mb-1 inputClient">
                                            <input class="form-control" id="TotalVenta" type="text" disabled value="$0"
                                                placeholder="Total" />
                                            <label for="TotalVenta">Total</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body text-center ">

                                    <table id="tablaResgistrarVentas" class="table table-hover table-striped">
                                        <thead class="table-dark text-center">
                                            <tr>
                                                <th class="text-center">Curso</th>
                                                <th class="text-center">Area</th>
                                                <th class="text-center">Cantidad</th>
                                                <th class="text-center">Precio Unitario</th>
                                                <th class="text-center">Total</th>
                                                <th class="text-center">Accion</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select id='CursoClienteV1' name='CursoClienteV1'
                                                        class="form-select text-center" aria-label="Rol"
                                                        onchange="ponerPrecio(this)">
                                                        <option value="Seleccionar" selected>Seleccionar</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select id='AreaClienteV1' name='AreaClienteV1'
                                                        class="form-select text-center" aria-label="Rol">
                                                        <option value="Seleccionar" selected>Seleccionar</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="number" min="1" id='CantidadV1' class="text-center"
                                                        placeholder="Cantidad" value="1" onchange="ActualiarTotal(this)" />
                                                </td>
                                                <td>
                                                    <input id='PrecioCursoV1' class="text-center" placeholder="Precio Unitario" />
                                                </td>
                                                <td>
                                                    <input id='TotalV1' class="text-center" placeholder="Total"
                                                        onchange="calcularTotal(this)" />
                                                </td>
                                                <td id='1'>
                                                    <span class="table-remove text-center">
                                                        <button type="button"
                                                            class=" text-center btn btn-danger btn-rounded btn-sm my-0"
                                                            value="Delete"
                                                            onmouseover="this.style.cursor='hand'" >
                                                            Eliminar
                                                        </button>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="card-footer text-end">
                                        <button type='submit' class="btn btn-dark"> Confirmar</button>
                                        <a href="gestor_ventas.html" class="btn btn-dark">Cancelar</a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>



        </>
    )
}

export default registrarVentas;