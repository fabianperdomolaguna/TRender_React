import React from 'react';
import {Link, withRouter} from "react-router-dom"

const Login_button = (props) => {
    const user_state = props.user_state;
    if (user_state){
        return (<button onClick={event =>  window.location.href='login.html'} type="button" class="btn btn-dark">
            <i class="fas fa-sign-in-alt"></i> Login
        </button>)
    } else{
        return (<button onClick={event =>  window.location.href='login.html'} type="button" class="btn btn-danger">Logout</button>)
    }
}

/*const Menus_bar = (props) => {
    let menu_name = props.menu_name;
    const  menus ={
        curso: ['/cursos', 'nav-icon fas fa-chart-pie', 'Cursos'],
        venta: ['gestor_ventas.html', 'nav-icon fas fa-tree', 'Venta de Cursos'],
        usuarios: ['gest_usuarios_roles.html', 'nav-icon fas fa-edit', 'Usuarios'],
        roles: ['listar.html', 'nav-icon fas fa-table', 'Roles']
    }
    let values = menus[menu_name];
    return (
        <li class={`nav-item active dropdown ${props.location.pathname === "/" ? "active" : ""}`}>
        <Link class="nav-link" to={values[0]}>
                <i class={values[1]}></i>
                <p>{values[2]}<i class="right fas fa-angle-right"></i></p>
            </Link>
        </li>
    )

}*/

const Dashboard = (props) => {
    return (
        <>
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <Login_button user_state={true} />
                </li>
            </ul>
        </nav>
        
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <Link class="brand-link" to="/home">
                <img src="TRender.png" class="brand-image img-circle elevation-3" />
                <span class="brand-text font-weight-light">Trender University</span>
            </Link>

            <div class="sidebar">
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image"><img src="User1.jpg" class="img-circle elevation-2" alt="User Image"/></div>
                    <div class="info">
                        <a href="#" class="d-block">USUARIO LOGUEADO</a>
                    </div>
                </div>
            </div>

            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <li class='nav-item'>
                        <Link class="nav-link" to="/cursos">
                            <i class='nav-icon fas fa-chart-pie'></i>
                            <p>Cursos<i class="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
                    <li class='nav-item'>
                        <Link class="nav-link" to="/">
                            <i class='nav-icon fas fa-tree'></i>
                            <p>Venta de Cursos<i class="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
                    <li class='nav-item'>
                        <Link class="nav-link" to="/usuarios">
                            <i class='nav-icon fas fa-edit'></i>
                            <p>Usuarios<i class="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
                    <li class='nav-item'>
                        <Link class="nav-link" to="/roles">
                            <i class='nav-icon fas fa-table'></i>
                            <p>Roles<i class="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
        </>
    )
}

export default withRouter(Dashboard);