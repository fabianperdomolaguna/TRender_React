import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Cursos from "./components/Cursos";
import Ventas from "./components/Ventas";
import Usuarios from "./components/Usuarios";
import Roles from "./components/Roles";
import Login from "./components/Login";
import editarUsuario from "./components/editarUsuario";
import Form_Cursos from "./components/Form_Cursos";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" exact component={() => <Login />} />
          <Route path="/form_cursos" exact component={() => <Form_Cursos />} />
          <div>
            <Dashboard />
            <Route path="/home" exact component={() => <Home />} />
            <Route path="/cursos" exact component={() => <Cursos />} />
            <Route path="/ventas" exact component={() => <Ventas />} />
            <Route path="/usuarios" exact component={() => <Usuarios />} />
            <Route path="/roles" exact component={() => <Roles />} />
            <Route exact path="/usuarios/:id" component={editarUsuario} />
            <Footer />
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
