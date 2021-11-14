import React from "react";
import "date-fns";
import { Box, Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Dbscan } from "./graficos";
import Axios from "axios";
import Cargando from "./cargando";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import download from "../tabla/descargar.png";
import { Btn } from "../tabla/descargarboton";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Slider from "@mui/material/Slider";

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
  grid: {
    margin: "0px",
    marginTop: "10px",
    justifyContent: "justify-content",
  },
  grid2: {
    marginTop: "10px",
    margin: "0px",
  },
  imagen: {
    marginLeft: "10px",
    color: "#0000",
  },
  download: {
    marginTop: "10px",
    paddingLeft: "5px",
    marginLeft: "0px",
    margin: "20px",
  },
  slider: {
    marginLeft: "20px",
  },
  p: {
    marginRight: "10px",
  },
  pagination: {
    paddingLeft: "800px",
  },
  container: {
    maxHeight: 440,
  },
}));

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const columns = [
  { id: "nombre", label: "Departamento", minWidth: 170 },
  {
    id: "codigo",
    label: "ID de acceso de la secuencia genómica \u00a0(*)",
    minWidth: 100,
  },
  {
    id: "fecha",
    label: "Fecha de recolección",
    minWidth: 170,
    align: "center",
    background: "#FFFFFF",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "cluster",
    label: "N° de cluster",
    minWidth: 170,
    align: "center",
    background: "#FFFFFF",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "nomenclatura",
    label: "Nomenclatura según la OMS de la variante identificada",
    minWidth: 170,
    align: "center",
    background: "#FFFFFF",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function valueLabelFormat(value) {
  let scaledValue = value;
  return `${scaledValue}`;
}

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="Primera página"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Siguiente página"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Última página"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Agrupamientodbscan = ({ estado, dbscan }) => {
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

  const [datos, setDatos] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [bandera, setBandera] = React.useState(false);

  const [value, setValue] = React.useState(0.4);
  const handleChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  const grafdbscan = () => {
    setCargando(true);
    const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}&parametro=${value}`;
    Axios.post(`http://3.86.154.241/graficodbscan/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          const item = JSON.parse(val1[0]);
          setDatos(val1[1]);
          const element = document.getElementById("graficodbscan");
          if (element) element.removeChild(element.firstChild);
          window.Bokeh.embed.embed_item(item, "graficodbscan");
          setCargando(false);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  };

  React.useEffect(() => {
    grafdbscan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbscan, value]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  function exportToCSV() {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(
      data,
      "Datos_Dbscan_Secuencias_Genomicas_SARS_COV_2" + fileExtension
    );
  }

  return (
    <Grid container>
      {!bandera && (
        <Grid item xs={12} sm={12}>
          <Box className={classes.paper1} boxShadow={0} height={850}>
            <Typography variant="h6" align="center" className={classes.bold}>
              Agrupamiento de secuencias genómicas SARS-CoV-2 con Algoritmo
              DBSCAN
            </Typography>
            <Grid container>
              <Grid item xs={6} sm={8} className={classes.grid}>
                <Typography
                  variant="subtitle1"
                  align="left"
                  className={classes.bold}
                >
                  Filtro por epsilon
                </Typography>
                <p className={classes.p}>
                  Se puede utilizar el control deslizante para filtrar por el
                  valor de epsilon. Deslizar el control deslizante hasta el
                  valor de epsilon deseado para ajustar la densidad o separación
                  de los puntos de las secuencias genómicas que pertenecen a
                  cada grupo.
                </p>
                <Grid item xs={12} sm={10} className={classes.slider}>
                  <Typography id="non-linear-slider" gutterBottom>
                    Valor de epsilon: {valueLabelFormat(value)}
                  </Typography>
                  <Slider
                    id="Slider"
                    value={value}
                    min={0.1}
                    step={0.1}
                    max={0.5}
                    getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                  />
                </Grid>
                {cargando && <Cargando />}
                {!cargando && (
                  <Dbscan id="graficodbscan" className="bk-root"></Dbscan>
                )}
              </Grid>
              <Grid item xs={6} sm={4} className={classes.grid2}>
                <Typography
                  variant="subtitle1"
                  align="left"
                  className={classes.bold}
                >
                  Datos de las secuencias genómicas
                </Typography>
                <p className={classes.p}>
                  Se muestra la información de las secuencias genómicas
                  agrupadas con el algoritmo DBSCAN en el gráfico de la
                  izquierda.
                </p>
                <Grid container justifyContent="space-between">
                  {!cargando && (
                    <Grid container justifyContent="space-between">
                      <Btn onClick={exportToCSV} className={classes.download}>
                        Descargar datos
                        <img className={classes.imagen} src={download} alt="" />
                      </Btn>
                      <div style={{ paddingTop: "15px" }}>
                        (*) Identificador en la base de datos GISAID.
                      </div>
                    </Grid>
                  )}
                </Grid>
                {cargando && <Cargando />}
                {!cargando && (
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 550 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {datos
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.code}
                                >
                                  {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {column.format &&
                                        typeof value === "number"
                                          ? column.format(value)
                                          : value}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
                {!cargando && (
                  <TablePagination
                    className="mx-auto"
                    labelRowsPerPage={""}
                    rowsPerPageOptions={[]}
                    component="div"
                    count={datos.length}
                    labelDisplayedRows={({ from, to, count }) => {
                      return "" + from + "-" + to + " de " + count;
                    }}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  ></TablePagination>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}
      {bandera && <Box></Box>}
    </Grid>
  );
};

export default Agrupamientodbscan;
