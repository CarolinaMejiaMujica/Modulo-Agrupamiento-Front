import React from "react";
import "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Mapa, Tiempo } from "./graficos";
import Cargando from "./cargando";
import CargandoCantidad from "./cargandoCantidad";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cantidad: {
    paddingTop: "5px",
    color: "#49DA2B",
  },
  cantidad2: {
    paddingTop: "5px",
    color: "#DA432B",
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

const EspacioTiempo = ({ estado, grafico }) => {
  const classes = useStyles();

  function convert(str) {
    var date = new Date(str);
    var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const fechaIni = convert(estado.fechaIni);
  const fechaFin = convert(estado.fechaFin);
  const deps = estado.departamentos;

  const [bandera, setBandera] = React.useState(false);
  const [cargandoCircular, setCargandoCircular] = React.useState(true);
  const [cargandoLineal, setCargandoLineal] = React.useState(true);
  const [cargandoMapa, setCargandoMapa] = React.useState(true);

  const [cantidadAnalisis, setCantidadAnalisis] = React.useState(0);
  const [cantidadTotal, setCantidadTotal] = React.useState(0);
  const [cargandoCantidadAnalisis, setCargandoCantidadAnalisis] =
    React.useState(true);
  const [cargandoCantidadTotal, setCargandoCantidadTotal] =
    React.useState(true);

  const graficos = () => {
    setCargandoCircular(true);
    setCargandoLineal(true);
    setCargandoMapa(true);
    setCargandoCantidadAnalisis(true);
    setCargandoCantidadTotal(true);

    Axios.post(`http://3.86.154.241/cantidades/`).then((response) => {
      const val1 = response.data;
      setCantidadAnalisis(val1["cantidadAnalisis"]);
      setCantidadTotal(val1["cantidadTotal"]);
      setBandera(false);
      setCargandoCantidadAnalisis(false);
      setCargandoCantidadTotal(false);
    });

    const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}`;
    Axios.post(`http://3.86.154.241/graficolineal/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          const item = JSON.parse(val1);
          const element = document.getElementById("graficolineal");
          if (element) element.removeChild(element.firstChild);
          window.Bokeh.embed.embed_item(item, "graficolineal");
          setCargandoLineal(false);
        }
      })
      .catch((err) => console.log(err));
    Axios.post(`http://3.86.154.241/mapa/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          const item = JSON.parse(val1);
          const element = document.getElementById("mapa");
          if (element) element.removeChild(element.firstChild);
          window.Bokeh.embed.embed_item(item, "mapa");
          setCargandoMapa(false);
        }
      })
      .catch((err) => console.log(err));
    Axios.post(`http://3.86.154.241/graficocircular/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          const item = JSON.parse(val1);
          const element = document.getElementById("graficocircular");
          if (element) element.removeChild(element.firstChild);
          window.Bokeh.embed.embed_item(item, "graficocircular");
          setCargandoCircular(false);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  };

  React.useEffect(() => {
    graficos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grafico]);

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
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Box className={classes.paper1} boxShadow={0} height={150}>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    className={classes.bold}
                  >
                    Cantidad de secuencias genómicas SARS-CoV-2 obtenidas de
                    GISAID
                  </Typography>
                  {cargandoCantidadTotal && <CargandoCantidad />}
                  {!cargandoCantidadTotal && (
                    <Typography
                      variant="h3"
                      align="center"
                      className={classes.cantidad}
                    >
                      {cantidadTotal}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className={classes.paper1} boxShadow={0} height={150}>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    className={classes.bold}
                  >
                    Cantidad de secuencias genómicas SARS-CoV-2 utilizadas en el
                    análisis
                  </Typography>
                  {cargandoCantidadAnalisis && <CargandoCantidad />}
                  {!cargandoCantidadAnalisis && (
                    <Typography
                      variant="h3"
                      align="center"
                      className={classes.cantidad2}
                    >
                      {cantidadAnalisis}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Box className={classes.paper1} boxShadow={0} height={480}>
                <Typography
                  variant="h6"
                  align="center"
                  className={classes.bold}
                >
                  Distribución de secuencias genómicas SARS-CoV-2 por variantes
                </Typography>
                {cargandoCircular && <Cargando />}
                {!cargandoCircular && (
                  <Mapa id="graficocircular" className="bk-root"></Mapa>
                )}
              </Box>
            </Grid>
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

export default EspacioTiempo;
