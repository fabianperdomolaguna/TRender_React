import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Cursos from "./components/Cursos";
import Form_Cursos from "./components/Form_Cursos";
import Registrar_Ventas from "./components/registrarVentas";
import Ventas from "./components/Ventas";
import Usuarios from "./components/Usuarios";
import Roles from "./components/Roles";
import Login from "./components/Login";
import editarUsuario from "./components/editarUsuario";
import EditarCurso from "./components/EditarCurso";
import registroUsuario from "./components/registroUsuario";
import './App.css';
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./conexion-bd/funciones";

function App() {

  const [firebaseUser, setFirebaseUser] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {

      if (user) {
        const usuario = {
          id: user.uid,
          email: user.email
        }
        setFirebaseUser(usuario)
      } else {
        setFirebaseUser(null)
      }
    })
  }, [setFirebaseUser])

  return (
    <div className="App">
      <Router>
        <Switch>

          <div>
            <Dashboard usuario={firebaseUser} />
            <Route path="/login" exact component={() => <Login />} />
            <Route exact path="/registro/:nuevousuario" component={registroUsuario} />
            {<Route path="/form_cursos" exact component={() => <Form_Cursos />} />}
            <Route exact path="/editar_cursos/:id" component={EditarCurso} />
            <Route path="/home" exact component={() => <Home />} />
            <Route path="/cursos" exact component={() => <Cursos />} />
            <Route path="/Ventas" exact component={() => <Ventas />} />
            {<Route path="/registrar_ventas" exact component={() => <Registrar_Ventas />} />}
            <Route path="/usuarios" exact component={() => <Usuarios />} />
            <Route path="/roles" exact component={() => <Roles />} />
            <Route exact path="/usuarios/:id" component={editarUsuario} />
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
