import React from "react";

function Login(){
    return(
    <>
        <div class="d-lg-flex half">
            <div class="bg order-1 order-md-2" style="background-image: url('../../dist/img/Login.jpg');"></div>
            <div class="contents order-2 order-md-1">
                
                <div class="container">
                    <div class="row align-items-center justify-content-center">
                        <div class="col-md-7">
                            <h3><strong>TRender University</strong></h3>
                            <p class="mb-4">Aquí encontrarás los mejores cursos que ayudarán en tu crecimiento profesional</p>
                            <form action="#" method="post">
                                <div class="form-group first">
                                    <label for="username">Usuario</label>
                                    <input type="text" class="form-control" placeholder="email@gmail.com" id="username">
                                                                
                                <div class="form-group last mb-3">
                                    <label for="password">Contraseña</label>
                                    <input type="password" class="form-control" placeholder="Tu contraseña" id="password">
                                </div>
                                
                                <div class="d-flex mb-5 align-items-center">
                                    <label class="control control--checkbox mb-0"><span class="caption">Recordar datos</span>
                                    <input type="checkbox" checked="checked"/>
                                    <div class="control__indicator"></div>
                                    </label>
                                    <span class="ml-auto"><a href="#" class="forgot-pass">¿Olvidó su contraseña?</a></span> 
                                </div>
                                   
                                <div class="social-author">
                                    <a href="#">
                                        <i class="fab fa-google-plus mr-2"></i> Ingresar con Google
                                    </a>
                                </div>
                                </div>
                            
                            <input type="submit" value="ACCEDER" class="btn btn-block btn-primary">

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