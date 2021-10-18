import React, {useState} from "react";
import {Link, withRouter} from "react-router-dom"
import {consultarDatabase, eliminarDocumentoDatabase} from '../conexion-bd/funciones';

function Cursos(){
    const [listaCursos, setListaCursos] = useState([])

    const handleCargarDatos = async () => {
        const listaCursos = await consultarDatabase('cursos')
        setListaCursos(listaCursos)
    }
    handleCargarDatos()

    const deleteCurso = (event) => {
        const eliminar = async () => {
            const respuestaEliminar = await eliminarDocumentoDatabase('cursos', event);
        }
        eliminar();
    }

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
                                        <th className="text-center">{curso.id}</th>
                                        <td className="text-center">{curso.Curso}</td>
                                        <td className="text-center">{curso.Area}</td>
                                        <td className="text-center">{curso.Instructor}</td>
                                        <td className="text-center">{curso.Costo}</td>
                                        <td className="text-center">{curso.Estado}</td>
                                        <td className="text-center">
                                            <button className='btn btn-sm'><i className="fas fa-edit"></i></button>
                                            <button value={curso.id} className='btn btn-sm' onClick={()=>deleteCurso(curso.id)}><i className="far fa-trash-alt"></i></button>
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