import React from 'react';
import { logOutUsuario } from '../conexion-bd/funciones';
import { Link, NavLink, withRouter } from "react-router-dom"


function Dashboard({ usuario }) {
<<<<<<< HEAD
    // const Login_button = (props) => {
    //     const user_state = props.user_state;
    //     if (user_state) {
    //         return (<button onClick={event => window.location.href = 'login.html'} type="button" class="btn btn-dark">
    //             <i class="fas fa-sign-in-alt"></i> Login
    //         </button>)
    //     } else {
    //         return (<button onClick={event => window.location.href = 'login.html'} type="button" class="btn btn-danger">Logout</button>)
    //     }
    // }
=======
>>>>>>> 00b02d21eb465789dcc5b5d3a01529f09a88bf40
    const handleLogOut = () => {
        logOutUsuario()
    }

    console.log(usuario);
    return (
        <>

            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav ml-auto">
                    {
                        !usuario ? (
                            <Link className="nav-item" to="/login">
                                <button type="button" className="btn btn-dark">
                                    <i class="fas fa-sign-in-alt"></i> LogIn
                                </button>
                            </Link>)
                            :
                            (<Link className="nav-item" to="/login">
                                <button type="button" className="btn btn-danger" onClick={handleLogOut}>LogOut</button>
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
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false" />
                    <li className='nav-item'>
                        <Link className="nav-link" to="/cursos">
                            <i className='nav-icon fas fa-chart-pie'></i>
                            <p>Cursos<i className="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className="nav-link" to="/Ventas">
                            <i className='nav-icon fas fa-tree'></i>
                            <p>Venta de Cursos<i className="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className="nav-link" to="/usuarios">
                            <i className='nav-icon fas fa-edit'></i>
                            <p>Usuarios<i className="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className="nav-link" to="/roles">
                            <i className='nav-icon fas fa-table'></i>
                            <p>Roles<i className="right fas fa-angle-right"></i></p>
                        </Link>
                    </li>
<<<<<<< HEAD

                    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                    <ul className="navbar-nav ml-auto">
                        {
                            !usuario ? (
                                <Link className="nav-item" to="/login">
                                    <button type="button" className="btn btn-dark">
                                        <i class="fas fa-sign-in-alt"></i> LogIn
                                    </button>
                                </Link>)
                                :
                                (<Link className="nav-item" to="/login">
                                    <button type="button" className="btn btn-danger"
                                        onClick={handleLogOut}
                                    >LogOut
                                    </button>
                                </Link>)
                        }

                    </ul>
                </nav> 
=======
>>>>>>> 00b02d21eb465789dcc5b5d3a01529f09a88bf40
                </nav>
            </aside>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <Link className="brand-link" to="/home">
                    <img src="TRender.png" className="brand-image img-circle elevation-3" />
                    <span className="brand-text font-weight-light">Trender University</span>
                </Link>
                {!usuario ? (
                    <div className="sidebar">
                        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                            <div className="image"><img src="User1.jpg" className="img-circle elevation-2" alt="User Image" /></div>
                            <div className="info">
                                <label className = "text-white">NO LOGUEADO</label>
                            </div>
                        </div>
                    </div>)
                    :
                    (
                        <div className="sidebar">
                            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                                <div className="image"><img src="User1.jpg" className="img-circle elevation-2" alt="User Image" /></div>
                                <div className="info">
                                    <label className = "text-white">LOGUEADO</label>
                                </div>
                            </div>
                        </div>)
                }
                <nav className="mt-2">
                    {!!usuario &&
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className='nav-item'>
                                <Link className="nav-link" to="/cursos">
                                    <i className='nav-icon fas fa-chart-pie'></i>
                                    <p>Cursos<i className="right fas fa-angle-right"></i></p>
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className="nav-link" to="/Ventas">
                                    <i className='nav-icon fas fa-tree'></i>
                                    <p>Venta de Cursos<i className="right fas fa-angle-right"></i></p>
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className="nav-link" to="/usuarios">
                                    <i className='nav-icon fas fa-edit'></i>
                                    <p>Usuarios<i className="right fas fa-angle-right"></i></p>
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className="nav-link" to="/roles">
                                    <i className='nav-icon fas fa-table'></i>
                                    <p>Roles<i className="right fas fa-angle-right"></i></p>
                                </Link>
                            </li>
                        </ul>
                    }
                </nav>
            </aside>

        </>
    )
}

export default withRouter(Dashboard);