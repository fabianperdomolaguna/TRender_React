import React from 'react';
import { Link, NavLink, withRouter } from "react-router-dom"



// <button onClick={event =>  window.location.href='login.html'} type="button" class="btn btn-dark">
//     <i class="fas fa-sign-in-alt"></i> Login
// </button>

// <button onClick={event =>  window.location.href='login.html'} type="button" 
// class="btn btn-danger">Logout
// </button>


// const LoginButton = (props) => {
//     const user_state = props.user;
//     if (user_state){
//         return (<button onClick={event =>  window.location.href='login.html'} type="button" class="btn btn-dark">
//             <i class="fas fa-sign-in-alt"></i> Login
//         </button>)
//     } else{
//         return (<button onClick={event =>  window.location.href='login.html'} type="button" class="btn btn-danger">Logout</button>)
//     }
// }

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

const Dashboard = ({usuario}) => {
    console.log(usuario)
    return (
        <>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav ml-auto">
                    {
                        usuario ? (
                        <Link className="nav-item" to="/login">
                            <button type="button" className="btn btn-dark">
                                <i class="fas fa-sign-in-alt"></i> LogIn
                            </button>
                        </Link>)
                        : 
                        (<Link className="nav-item" to="/logout">
                            <button type="button" className="btn btn-danger" >LogOut
                            </button>
                        </Link>)
                    }
                </ul>
            </nav>

            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <Link className="brand-link" to="/home">
                    <img src="TRender.png" className="brand-image img-circle elevation-3" />
                    <span className="brand-text font-weight-light">Trender University</span>
                </Link>

                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image"><img src="User1.jpg" className="img-circle elevation-2" alt="User Image" /></div>
                        <div className="info">
                            <a href="#" className="d-block">USUARIO LOGUEADO</a>
                        </div>
                    </div>
                </div>

                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className='nav-item'>
                            <NavLink className="nav-link" to="/cursos">
                                <i className='nav-icon fas fa-chart-pie'></i>
                                <p>Cursos<i className="right fas fa-angle-right"></i></p>
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className="nav-link" to="/ventas">
                                <i className='nav-icon fas fa-tree'></i>
                                <p>Venta de Cursos<i className="right fas fa-angle-right"></i></p>
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className="nav-link" to="/usuarios">
                                <i className='nav-icon fas fa-edit'></i>
                                <p>Usuarios<i className="right fas fa-angle-right"></i></p>
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className="nav-link" to="/roles">
                                <i className='nav-icon fas fa-table'></i>
                                <p>Roles<i className="right fas fa-angle-right"></i></p>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default withRouter(Dashboard);