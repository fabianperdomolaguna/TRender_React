import React from "react";
import { Link, useHistory } from "react-router-dom";
import "../style/formCursos.css"
import {guardarDatabase} from '../conexion-bd/funciones';

function Agregar_Rol(){

    const history = useHistory();

    const saveRol = (event) => {
        event.preventDefault();

        const elementsArray = [...event.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) => {
            if(currentValue.id){
                accumulator[currentValue.id] = currentValue.value;
            }
            return accumulator
        }, {})

        const sendAnswer = async () => {
            const respuestaTemporal = await guardarDatabase('rol', formData);
        }

        if(formData.nombre){
            sendAnswer();
            alert("El rol fue añadido satisfactoriamente")
        } else{
            alert("Faltan campos por introducir")
        }  

        history.push('/roles');
    }

    return(
        <>
        <h3 className="text-center text-black pt-5">Formulario Rol</h3>
        <div className="box-form mx-auto">
            <form onSubmit={saveRol}>
                <div class="mb-3 container">
                    <label for="TextInput" className="form-label">Nombre del Rol</label>
                    <input type="text" id="nombre" className="form-control"/>
                </div>

               

                <div className="container mx-auto">
                        <button type="submit" className="btn btn-dark mr-3">Enviar</button>
                    <Link to='/roles'>
                        <button type="reset" className="btn btn-dark">Cancelar</button>
                    </Link>
                </div>
            </form>
        </div>
        </>
    )
}

export default Agregar_Rol;