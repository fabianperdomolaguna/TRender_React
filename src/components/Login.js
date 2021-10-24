import React, { useState } from "react";
import "../style/login.css"
import { Link, useHistory } from 'react-router-dom'
import { loginUsuario } from "../conexion-bd/funciones";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory()

    const handleClick = async (e) => {
        e.preventDefault();
        if (email && password) {
            try {
                const user = await loginUsuario(email, password)
                history.push('/home')
            } catch (error) {
                alert("Usuario o contraseña invalidos")
            }
        } else {
            alert("Usuario o contraseña invalidos")
        }
    }


    return (
        <>
            <div class="justify-content-sm-center">
                <div class="contents order-2 order-md-1">
                    <div class="container">
                        <div class="row">
                            <div class="box-form mx-auto">
                                <h3><strong>TRender University</strong></h3>
                                <p class="mb-4 text-black">Aquí encontrarás los mejores cursos que te ayudarán en tu crecimiento profesional</p>

                                <form id='Login'>
                                    <div class="form-group first">
                                        <label class="text-black" for="username">Correo</label>
                                        <input type="text" className="form-control" placeholder="Ingresa tu correo" id="username"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)} />
                                    </div>

                                    <div class="form-group last mb-3">
                                        <label class="text-black" for="password">Contraseña</label>
                                        <input type="password" className="form-control" placeholder="Ingresa tu contraseña" id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </div>

                                    <input type="submit" value="ACCEDER" class="btn btn-block btn-outline-success"
                                        onClick={handleClick}
                                    />
                                    <br />
                                    <div class="social-author">
                                        <Link class="btn btn-sm btn-outline-info text-black"
                                            to={`/registro/:nuevousuario`}>
                                            Registrarse
                                        </Link>
                                    </div>


                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;