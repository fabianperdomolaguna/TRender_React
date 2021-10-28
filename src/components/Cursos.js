import React, {useState} from "react";
import {Link} from "react-router-dom"
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

        if(window.confirm("De verdad quieres eliminar el curso?")) {
            eliminar();
        } else{
            window.location.reload();
        }
    }

    const [busqueda, setBusqueda] = useState('')

    const Filter = (search, lista) => {
        if (search == ''){
            return lista
        } else{
            var expression = new RegExp(search, 'i');
            var listFiletered = [];
            lista.forEach ((C) => {
                if (expression.test(C.Curso) || expression.test(C.Instructor)){
                    listFiletered.push(C)
                }
            })
            return listFiletered;
        }
    }

    const cursos = Filter(busqueda, listaCursos);
   
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
                            <input id="busqueda" type="text" className="form-control" placeholder="Curso o Instructor" onChange={event => setBusqueda(event.target.value)}/>
                        </div>
                        <Link className="col" to='/form_cursos'>
                            <button className="btn btn-success" type="button">Agregar Curso</button>
                        </Link>
                    </div>  
                </div>

                <br/>

                <table className="table table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Nombre del curso</th>
                            <th className="text-center">Area</th>
                            <th className="text-center">Instructor</th>
                            <th className="text-center">Precio</th>
                            <th className="text-center">Estado</th>
                            <th className="text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cursos.map((curso) =>{
                                return(
                                    <tr key={curso.id}>
                                        <th className="text-center">{curso.id}</th>
                                        <td className="text-center">{curso.Curso}</td>
                                        <td className="text-center">{curso.Area}</td>
                                        <td className="text-center">{curso.Instructor}</td>
                                        <td className="text-center">{curso.Costo}</td>
                                        <td className="text-center">{curso.Estado}</td>
                                        <td className="text-center">
                                            <Link to={`/editar_cursos/${curso.id}`}>
                                                <button className='btn btn-sm'><i className="fas fa-edit"></i></button>
                                            </Link>
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