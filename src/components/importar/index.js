import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";
import "./importar.css";
import { Typography } from "@material-ui/core";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { NavBtnUpload, Button } from "./boton";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
  },
  paper2: {
    backgroundColor: "#FFF9C6",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
    display: "flex",
    flexDirection: "row",
  },
  bold: {
    fontWeight: 600,
    padding: "10px",
  },
  info: {
    color: "#FED708",
  },
  infoTitle: {
    paddingLeft: "20px",
  },
  grid: {
    marginTop: "5px",
    justifyContent: "justify-content",
    marginLeft: "10px",
  },
  upload: {
    color: "#0149B0",
  },
  subir: {
    marginTop: "20px",
  },
}));

const Importar = () => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <Box className={classes.paper} boxShadow={0}>
          <Typography variant="h5" align="center" className={classes.bold}>
            Importar datos de las secuencias genómicas SARS-CoV-2
          </Typography>
          <Box className="Box" boxShadow={0}>
            <InfoIcon className={classes.info} sx={{ fontSize: 30 }}></InfoIcon>
            <Typography
              variant="subtitle1"
              align="center"
              className={classes.infoTitle}
            >
              Los datos importados serán almacenados en una base de datos y se
              realizará un procesamiento de estos datos para el respectivo
              análisis de secuencias genómicas SARS-CoV-2.
            </Typography>
          </Box>
          <Grid container className={classes.subir}>
            <Grid item xs={6}>
              <Typography variant="h6" className={classes.bold}>
                Subir archivo .FASTA y .TSV
              </Typography>
              <Typography variant="subtitle1" className={classes.grid}>
                Subir el archivo .FASTA y el archivo .TSV que contiene todas las
                secuencias genómicas SARS-CoV-2 del Perú a procesar
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <div className="body">
                <div className="drag-area">
                  <FileUploadIcon
                    className={classes.upload}
                    sx={{ fontSize: 80 }}
                  />
                  <Button>Selecciona tus archivos</Button>
                  <p>o arrastra y suelta los archivos acá</p>
                  <input type="file" name="" id="input-file" hidden multiple />
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Importar;
