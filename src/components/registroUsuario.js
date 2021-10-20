/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { consultarDocumentoDatabase, actualizarDocumentoDatabase } from '../conexion-bd/funciones';
import { Link, useHistory } from "react-router-dom";

function registroUsuario (){
    

    return(
        <>
        <h3 className="text-center text-black pt-5">Registro</h3>
        <div className="box-form mx-auto">
            <form>
                <div class="mb-3 container">
                    <label for="TextInput" className="form-label">Ingrese su nombre completo:</label>
                    <input type="text" id="Curso" className="form-control"/>
                </div>

                <div class="mb-3 container">
                    <label for="TextInput" className="form-label">Ingrese su correo:</label>
                    <input type="text" id="email" className="form-control"/>
                </div>

                <div className="mb-3 container">
                    <label for="TextInput" className="form-label">Ingrese su contraseña:</label>
                    <input type="text" id="password" className="form-control"/>
                </div>

                <div className="container mx-auto">
                        <button type="submit" className="btn btn-dark mr-3">Registrar</button>
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