import React from "react";
import '../App.css';
//import { Spinner } from 'reactstrap';
import { Link } from "react-router-dom"
// import 'bootstrap/dist/css/bootstrap.min.css'
import { getVentas } from '../conexion-bd/funciones';
// import React, { useState } from 'react';



function Ventas() {
//     const [show, setShow] = useState(false);
//     const handleModalClose = (e) => {
//         setShow(false);
//       };
      
//       const handleModalOpen = () => {
//         setShow(true);
//       };

    const cargarDatos = async () => {
        await accionAsincrona();
        const cadena = `
            <table id='TablaVentas' class="table table-striped" >
                <thead class="table-dark text-center">
                    <tr>
                        <th>Fecha</th>
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
            </table>`

        document.getElementById('ventas').innerHTML = cadena;
        const tableVentas = document.getElementById('TablaVentas');
        const querySnapshot = await getVentas();
        //document.getElementById("spinner").style.display = "none";
        var count = 0;
        querySnapshot.forEach(doc => {
            count += 1;
            tableVentas.innerHTML += `
        <tr>
        <td id=${'fecha' + count} class="align-middle">${doc.data().fecha}</td>
        <td id=${'NumeroVenta' + count} class="align-middle">${doc.data().NumeroVenta}</td>
        <td id=${'NombreClienteV' + count} class="align-middle">${doc.data().NombreClienteV}</td>
        <td id=${'IdentiClienteV' + count} class="align-middle">${doc.data().IdentiClienteV}</td>
        <td id=${'totalCursos' + count} class="align-middle">${doc.data().totalCursos}</td>
        <td id=${'TotalVenta' + count} class="align-middle">${doc.data().TotalVenta}</td>
        <td id=${'Vendedor' + count} class="align-middle">${doc.data().Vendedor}</td>
        <td id=${'EstadoV' + count} class="align-middle">${doc.data().EstadoV}</td>
        <td>
          <button type="button" class="btn btn-danger">
            <i class="fas fa-trash-alt"></i> 
            </button>
            <button id=${count} type="button" class="btn btn-primary"  data-toggle="modal" data-target="#EditarOrden" onclick="editarOrden(this)">
            <i class="fas fa-pencil-alt"> </i>
            </button>
            </i></button>
          <button id=${count} type="button" class="btn btn-warning"  data-toggle="modal" data-target="#verOrden" onclick="verInfOrden(this)">
          <i class="fas fa-adjust"> </i>
          </button>
          
        </td>
        </tr>
        `
        })
    }

    const accionAsincrona = async () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    cargarDatos();

    return (
        <>
            <div class="content-wrapper">

                <h1 className="card-header text-align: right "> <i className="fas fa-cart-plus"></i>
                    Ventas
                    <Link className="col" to='/registrar_ventas'>
                        <button className="btn btn-success" type="button">  Registrar Venta</button>
                    </Link>
                    <div id='ventas' className="table-scroll styleTable" />
                    <div />
                </h1>
            </div>
            {/* <Spinner id="spinner" className='lds-dual-ring' color="success" /> */}
        </>
    )
}

export default Ventas;