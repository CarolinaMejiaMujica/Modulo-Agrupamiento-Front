import React from "react";
import {
  Nav,
  NavMenu,
  NavBtn,
  NavLink,
  NavBtnLink,
  NavDatos,
} from "./NavbarElements";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Importar from "../importar";

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 800,
    color: "white",
  },
}));

const Navbar = () => {
  const classes = useStyles();
  return (
    <Nav fixed="top">
      <NavMenu>
        <Typography variant="h5" noWrap className={classes.bold}>
          Análisis de Secuencias Genómicas SARS-CoV-2 Perú
        </Typography>
        <NavLink>Actualizado el 01/09/2021</NavLink>
        <NavDatos>
          {" "}
          Facilitado por datos de
          <a
            rel="noopener noreferrer"
            href="https://www.gisaid.org"
            target="_blank"
          >
            <img
              src="https://www.gisaid.org/fileadmin/gisaid/img/schild.png"
              alt="gisaid-logo"
              width="60"
            ></img>
          </a>
          .
        </NavDatos>
      </NavMenu>
      <Router>
        <NavBtn>
          <NavBtnLink to="/importar">Importar Datos</NavBtnLink>
        </NavBtn>
      </Router>
    </Nav>
  );
};

export default Navbar;
