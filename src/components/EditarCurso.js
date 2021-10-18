import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { consultarDocumentoDatabase, actualizarDocumentoDatabase } from '../conexion-bd/funciones';
import { Link, useHistory } from "react-router-dom";
import "../style/formCursos.css"

function EditarCurso() {

    const history = useHistory();

    const {id} = useParams();

    const [Curso, setCurso] = useState("");
    const [Area, setArea] = useState("");
    const [Instructor, setInstructor] = useState("");
    const [Costo, setCosto] = useState("");
    const [Estado, setEstado] = useState("");

    const consultarCurso = async (idCurso) => {
        const variables = await consultarDocumentoDatabase('cursos', idCurso)
        setCurso(variables.Curso)
        setArea(variables.Area)
        setInstructor(variables.Instructor)
        setCosto(variables.Costo)
        setEstado(variables.Estado)
    }

    useEffect(() => {
        consultarCurso(id)
    }, [id])

    const updateCurso = (event) => {
        event.preventDefault();

        const elementsArray = [...event.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) => {
            if(currentValue.id){
                accumulator[currentValue.id] = currentValue.value;
            }
            return accumulator
        }, {})

        const sendChanges = async () => {
            const respuestaTemporal = await actualizarDocumentoDatabase('cursos', id, formData);
        }

        if(formData.Curso && formData.Area && formData.Instructor && formData.Costo && formData.Estado){
            sendChanges();
            alert("El curso fue actualizado satisfactoriamente")
        } else{
            alert("Faltan campos por introducir")
        }  

        history.push('/cursos');
    }

    return(
        <>
        <h3 className="text-center text-black pt-5">Formulario Editar Cursos</h3>
        <div className="box-form mx-auto">
            <form onSubmit={updateCurso}>
                <div class="mb-3 container">
                    <label for="TextInput" className="form-label">Nombre del Curso</label>
                    <input type="text" id="Curso" className="form-control" value={Curso} onChange={e =>setCurso(e.target.value)}/>
                </div>

                <div class="mb-3 container">
                    <label for="Select" className="form-label">Area</label>
                    <select id="Area" className="form-select" value={Area} onChange={e =>setArea(e.target.value)}>
                        <option>OOP</option>
                        <option>Móvil</option>
                        <option>Web</option>
                        <option>Desarrollo de Software</option>
                    </select>
                </div>

                <div className="mb-3 container">
                    <label for="TextInput" className="form-label">Instructor</label>
                    <input type="text" id="Instructor" className="form-control" value={Instructor} onChange={e =>setInstructor(e.target.value)}/>
                </div>

                <div className="mb-3 container">
                    <label for="TextInput" className="form-label">Precio</label>
                    <input type="text" id="Costo" className="form-control" value={Costo} onChange={e =>setCosto(e.target.value)}/>
                </div>

                <div className="mb-3 container">
                    <label for="Select" className="form-label">Estado</label>
                    <select id="Estado" className="form-select" value={Estado} onChange={e =>setEstado(e.target.value)}>
                        <option>Activo</option>
                        <option>Cancelado</option>
                    </select>
                </div>

                <div className="container mx-auto">
                        <button type="submit" className="btn btn-dark mr-3">Actualizar</button>
                    <Link to='/cursos'>
                        <button type="reset" className="btn btn-dark">Cancelar</button>
                    </Link>
                </div>
            </form>
        </div>
        </>
    )
}

export default EditarCurso;