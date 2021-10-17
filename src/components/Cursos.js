import React from "react";

function Cursos(){
    return(
        <>
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestor de Cursos</h1>

                    <br/>
                    
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-sm-1 align-text-bottom"><h5>Buscar:</h5></div>
                        <div className="col-sm-5">
                            <input id="stuff" type="text" className="form-control" placeholder="Nombre del Curso"/>
                        </div>
                        <div className="col"><button onclick="" className="btn btn-dark" type="button">Agregar Curso</button></div>
                    </div>  
                </div>
            </section>
        </div>
        </>
    )

}

export default Cursos;