import React from "react";
import background from "./img/Login.jpg"
import "../style/login.css"

function Login(){
    return(
    <>
    <div className="d-lg-flex half">
        <div className="bg order-1 order-md-2" style={{backgroundImage: `url(${background})`}}></div>
        <div className="contents order-2 order-md-1">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-md-7">
                        <h3><strong>TRender University</strong></h3>
                        <p className="mb-4">Aquí encontrarás los mejores cursos que te ayudarán en tu crecimiento profesional</p>

                        <form id='Login'>
                            <div className="form-group first">
                                <label for="username">Usuario</label>
                                <input type="text" className="form-control" placeholder="email@gmail.com" id="username"/>
                            </div>

                            <div className="form-group last mb-3">
                                <label for="password">Contraseña</label>
                                <input type="password" className="form-control" placeholder="Tu contraseña" id="password"/>
                            </div>

                            <div className="d-flex mb-5 align-items-center">
                                <label className="control control--checkbox mb-0"><span className="caption">Recordar datos</span>
                                <input type="checkbox"/>
                                <div className="control__indicator"></div>
                                </label>
                                <span className="ml-auto"><a href="#" className="forgot-pass">¿Olvidó su contraseña?</a></span> 
                            </div>

                            <div className="social-author">
                                <a href="#">
                                    <i className="fab fa-google-plus mr-2"></i> Ingresar con Google
                                </a>
                            </div>

                            <input type="submit" value="ACCEDER" className="btn btn-block btn-primary"/>
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