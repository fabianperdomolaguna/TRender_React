import React from "react";

function Usuarios() {
    return (
        <>
            <div class="content-wrapper">
                <section class="content">
                    <div class="container-fluid">
                        <h1>Gestor de Usuarios y Roles</h1>
                        <table id="TablaUsuarios" class="table table-striped">
                            <thead class="table-dark">
                                <tr>
                                    <th class="text-center">ID Usuario</th>
                                    <th class="text-center">Nombre</th>
                                    <th class="text-center">Rol</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center">Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th class="text-center">1</th>
                                    <td class="text-center">Santiago Montoya P.</td>
                                    <td class="text-center">Administrador</td>
                                    <td class="text-center">Activo</td>
                                    <td class="text-center">
                                        <button id="btnEditar" ><i class="fas fa-eye"></i></button>
                                        <button id="btnEliminar"><i class="fas fa-edit"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Usuarios;