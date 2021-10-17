import React, {useState} from "react";
import {Link, withRouter} from "react-router-dom"
import {consultarDatabase} from '../conexion-bd/funciones';

function Cursos(){
    const [listaCursos, setListaCursos] = useState([])

    const handleCargarDatos = async () => {
        const listaTemporal = await consultarDatabase('cursos')
        setListaCursos(listaTemporal)
    }
    handleCargarDatos()
    return(
        <>
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestor de Cursos</h1>

                    <br/>
                    
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-sm-1 align-text-bottom"><h5>Buscar:</h5></div>
                        <div className="col-sm-5">
                            <input id="stuff" type="text" className="form-control" placeholder="Nombre del Curso"/>
                        </div>
                        <Link className="col" to='/form_cursos'>
                            <button className="btn btn-success" type="button">Agregar Curso</button>
                        </Link>
                    </div>  
                </div>

                <br/>

                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th class="text-center">ID</th>
                            <th class="text-center">Nombre del curso</th>
                            <th class="text-center">Area</th>
                            <th class="text-center">Instructor</th>
                            <th class="text-center">Precio</th>
                            <th class="text-center">Estado</th>
                            <th class="text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listaCursos.map((curso) =>{
                                return(
                                    <tr key={curso.id}>
                                        <th class="text-center">{curso.id}</th>
                                        <td class="text-center">{curso.Curso}</td>
                                        <td class="text-center">{curso.Area}</td>
                                        <td class="text-center">{curso.Instructor}</td>
                                        <td class="text-center">{curso.Costo}</td>
                                        <td class="text-center">{curso.Estado}</td>
                                        <td class="text-center">
                                            <button onclick=""><i class="fas fa-edit"></i></button>
                                            <button><i class="far fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </section>
        </div>
        </>
    )

}

export default Cursos;