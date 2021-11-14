import React from "react";
import "date-fns";
import { Box, Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Jerarquico } from "./graficos";
import Axios from "axios";
import Cargando from "./cargando";
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
import dendrograma from "./dendrograma.png";

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
    marginRight: "20px",
  },
  pagination: {
    paddingLeft: "800px",
  },
  container: {
    maxHeight: 440,
  },
  image: {
    paddingTop: "20px",
    width: "95%",
    height: "600px",
    justifyContent: "center",
    alignItems: "center",
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
  return `${scaledValue} clusters`;
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

  const [datos, setDatos] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [bandera, setBandera] = React.useState(false);

  const [value, setValue] = React.useState(6);
  const handleChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  const grafJerarquico = () => {
    setCargando(true);
    const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}&parametro=${value}`;
    Axios.post(`http://3.86.154.241/graficojerarquico/?${params}`, deps)
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
  }, [jerarquico, value]);

  const [url, setUrl] = React.useState("");

  const grafDendrograma = () => {
    setCargando(true);
    const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}`;

    Axios.post(`http://3.86.154.241/dendrograma/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          var params2 = { Bucket: "dendrograma", Key: "dendrograma.png" };
          const aws = require("aws-sdk");
          aws.config.setPromisesDependency();
          aws.config.update({
            accessKeyId: "ASIAQIMIDAYLIAIJRBIL",
            secretAccessKey: "vjgDk5H3jn/F1XXexLV7QmYrj5J6ixn5PF7WylPx",
            sessionToken:
              "FwoGZXIvYXdzEJj//////////wEaDJdI37aw9RJ4l7oC4CLJAVZZs7wb9n+y4VVRZa+4Cvj9wE6lsYvLotoBYOrgxzogHeW0AkWdBjEkGV3NqKMTvmtS8TO4wJYgY2KfXd31yO2tqzYuheKVSNM5AawoD9MeEG+gAFMNRuTTzQyFJ/HcqnT5XnHgNL0EYHjB1wT4vIYcZv4fDX3NNupxA0XfR1cr2XknID+B+QZ2DYdPYz64DHdm4o4OryNkszt6B3E/Hm+mE1WUXDyDmPts1ckkRd097mJqLlVQnNg69020v3OayQLPGpq7mBjuqiiSxL2MBjItG7OAX5e+3U2sn8SQk1CBffj6zkjjnuh37KJrI/YMGWPUY8Q45JOZYlqlCEov",
            region: "us-east-1",
          });
          const s3 = new aws.S3();
          var url_s3 = s3.getSignedUrl("getObject", params2);
          setUrl(url_s3);
          setCargando(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line
  };

  React.useEffect(() => {
    grafDendrograma();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jerarquico]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
      <Grid item xs={12} sm={12}>
        {!bandera && (
          <Grid item xs={12} sm={12}>
            <Box className={classes.paper1} boxShadow={0} height={750}>
              <Typography variant="h6" align="center" className={classes.bold}>
                Agrupamiento de secuencias genómicas SARS-CoV-2 con Algoritmo
                Jerárquico
              </Typography>
              <Grid container>
                <Grid item xs={6} sm={7} className={classes.grid}>
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
                  <Grid item xs={12} sm={10} className={classes.slider}>
                    <Typography id="non-linear-slider" gutterBottom>
                      N° de cluster: {valueLabelFormat(value)}
                    </Typography>
                    <Slider
                      id="Slider"
                      value={value}
                      min={2}
                      step={1}
                      max={6}
                      getAriaValueText={valueLabelFormat}
                      valueLabelFormat={valueLabelFormat}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      aria-labelledby="non-linear-slider"
                    />
                  </Grid>
                  {cargando && <Cargando />}
                  {!cargando && (
                    <Jerarquico
                      id="graficojerarquico"
                      className="bk-root"
                    ></Jerarquico>
                  )}
                </Grid>
                <Grid item xs={6} sm={5} className={classes.grid2}>
                  <Typography
                    variant="subtitle1"
                    align="left"
                    className={classes.bold}
                  >
                    Dendrograma
                  </Typography>
                  <p>
                    Se muestra una representación gráfica de las distancias
                    entre las secuencias genómicas SARS-CoV-2 en un dendrograma.
                  </p>
                  <img
                    src={dendrograma}
                    alt="dendrograma"
                    className={classes.image}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
        {bandera && <Box></Box>}
      </Grid>
      <Grid item xs={12} sm={12}>
        {!bandera && (
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
            <p className={classes.p}>
              Se muestra la información de las secuencias genómicas agrupadas
              con el algoritmo jerárquico en el gráfico superior.
            </p>
            {cargando && <Cargando />}
            {!cargando && (
              <TableContainer className={classes.container}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          background={column.background}
                          style={{
                            minWidth: column.minWidth,
                            fontWeight: column.fontWeight,
                          }}
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
                            aria-checked="false"
                            tabIndex={-1}
                            key={row.codigo}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align="center">
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
            )}
            {!cargando && (
              <Grid container justifyContent="space-between">
                <div style={{ paddingTop: "15px" }}>
                  (*) Identificador en la base de datos GISAID.
                </div>
                <TablePagination
                  className="mx-auto"
                  labelRowsPerPage={"Filas por página"}
                  rowsPerPageOptions={[10, 15, 20]}
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
              </Grid>
            )}
          </Box>
        )}
        {bandera && <Box></Box>}
      </Grid>
    </Grid>
  );
};

export default Agrupamientojerarquico;
