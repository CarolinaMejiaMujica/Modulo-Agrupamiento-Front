import React from 'react';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Box,Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import {RangeStepInput} from 'react-range-step-input';
import Slider from 'react-input-slider';

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
  }));
  

const Agrupamiento = (props) => {

    const classes = useStyles();

    /*function convert(str) {
        var date= new Date(str);
        var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }*/
      //const fechaIni=convert(props.estado.fechaIni);
      //const fechaFin=convert(props.estado.fechaFin);
      const algoritmo=props.estado.algoritmo;

      //ALGORITMOS
      const [kmeans,setKmeans]=React.useState(true);
      const [jerarquico,setJerarquico]=React.useState(false);
      const [dbscan,setDbscan]=React.useState(false);

      if (props.estado.agrupamiento===1){
        if (algoritmo===0){
            setKmeans(true);
            setJerarquico(false);
            setDbscan(false);
        }else if(algoritmo===1){
            setKmeans(false);
            setJerarquico(true);
            setDbscan(false);
        }else if(algoritmo===2){
            setKmeans(false);
            setJerarquico(false);
            setDbscan(true);
        }
        props.estado.agrupamiento=0
      }

      //const deps=props.estado.departamentos;
      //const params=`fechaIni=${fechaIni}&fechaFin=${fechaFin}`
      const [state, setState] = React.useState({x:6});

      function range(){
        
      }
      const updateRange = (x)  => {
        setState(x);
        console.log(x)
      };

    return (
        <Grid container>
            {kmeans && !jerarquico && !dbscan  && (
            <Grid item xs={12} sm={12}>
                <Box className={classes.paper1} boxShadow={0} height={750}>
                    <Typography 
                        variant= "h6"
                        align= "center"
                        className={classes.bold}>
                        Agrupamiento de secuencias genómicas SARS-CoV-2 con K-means
                    </Typography>
                    <Grid container>
                        <Grid item xs={6} sm={7} className={classes.grid}>
                            <Typography 
                                variant= "h7"
                                align= "center"
                                className={classes.bold}>
                                Filtro por clusters
                            </Typography>
                            <p>Se puede utilizar el control deslizante para filtrar por grupos. Deslizar el control deslizante hasta el número de grupo deseado para mostrar las secuencias genómicas que pertenecen a ese grupo.</p>
                            <div>
                            <Slider
                                axis="x"
                                x={state.x}
                                xmax={6}
                                xmin={1}
                                onChange={updateRange}
                                onDragEnd={range}
                            />
                            </div>
                        </Grid>
                        <Grid item xs={6} sm={5} className={classes.grid2}>
                            <Typography 
                                variant= "h7"
                                align= "center"
                                className={classes.bold}>
                                Datos de las secuencias genómicas
                            </Typography>
                            <p>Se muestra la información de las secuencias genómicas agrupadas con el algoritmo k-means en el gráfico de la izquierda.</p>
                            
                        </Grid>
                    </Grid>
                </Box>                
            </Grid>
            )}
            {!kmeans && jerarquico && !dbscan  && (
            <Grid item xs={12} sm={12}>
                <Box className={classes.paper1} boxShadow={0} height={750}>
                    <Typography 
                        variant= "h6"
                        align= "center"
                        className={classes.bold}>
                        Agrupamiento de secuencias genómicas SARS-CoV-2 con Algoritmo Jerárquico
                    </Typography>
                </Box>
            </Grid>
            )}
            {!kmeans && !jerarquico && dbscan  && (
            <Grid item xs={12} sm={12}>
                <Box className={classes.paper1} boxShadow={0} height={750}>
                    <Typography 
                        variant= "h6"
                        align= "center"
                        className={classes.bold}>
                        Agrupamiento de secuencias genómicas SARS-CoV-2 con DBSCAN
                    </Typography>
                </Box>
                
            </Grid>
            )}
        </Grid>
    )
}

export default Agrupamiento;