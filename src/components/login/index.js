import React from "react";
//import { makeStyles } from "@material-ui/core/styles";
//import { Box, Grid, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Importar from "../importar";
import { NavBtnLink } from "../Navbar/NavbarElements";
import "./login.css";

const Login = () => {
  const iniciarSesion = () => {
    const params = {
      username: "admin",
      password: "secuencias",
    };

    /*if (response.length > 0) {
      var respuesta = response[0];
      alert(`Bienvenido ${respuesta.nombre} ${respuesta.apellido_paterno}`);
      window.location.href = "./menu";
    } else {
      alert("El usuario o la contraseña no son correctos");
    }*/
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <div className="containerPrincipal">
            <div className="containerSecundario">
              <div className="form-group">
                <label>Usuario: </label>
                <br />
                <input type="text" className="form-control" name="username" />
                <br />
                <label>Contraseña: </label>
                <br />
                <input
                  type="password"
                  className="form-control"
                  name="password"
                />
                <br />
                <NavBtnLink to="/importar" onClick={iniciarSesion()}>
                  Iniciar sesión
                </NavBtnLink>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/importar">
          <Importar />
        </Route>
      </Switch>
    </Router>
  );
};

export default Login;
