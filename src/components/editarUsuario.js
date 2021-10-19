import React, { useState, useEffect } from 'react';
import { useParams,useHistory } from 'react-router-dom';
import { consultarDocumentoDatabase, actualizarDocumentoDatabase } from '../conexion-bd/funciones';


function editarUsuario() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { id } = useParams()
    //console.log(id)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [nombre, setNombre] = useState('')

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [rol, setRol] = useState('')

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [estado, setEstado] = useState('')

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history=useHistory()

    const consultarUsuario = async (idUsuario) => {
        const usuarioTemp = await consultarDocumentoDatabase('usuarios', idUsuario)
        console.log(usuarioTemp)
        setNombre(usuarioTemp.nombre)
        setRol(usuarioTemp.rol)
        setEstado(usuarioTemp.estado)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        consultarUsuario(id)
    }, [id])

    const handleActualizarUsuario = async (e)=>{
        e.preventDefault()
        const usuario = {
            nombre,
            rol,
            estado
        }
        await actualizarDocumentoDatabase('usuarios',id,usuario)
        alert('Usuario modificado de manera exitosa')
        history.push('/usuarios')
    }
    const handleCancelar = (e) => {
        e.preventDefault()
        history.push('/usuarios')
    }
    return (
        <>
            <div class="content-wrapper">
                <section class="content">
                    <div class="container">
                        <h1>Editar Usuario</h1>
                        <hr />
                        <table id="editarUsuarios" class="table table-striped">
                            <thead class="table-dark">
                                <tr>
                                    <th class="text-center">Nombre</th>
                                    <th class="text-center">Rol</th>
                                    <th class="text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center">{nombre}</td>
                                    <td class="text-center">
                                        <input
                                            type="text" placeholder="Rol"
                                            value={rol}
                                            onChange = {(e)=>setRol(e.target.value)}
                                        />
                                    </td>
                                    <td class="text-center">
                                        <input
                                            type="text" placeholder="Rol"
                                            value={estado}
                                            onChange = {(e)=>setEstado(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button
                                class="btn btn-success mt-2"
                                onClick={handleActualizarUsuario}
                                >
                                    Actualizar
                                </button>
                                <button
                                class="btn btn-outline-danger mt-2"
                                onClick={handleCancelar}
                                >
                                    Cancelar
                                </button>
                            </tfoot>
                        </table>
                    </div>
                </section>

            </div>
        </>
    )
}
export default editarUsuario;