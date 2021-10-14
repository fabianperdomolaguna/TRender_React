import React from "react";

function Cursos(){
    return(
        <>
        <div class="content-wrapper">
            <section class="content">
                <div class="container-fluid">
                    <h1>Gestor de Cursos</h1>

                    <br/>
                    
                    <div class="row d-flex align-items-center justify-content-center">
                        <div class="col-sm-1 align-text-bottom"><h5>Buscar:</h5></div>
                        <div class="col-sm-5">
                            <input id="stuff" type="text" class="form-control" placeholder="Nombre del Curso"/>
                        </div>
                        <div class="col"><button onclick="" class="btn btn-dark" type="button">Agregar Curso</button></div>
                    </div>  
                </div>
            </section>
        </div>
        </>
    )

}

export default Cursos;