/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { guardarDatabase, actualizarDocumentoDatabase, crearUsuario } from '../conexion-bd/funciones';
import { Link, useHistory } from "react-router-dom";

function registroUsuario() {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    
    const history=useHistory()

    const handleClick = async (e) => {
        e.preventDefault();
        if (nombre && correo && password) {
            crearUsuario(correo,password,nombre)
            alert("Usuario registrado de forma exitosa")
            history.push('/')
        }else{
            alert("Faltan campos por introducir")
        }  
    }

    return (
        <>
            <h3 className="text-center text-black pt-5">Registro</h3>
            <div className="box-form mx-auto">
                <form>
                    <div class="mb-3 container">
                        <label for="TextInput" className="form-label">Nombre completo:</label>
                        <input type="text" id="nombre" className="form-control"
                            placeholder="Ingrese su nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div class="mb-3 container">
                        <label for="TextInput" className="form-label">Correo:</label>
                        <input type="text" id="email" className="form-control"
                            placeholder="Ingrese su correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div className="mb-3 container">
                        <label for="TextInput" className="form-label">Contraseña:</label>
                        <input type="password" id="password" className="form-control"
                            placeholder="Ingrese su contraseña con al menos 6 digitos"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="container mx-auto">
                        <button type="submit" className="btn btn-dark mr-3"
                            onClick={handleClick}
                        >Registrar</button>
                        <Link to='/'>
                            <button type="reset" className="btn btn-dark">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default registroUsuario;