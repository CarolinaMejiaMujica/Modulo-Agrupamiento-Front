import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { makeStyles } from '@material-ui/core/styles';
import FadeLoader from "react-spinners/FadeLoader";

const useStyles = makeStyles((theme) => ({
    spinner: {
      padding: '10px',
      marginTop: '200px',
      align: 'center',
      textAlign: 'center',
    },
  }));

 
export default function Cargando() {
    const classes = useStyles();
    return (
      <div className={classes.spinner}>
        <FadeLoader className={classes.spinner} color='#003E97' radius={20} height={15} width={5} margin="2px" />
      </div>
    );
}