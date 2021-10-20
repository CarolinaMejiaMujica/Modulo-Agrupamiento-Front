import React from "react";
import "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Mapa, Tiempo } from "./graficos";
import Cargando from "./cargando";
/*import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { NavBtn, Button } from "./botones";
import PropTypes from "prop-types";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import deLocale from "date-fns/locale/es";
import Checkbox from "@material-ui/core/Checkbox";
import clsx from "clsx";*/

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: 600,
  },
  paper1: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
  },
  paper2: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    textAlign: "center",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  root2: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#00000",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#003E97",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
  },
}));

const EspacioTiempo = ({ estado, item1, item2, item3 }) => {
  const classes = useStyles();
  const { cargandoCircular, cargandoLineal, cargandoMapa, bandera } = estado;

  React.useEffect(() => {
    if (item1) {
      const element = document.getElementById("graficolineal");
      if (element) element.removeChild(element.firstChild);
      window.Bokeh.embed.embed_item(item1, "graficolineal");
    }
  }, [item1]);

  React.useEffect(() => {
    if (item2) {
      const element = document.getElementById("mapa");
      if (element) element.removeChild(element.firstChild);
      window.Bokeh.embed.embed_item(item2, "mapa");
    }
  }, [item2]);

  React.useEffect(() => {
    if (item3) {
      const element = document.getElementById("graficocircular");
      if (element) element.removeChild(element.firstChild);
      window.Bokeh.embed.embed_item(item3, "graficocircular");
    }
  }, [item3]);

  /*const click = React.useCallback(()=>{
      if (pasarDatos){
        pasarDatos(state);
      }
      
    },[pasarDatos,setBandera,setCargandoLineal,setCargandoMapa,setCargandoCircular,nombreDepartamentos,params,state]);*/

  /*React.useEffect(() => {
      click();
      console.log("hola");
    },[click]);*/

  return (
    <Grid container>
      {!bandera && (
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Box className={classes.paper1} boxShadow={0} height={650}>
              <Typography variant="h6" align="center" className={classes.bold}>
                Variantes identificadas en el espacio
              </Typography>
              {cargandoMapa && <Cargando />}
              {!cargandoMapa && <Mapa id="mapa" className="bk-root"></Mapa>}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.paper1} boxShadow={0} height={650}>
              <Typography variant="h6" align="center" className={classes.bold}>
                Porcentaje de variantes identificadas en el tiempo
              </Typography>
              {cargandoCircular && <Cargando />}
              {!cargandoCircular && (
                <Tiempo id="graficocircular" className="bk-root"></Tiempo>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box className={classes.paper1} boxShadow={0} height={750}>
              <Typography variant="h6" align="center" className={classes.bold}>
                Variantes identificadas en el tiempo
              </Typography>
              {cargandoLineal && <Cargando />}
              {!cargandoLineal && (
                <Tiempo id="graficolineal" className="bk-root"></Tiempo>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
      {bandera && (
        <Grid item xs={12} sm={12}>
          <Box className={classes.paper1} boxShadow={0} height={60}>
            <Typography variant="h6" align="center" className={classes.bold}>
              No hay datos para los filtros seleccionados
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

/*EspacioTiempo.propTypes = {
  pasarDatos: PropTypes.func.isRequired,
};*/

export default EspacioTiempo;
