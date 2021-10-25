import React from "react";
import "./App.css";
import { Helmet } from "react-helmet";
import EspacioTiempo from "./components/espacio-temporal";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Tabla from "./components/tabla";
import Agrupamientokmeans from "./components/agrupamiento-kmeans";
import Agrupamientojerarquico from "./components/agrupamiento-jerarquico";
import Agrupamientodbscan from "./components/agrupamiento-dbscan";
import Importar from "./components/importar";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import deLocale from "date-fns/locale/es";
import { Box, Container, Grid, MenuItem } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Typography, FormControl } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { NavBtnGenerar, Button } from "./components/espacio-temporal/botones";
import clsx from "clsx";
import {
  Nav,
  NavMenu,
  NavBtn,
  NavLink,
  NavBtnLink,
  NavDatos,
} from "./components/Navbar/NavbarElements";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: 800,
    color: "white",
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

function App() {
  const classes = useStyles();
  const options = [
    { id_algoritmo: 0, nombre: "K-means" },
    { id_algoritmo: 1, nombre: "Jerárquico" },
    { id_algoritmo: 2, nombre: "DBSCAN" },
  ];
  const departamentos = [
    "Todos",
    "Amazonas",
    "Áncash",
    "Apurímac",
    "Arequipa",
    "Ayacucho",
    "Cajamarca",
    "Callao",
    "Cusco",
    "Huancavelica",
    "Huánuco",
    "Ica",
    "Junín",
    "La Libertad",
    "Lambayeque",
    "Lima",
    "Loreto",
    "Madre de Dios",
    "Moquegua",
    "Pasco",
    "Piura",
    "Puno",
    "San Martín",
    "Tacna",
    "Tumbes",
    "Ucayali",
  ];

  const [inicioDate, setInicioDate] = React.useState(
    "Wed Mar 05 2020 20:51:01 GMT-0500"
  );
  const [finDate, setFinDate] = React.useState(
    "Wed Sep 01 2021 20:00:01 GMT-0500"
  );
  const [algoritmo, setAlgoritmo] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [nombreDepartamentos] = React.useState(departamentos);

  const [state, setState] = React.useState({
    fechaIni: inicioDate,
    fechaFin: finDate,
    algoritmo: algoritmo,
    departamentos: nombreDepartamentos,
  });

  const [graficos, setGraficos] = React.useState(false);
  const [kmeans, setKmeans] = React.useState(false);
  const [jerarquico, setJerarquico] = React.useState(false);
  const [dbscan, setDbscan] = React.useState(false);
  const [tabla, setTabla] = React.useState(false);

  const [mostrarkmeans, setMostrarKmeans] = React.useState(false);
  const [mostrarjerarquico, setMostrarJerarquico] = React.useState(false);
  const [mostrardbscan, setMostrarDbscan] = React.useState(false);

  const [isDisabled, setisDisabled] = React.useState(true);

  function handleChangeDepartamentos(name) {
    const find = nombreDepartamentos.indexOf(name);
    if (name === "Todos" && nombreDepartamentos.includes(name)) {
      nombreDepartamentos.splice(find, 1);
      setisDisabled(false);
      return;
    }
    if (find > -1) {
      nombreDepartamentos.splice(find, 1);
    } else {
      if (name === "Todos") {
        setisDisabled(true);
        nombreDepartamentos.push(name);
        //setNombreDepartamentos(departamentos);
        return;
      }
      nombreDepartamentos.push(name);
    }
  }

  const handleInicioDateChange = (date) => {
    setInicioDate(date);
    setState({
      fechaIni: date,
      fechaFin: state.fechaFin,
      algoritmo: state.algoritmo,
      departamentos: state.departamentos,
    });
  };
  const handleFinDateChange = (date) => {
    setFinDate(date);
    setState({
      fechaIni: state.fechaIni,
      fechaFin: date,
      algoritmo: state.algoritmo,
      departamentos: state.departamentos,
    });
  };

  const handleChange = (event) => {
    setAlgoritmo(event.target.value);
    setState({
      fechaIni: state.fechaIni,
      fechaFin: state.fechaFin,
      algoritmo: event.target.value,
      departamentos: state.departamentos,
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const convert = React.useCallback((str) => {
    var date = new Date(str);
    var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }, []);

  const fechaIni = convert(state.fechaIni);
  const fechaFin = convert(state.fechaFin);
  const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}`;

  const click = () => {
    if (state.algoritmo === 0) {
      setKmeans(kmeans ? false : true);
      setMostrarKmeans(true);
      setMostrarJerarquico(false);
      setMostrarDbscan(false);
    } else if (state.algoritmo === 1) {
      setJerarquico(jerarquico ? false : true);
      setMostrarKmeans(false);
      setMostrarJerarquico(true);
      setMostrarDbscan(false);
    } else if (state.algoritmo === 2) {
      setDbscan(dbscan ? false : true);
      setMostrarKmeans(false);
      setMostrarJerarquico(false);
      setMostrarDbscan(true);
    }
    setTabla(tabla ? false : true);
    setGraficos(graficos ? false : true);
  };

  React.useEffect(() => {
    click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [stateImportar, setStateImportar] = React.useState(true);

  const boton = () => {
    setStateImportar(stateImportar ? false : true);
    console.log(stateImportar);
  };

  return (
    <Router>
      <Helmet>
        <style>{"body { background-color: #F6F7FF; }"}</style>
      </Helmet>
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
        <NavBtn onClick={boton}>
          {stateImportar && (
            <NavBtnLink to="/importar">Importar Datos</NavBtnLink>
          )}
          {!stateImportar && (
            <NavBtnLink to="/graficos">Ver gráficos</NavBtnLink>
          )}
        </NavBtn>
      </Nav>
      <Switch>
        <Route path="/graficos">
          <section className="contenido wrapper">
            <Grid item xs={12} sm={12}>
              <Box className={classes.paper2} boxShadow={0}>
                <Container maxWidth={false}>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={deLocale}
                  >
                    <Grid
                      container
                      justifyContent="space-around"
                      alignItems="stretch"
                    >
                      <FormControl className={classes.formControl}>
                        <Typography
                          variant="subtitle2"
                          htmlFor="name"
                          align="left"
                        >
                          Fecha Inicio
                        </Typography>
                        <KeyboardDatePicker
                          disableToolbar
                          minDate={"2020-03-06"}
                          maxDate={"2021-09-02"}
                          style={{ margin: "0%" }}
                          inputProps={{
                            min: 0,
                            style: { textAlign: "center" },
                          }}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="fecha-inicio"
                          width="100%"
                          value={inicioDate}
                          onChange={handleInicioDateChange}
                          KeyboardButtonProps={{
                            "roboto-label": "change date",
                          }}
                        />
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <Typography
                          variant="subtitle2"
                          htmlFor="name"
                          align="left"
                        >
                          Fecha Fin
                        </Typography>
                        <KeyboardDatePicker
                          disableToolbar
                          minDate={"2020-03-05"}
                          maxDate={"2021-09-02"}
                          style={{ margin: "0%" }}
                          variant="inline"
                          format="dd/MM/yyyy"
                          inputProps={{
                            min: 0,
                            style: { textAlign: "center" },
                          }}
                          margin="normal"
                          id="fecha-fin"
                          value={finDate}
                          onChange={handleFinDateChange}
                          KeyboardButtonProps={{
                            "roboto-label": "change date",
                          }}
                        />
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <Typography variant="subtitle2" htmlFor="name">
                          Algoritmo de agrupamiento
                        </Typography>
                        <Select
                          id="algoritmo-select"
                          name="name"
                          open={open}
                          onClose={handleClose}
                          onOpen={handleOpen}
                          value={algoritmo}
                          onChange={handleChange}
                        >
                          {options.map((item, i) => (
                            <MenuItem key={"algoritmo" + i} value={i}>
                              {item.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <NavBtnGenerar>
                        <Button onClick={click}>Generar</Button>
                      </NavBtnGenerar>
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <Typography variant="subtitle2" gutterBottom>
                    Departamentos:
                  </Typography>
                  <Grid
                    container
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
                      {departamentos.map((name) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              key={name}
                              className={classes.root2}
                              disableRipple
                              defaultChecked={true}
                              disabled={name === "Todos" ? false : isDisabled}
                              onChange={() => handleChangeDepartamentos(name)}
                              selected={nombreDepartamentos.includes(name)}
                              checkedIcon={
                                <span
                                  className={clsx(
                                    classes.icon,
                                    classes.checkedIcon
                                  )}
                                />
                              }
                              icon={<span className={classes.icon} />}
                              inputProps={{
                                "aria-label": "decorative checkbox",
                              }}
                            />
                          }
                          label={name}
                        />
                      ))}
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            </Grid>
            <EspacioTiempo estado={state} grafico={graficos} />
            <Tabla estado={state} tabla={tabla}></Tabla>
            {mostrarkmeans && (
              <Agrupamientokmeans estado={state} kmeans={kmeans} />
            )}
            {mostrarjerarquico && (
              <Agrupamientojerarquico estado={state} jerarquico={jerarquico} />
            )}
            {mostrardbscan && (
              <Agrupamientodbscan estado={state} dbscan={dbscan} />
            )}
          </section>
        </Route>
        <Route path="/importar">
          <section className="contenido wrapper">
            <Importar />
          </section>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
