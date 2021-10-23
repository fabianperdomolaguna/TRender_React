import React from 'react';
<<<<<<< HEAD
import { Link, withRouter } from "react-router-dom"
import { logOutUsuario } from '../conexion-bd/funciones';
=======
import { Link, NavLink, withRouter } from "react-router-dom"
>>>>>>> 1ff370fa1b2ba5bb0f11b1d26207d4e8c2767851


const handleLogOut = () => {
    logOutUsuario()
}



const Dashboard = ({ usuario }) => {
    console.log(usuario)
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
                                <button type="button" className="btn btn-danger"
                                    onClick={handleLogOut}
                                >LogOut
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
                {!usuario ? (
                    <div className="sidebar">
                        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                            <div className="image"><img src="User1.jpg" className="img-circle elevation-2" alt="User Image" /></div>
                            <div className="info">
                                <a href="#" className="d-block">NO LOGUEADO</a>
                            </div>
                        </div>
                    </div>)
                    :
                    (
                        <div className="sidebar">
                            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                                <div className="image"><img src="User1.jpg" className="img-circle elevation-2" alt="User Image" /></div>
                                <div className="info">
                                    <a href="#" className="d-block">LOGUEADO</a>
                                </div>
                            </div>
                        </div>)
                }
                <nav className="mt-2">
<<<<<<< HEAD
                    {!!usuario &&
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className='nav-item'>
                                <Link className="nav-link" to="/cursos">
                                    <i className='nav-icon fas fa-chart-pie'></i>
                                    <p>Cursos<i className="right fas fa-angle-right"></i></p>
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className="nav-link" to="/">
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
=======
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
>>>>>>> 1ff370fa1b2ba5bb0f11b1d26207d4e8c2767851
                </nav>
            </aside>
        </>
    )
}

export default withRouter(Dashboard);