import React, {useState, useEffect} from "react";
import {consultarDatabase} from '../conexion-bd/funciones';
import {Link } from 'react-router-dom'

function Usuarios() {
    const [listaUsuarios, setListaUsuarios] = useState([])

    const handleCargarDatos = async () => {
        const listaTemporal = await consultarDatabase('usuarios')
        setListaUsuarios(listaTemporal)
    }
    useEffect(()=>{
        handleCargarDatos()
    },[])
   
    return (
        <>
            <div class="content-wrapper">
                <section class="content">
                    <div class="container-fluid">
                        <h1>Gestor de Usuarios y Roles</h1>
                        <hr/>
                        <table id="TablaUsuarios" class="table table-striped">
                            <thead class="table-dark">
                                <tr>
                                    <th class="text-center">ID Usuario</th>
                                    <th class="text-center">Nombre</th>
                                    <th class="text-center">Correo</th>
                                    <th class="text-center">Rol</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center">Accion</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    listaUsuarios.map((usuario,index)=>{
                                        return(
                                        <tr key={usuario.id}>
                                        <th class="text-center">{index + 1}</th>
                                        <td class="text-center">{usuario.nombre}</td>
                                        <td class="text-center">{usuario.email}</td>
                                        <td class="text-center">{usuario.rol}</td>
                                        <td class="text-center">{usuario.estado}</td>
                                        <td class="text-center">
                                            {/* <Link class="btn btn-sm" 
                                            ><i class="fas fa-eye"></i>
                                            </Link> */}
                                            <Link class="btn btn-sm"
                                            to={`/usuarios/${usuario.id}`}
                                            ><i class="fas fa-edit"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                    )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Usuarios;