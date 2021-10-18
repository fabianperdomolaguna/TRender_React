import React from "react";
import { Link, useHistory } from "react-router-dom";
import "../style/formCursos.css"
import {guardarDatabase} from '../conexion-bd/funciones';

function Form_Cursos(){

    const history = useHistory();

    const saveCurso = (event) => {
        event.preventDefault();

        const elementsArray = [...event.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) => {
            if(currentValue.id){
                accumulator[currentValue.id] = currentValue.value;
            }
            return accumulator
        }, {})

        const sendAnswer = async () => {
            const respuestaTemporal = await guardarDatabase('cursos', formData);
        }

        if(formData.Curso && formData.Area && formData.Instructor && formData.Costo && formData.Estado){
            sendAnswer();
            alert("El curso fue añadido satisfactoriamente")
        } else{
            alert("Faltan campos por introducir")
        }  

        history.push('/cursos');
    }

    return(
        <>
        <h3 className="text-center text-black pt-5">Formulario Cursos</h3>
        <div className="box-form mx-auto">
            <form onSubmit={saveCurso}>
                <div class="mb-3 container">
                    <label for="TextInput" className="form-label">Nombre del Curso</label>
                    <input type="text" id="Curso" className="form-control"/>
                </div>

                <div class="mb-3 container">
                    <label for="Select" className="form-label">Area</label>
                    <select id="Area" className="form-select">
                        <option>OOP</option>
                        <option>Móvil</option>
                        <option>Web</option>
                        <option>Desarrollo de Software</option>
                    </select>
                </div>

                <div className="mb-3 container">
                    <label for="TextInput" className="form-label">Instructor</label>
                    <input type="text" id="Instructor" className="form-control"/>
                </div>

                <div className="mb-3 container">
                    <label for="TextInput" className="form-label">Precio</label>
                    <input type="text" id="Costo" className="form-control"/>
                </div>

                <div className="mb-3 container">
                    <label for="Select" className="form-label">Estado</label>
                    <select id="Estado" className="form-select">
                        <option>Activo</option>
                        <option>Cancelado</option>
                    </select>
                </div>

                <div className="container mx-auto">
                        <button type="submit" className="btn btn-dark mr-3">Enviar</button>
                    <Link to='/cursos'>
                        <button type="reset" className="btn btn-dark">Cancelar</button>
                    </Link>
                </div>
            </form>
        </div>
        </>
    )
}

export default Form_Cursos;