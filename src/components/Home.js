import React from "react";

function Home() {
    return(
        <>
        <div class="content-wrapper">
            <section class="content">
                <div class="container-fluid">
                    <h1>Información</h1>
                    <br/>
                    <p className="Paragraph_120">La plataforma TRender es una aplicación que permite administar la venta de cursos Online.
                    En el menú de la izquierda se puede acceder a los diferentes módulos de la aplicación.</p>
                </div>
                <div className="Logo">
                    <img src="TRender.png" alt="logo" />
                </div>
            </section>
        </div>
        </>
    )
}

export default Home;