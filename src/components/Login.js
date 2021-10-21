import React from "react";
import background from "./img/Login.jpg"
import "../style/login.css"
import { Link } from 'react-router-dom'

function Login() {
    return (
        <>
            <div class="d-lg-flex half justify-content-sm-center">
                {/* <div class="bg order-1 order-md-2" style={{ backgroundImage: `url(${background})` }}></div> */}
                <div class="contents order-2 order-md-1">
                    <div class="container">
                        <div class="row">
                            <div class="box-form mx-auto">
                                <h3><strong>TRender University</strong></h3>
                                <p class="mb-4 text-black">Aquí encontrarás los mejores cursos que te ayudarán en tu crecimiento profesional</p>

                                <form id='Login'>
                                    <div class="form-group first">
                                        <label class="text-black" for="username">Usuario</label>
                                        <input type="text" className="form-control" placeholder="email@gmail.com" id="username" />
                                    </div>

                                    <div class="form-group last mb-3">
                                        <label class="text-black" for="password">Contraseña</label>
                                        <input type="password" className="form-control" placeholder="Ingresa tu contraseña" id="password" />
                                    </div>

                                    <div class="d-flex mb-5 align-items-center">
                                        <label class="control control--checkbox mb-0">
                                            <span class="caption text-black">Recordar datos</span>
                                            <input type="checkbox" />
                                            <div class="control__indicator"></div>
                                        </label>
                                        <span class="ml-auto"><a href="#" class="forgot-pass">¿Olvidó su contraseña?</a></span>
                                    </div>

                                    <div class="social-author">
                                        <Link class="btn btn-sm text-black"
                                            to={`/registro/:nuevousuario`}>
                                            Registrarse
                                        </Link>
                                    </div>

                                    <input type="submit" value="ACCEDER" class="btn btn-block btn-secondary" />
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