import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { consultarDocumentoDatabase, actualizarDocumentoDatabase } from '../conexion-bd/funciones';
import { useHistory } from "react-router-dom";


function EditarRol() {

    const history = useHistory();

    const {id} = useParams();

    const [nombre, setNombre] = useState("");

    const consultarRol = async (idRol) => {
        const variables = await consultarDocumentoDatabase('rol', idRol)
        setNombre(variables.rol)
       
    }

    useEffect(() => {
        consultarRol(id)
    }, [id])

    const handleCancelar = (e) => {
        e.preventDefault()
        history.push('/roles')
    }

    const handleActualizarRol = async (e)=>{
        e.preventDefault()
        const updatedRol = {
            nombre,
           
        }
        await actualizarDocumentoDatabase('rol', id, updatedRol)
        alert('Rol modificado de manera exitosa')
        history.push('/roles')
    }

    const updateRol = (event) => {
        event.preventDefault();

        const elementsArray = [...event.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) => {
            if(currentValue.id){
                accumulator[currentValue.id] = currentValue.value;
            }
            return accumulator
        }, {})

        const sendChanges = async () => {
            const respuestaTemporal = await actualizarDocumentoDatabase('rol', id, formData);
        }

        if(formData.nombre  ){
            sendChanges();
            alert("El rol fue actualizado satisfactoriamente")
        } else{
            alert("Faltan campos por introducir")
        }  

        history.push('/roles');
    }

    return(
        <>
        <div className="content-wrapper">
            <section className="content">
                <div className="container">
                    <h1>Editar Rol</h1>
                    <hr />
                    <table id="editarRol" className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th className="text-center">Nombre</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                          

                           

                            <td class="text-center">
                                <input className="form-control" type="text" value={nombre} onChange={e =>setNombre(e.target.value)}/>
                            </td>

                         

                          
                            </tr>
                        </tbody>
                        <tfoot className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-success mt-2" onClick={handleActualizarRol}>Actualizar</button>
                            <button className="btn btn-danger mt-2" onClick={handleCancelar}>Cancelar</button>
                        </tfoot>
                    </table>
                </div>
            </section>
        </div>
        </>
    )
}

export default EditarRol;