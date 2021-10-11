import React from 'react';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Box,Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Slider from 'react-input-slider';
import {Kmeans} from './graficos';
import Axios from 'axios';
import Cargando from './cargando';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import download from '../tabla/descargar.png';
import { Btn} from '../tabla/descargarboton';
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
      backgroundColor: '#ffffff',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px',
    },
    paper2: {
      backgroundColor: '#ffffff',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
      textAlign: 'center'
    },
    grid:{
        margin: '0px',
        marginTop: '10px',
        justifyContent: 'justify-content',
    },
    grid2:{
        marginTop: '10px',
        margin: '0px',
    },
    imagen: {
        marginLeft: '10px',
        color: '#0000',
    },
    download: {
        marginTop: '10px',
        paddingLeft: '5px',
        marginLeft: '0px',
        margin: '20px'
    },
    slider:{
        width: '800px',
    },
    p:{
        marginBottom: '0px',
    }
  }));
  
  const columns = [
    { id: 'nombre', label: 'Departamento', minWidth: 170 },
    { id: 'codigo', label: 'ID de acceso de la secuencia genómica \u00a0(*)', minWidth: 100 },
    {
      id: 'fecha',
      label: 'Fecha de recolección',
      minWidth: 170,
      align: 'center',
      background: '#FFFFFF',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'cluster',
      label: 'N° Cluster',
      minWidth: 170,
      align: 'center',
      background: '#FFFFFF',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'nomenclatura',
      label: 'Nomenclatura según la OMS de la variante identificada',
      minWidth: 170,
      align: 'center',
      background: '#FFFFFF',
      format: (value) => value.toLocaleString('en-US'),
    },
  ];

const Agrupamientodbscan = (props) => {

    const classes = useStyles();

    function convert(str) {
        var date= new Date(str);
        var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    const fechaIni=convert(props.estado.fechaIni);
    const fechaFin=convert(props.estado.fechaFin);
    const deps=props.estado.departamentos;
    const params=`fechaIni=${fechaIni}&fechaFin=${fechaFin}&parametro=${6}`

    const [datos,setDatos]=React.useState([]);
    const [cargando, setCargando] = React.useState(true);
    const [bandera, setBandera] = React.useState(false);


    if (props.estado.agrupamiento===1){
        const fechaIni=convert(props.estado.fechaIni);
        const fechaFin=convert(props.estado.fechaFin);
        const deps=props.estado.departamentos;
        const params=`fechaIni=${fechaIni}&fechaFin=${fechaFin}&parametro=${6}`
        setCargando(true);
        props.estado.agrupamiento=0
      }

      const [state, setState] = React.useState({x:6});
      function range(){
        
      }
      const updateRange = (x)  => {
        setState(x);
        console.log(x)
      };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(7);

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
        FileSaver.saveAs(data, 'Datos_Kmeans_Secuencias_Genomicas_SARS_COV_2' + fileExtension);
      };

    return (
        <Grid container>

        </Grid>
    )
}

export default Agrupamientodbscan;