import React from "react";
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
import { Box, Grid, Typography } from "@material-ui/core";
import Axios from "axios";
import Cargando from "../espacio-temporal/cargando";
import { Btn } from "./descargarboton";
import download from "./descargar.png";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

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
    fontWeight: 500,
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
  {
    id: "variante",
    label: "Nombre de la variante identificada",
    minWidth: 170,
    align: "center",
    background: "#FFFFFF",
    format: (value) => value.toFixed(2),
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  paper2: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
  },
  bold: {
    fontWeight: 600,
  },
  imagen: {
    marginLeft: "10px",
    color: "#0000",
  },
  pagination: {
    paddingLeft: "800px",
  },
});

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

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

const Tabla = ({ estado, tabla }) => {
  function convert(str) {
    var date = new Date(str);
    var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  const fechaIni = convert(estado.fechaIni);
  const fechaFin = convert(estado.fechaFin);
  const deps = estado.departamentos;
  const params = `fechaIni=${fechaIni}&fechaFin=${fechaFin}`;
  const [filas, setFilas] = React.useState([]);

  const [cargando, setCargando] = React.useState(true);
  const [bandera, setBandera] = React.useState(false);

  React.useEffect(() => {
    Axios.post(`http://3.86.154.241/tablaespacio/?${params}`, deps)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          setFilas(response.data);
          setCargando(false);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, [tabla]);

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  function exportToCSV() {
    const ws = XLSX.utils.json_to_sheet(filas);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(
      data,
      "Datos_Secuencias_Genomicas_SARS_COV_2" + fileExtension
    );
  }

  return (
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
                  {filas
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                count={filas.length}
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
  );
};

export default Tabla;
