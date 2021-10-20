import React from "react";
import "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Slider from "react-input-slider";
import { Jerarquico } from "./graficos";
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
import download from "../tabla/descargar.png";
import { Btn } from "../tabla/descargarboton";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

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
    width: "600px",
  },
  p: {
    marginBottom: "0px",
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
    label: "N° Cluster",
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

const Agrupamientojerarquico = ({ estado, jerarquico }) => {
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
  const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}&parametro=${6}`;

  const [datos, setDatos] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [bandera, setBandera] = React.useState(false);

  const grafJerarquico = () => {
    setCargando(true);
    Axios.post(`http://localhost:8000/graficojerarquico/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          const item = JSON.parse(val1[0]);
          setDatos(val1[1]);
          const element = document.getElementById("graficojerarquico");
          if (element) element.removeChild(element.firstChild);
          window.Bokeh.embed.embed_item(item, "graficojerarquico");
          setCargando(false);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  };

  React.useEffect(() => {
    grafJerarquico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jerarquico]);

  /*const [dendrograma, setDendrograma] = React.useState({
    isLoaded: false,
    content: "a",
  });
  const [cargandodendrograma, setCargandodendrograma] = React.useState(true);
  const payload = {};*/

  /*if (props.estado.valor === 1) {
    const fechaIni = convert(props.estado.fechaIni);
    const fechaFin = convert(props.estado.fechaFin);
    const deps = props.estado.departamentos;
    const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}&parametro=${6}`;
    setCargando(true);
    Axios.post(`http://localhost:8000/graficojerarquico/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          const item = JSON.parse(val1[0]);
          setDatos(val1[1]);
          window.Bokeh.embed.embed_item(item, "graficojerarquico");
          setCargando(false);
        }
      })
      .catch((err) => console.log(err));
  }*/

  const [state, setState] = React.useState({ x: 6 });
  function range() {}
  const updateRange = (x) => {
    setState(x);
    console.log(x);
  };

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
      "Datos_Jerarquico_Secuencias_Genomicas_SARS_COV_2" + fileExtension
    );
  }

  return (
    <Grid container>
      {!bandera && (
        <Grid item xs={12} sm={12}>
          <Box className={classes.paper1} boxShadow={0} height={750}>
            <Typography variant="h6" align="center" className={classes.bold}>
              Agrupamiento de secuencias genómicas SARS-CoV-2 con K-means
            </Typography>
            <Grid container>
              <Grid item xs={6} sm={6} className={classes.grid}>
                <Typography
                  variant="subtitle1"
                  align="left"
                  className={classes.bold}
                >
                  Filtro por clusters
                </Typography>
                <p>
                  Se puede utilizar el control deslizante para filtrar por
                  grupos. Deslizar el control deslizante hasta el número de
                  clusters o grupos deseados para mostrar las secuencias
                  genómicas que pertenecen a ese grupo.
                </p>
                <div>
                  <Slider
                    style={{ width: "800px" }}
                    className={classes.slider}
                    axis="x"
                    x={state.x}
                    xmax={6}
                    xmin={1}
                    onChange={updateRange}
                    onDragEnd={range}
                  />
                </div>
                {cargando && <Cargando />}
                {!cargando && (
                  <Jerarquico
                    id="graficojerarquico"
                    className="bk-root"
                  ></Jerarquico>
                )}
              </Grid>
              <Grid item xs={6} sm={6} className={classes.grid2}>
                <Typography
                  variant="subtitle1"
                  align="left"
                  className={classes.bold}
                >
                  Dendrograma
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}
      {bandera && <Box></Box>}
      {!bandera && (
        <Grid item xs={12} sm={12}>
          <Box className={classes.paper2} boxShadow={0} height={580}>
            <Grid container justifyContent="space-between">
              <Typography variant="h6" align="left" className={classes.bold}>
                Datos de las secuencias genómicas SARS-CoV-2
              </Typography>
              {!cargando && (
                <Btn onClick={exportToCSV}>
                  Descargar datos
                  <img className={classes.imagen} src={download} alt="" />
                </Btn>
              )}
            </Grid>
            {cargando && <Cargando />}
            {!cargando && (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
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
                                    {column.format && typeof value === "number"
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
              />
            )}
          </Box>
        </Grid>
      )}
      {bandera && <Box></Box>}
    </Grid>
  );
};

export default Agrupamientojerarquico;
