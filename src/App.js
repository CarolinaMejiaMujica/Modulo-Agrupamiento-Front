import React from "react";
import "./App.css";
import { Helmet } from "react-helmet";
import EspacioTiempo from "./components/espacio-temporal";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Tabla from "./components/tabla";
import Agrupamientokmeans from "./components/agrupamiento-kmeans";
import Agrupamientojerarquico from "./components/agrupamiento-jerarquico";
import Agrupamientodbscan from "./components/agrupamiento-dbscan";
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
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { NavBtnGenerar, Button } from "./components/espacio-temporal/botones";
import {
  Nav,
  NavMenu,
  NavBtn,
  NavLink,
  NavBtnLink,
  NavDatos,
} from "./components/Navbar/NavbarElements";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const useStyles = makeStyles((theme) => ({
  subtitle2: { paddingTop: "10px" },
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
function App() {
  const classes = useStyles();

  const [departamentosCompleto, setDepartamentosCompleto] =
    React.useState(true);

  const [inicioDate, setInicioDate] = React.useState(
    "Mon Apr 06 2020 20:51:01 GMT-0500"
  );
  const [finDate, setFinDate] = React.useState(
    "Fri Oct 15 2021 20:00:01 GMT-0500"
  );
  const [algoritmo, setAlgoritmo] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const [state, setState] = React.useState({
    fechaIni: inicioDate,
    fechaFin: finDate,
    algoritmo: algoritmo,
    departamentos: departamentos,
  });

  const [graficos, setGraficos] = React.useState(false);
  const [kmeans, setKmeans] = React.useState(false);
  const [jerarquico, setJerarquico] = React.useState(false);
  const [dbscan, setDbscan] = React.useState(false);
  const [tabla, setTabla] = React.useState(false);

  const [mostrarkmeans, setMostrarKmeans] = React.useState(false);
  const [mostrarjerarquico, setMostrarJerarquico] = React.useState(false);
  const [mostrardbscan, setMostrarDbscan] = React.useState(false);

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
  };

  return (
    <Router>
      <Helmet>
        <style>{"body { background-color: #F6F7FF; }"}</style>
      </Helmet>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/graficos" />} />
        <Route path="/graficos">
          <Nav fixed="top">
            <NavMenu>
              <Typography variant="h5" noWrap className={classes.bold}>
                Análisis de Secuencias Genómicas SARS-CoV-2 Perú
              </Typography>
              <NavLink>Actualizado el 15/10/2021</NavLink>
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
              <NavBtnLink to="/graficos">Importar Datos</NavBtnLink>
            </NavBtn>
          </Nav>
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
                          minDate={"2020-04-07"}
                          maxDate={"2021-10-16"}
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
                          minDate={"2020-04-07"}
                          maxDate={"2021-10-16"}
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
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    className={classes.subtitle2}
                  >
                    Departamentos:
                  </Typography>
                  <Grid
                    container
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
                      <Autocomplete
                        value={state.departamentos}
                        id="departamentos"
                        multiple
                        options={departamentos}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option}
                        onChange={(event, newValue) => {
                          if (
                            newValue.includes("Todos") &&
                            departamentosCompleto === true
                          ) {
                            var index = newValue.indexOf("Todos");
                            if (index !== -1) {
                              newValue.splice(index, 1);
                            }
                            setState({
                              fechaIni: state.fechaIni,
                              fechaFin: state.fechaFin,
                              algoritmo: state.algoritmo,
                              departamentos: newValue,
                            });
                          } else if (
                            newValue.includes("Todos") &&
                            departamentosCompleto === false
                          ) {
                            setState({
                              fechaIni: state.fechaIni,
                              fechaFin: state.fechaFin,
                              algoritmo: state.algoritmo,
                              departamentos: departamentos,
                            });
                            setDepartamentosCompleto(true);
                          } else if (newValue.length === 0) {
                            setState({
                              fechaIni: state.fechaIni,
                              fechaFin: state.fechaFin,
                              algoritmo: state.algoritmo,
                              departamentos: [],
                            });
                            setDepartamentosCompleto(false);
                          } else {
                            setState({
                              fechaIni: state.fechaIni,
                              fechaFin: state.fechaFin,
                              algoritmo: state.algoritmo,
                              departamentos: newValue,
                            });
                            setDepartamentosCompleto(false);
                          }
                        }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option}
                          </li>
                        )}
                        style={{
                          width: "100%",
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Departamento" />
                        )}
                      />
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
      </Switch>
    </Router>
  );
}

export default App;
