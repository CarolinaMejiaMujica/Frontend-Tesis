import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";
import FadeLoader from "react-spinners/FadeLoader";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spinner: {
    padding: "10px",
    marginTop: "50px",
    marginBottom: "50px",
    align: "center",
    textAlign: "center",
    left: "0px",
  },
  grid: {
    marginTop: "5px",
    align: "center",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  bold: {
    fontWeight: 500,
    padding: "10px",
  },
}));

export default function Cargando() {
  const classes = useStyles();
  return (
    <div className={classes.grid}>
      <div className={classes.spinner}>
        <FadeLoader
          className={classes.spinner}
          color="#003E97"
          radius={20}
          height={15}
          width={5}
          heightUnit={0}
          margin="2px"
        />
      </div>
      <Typography variant="h6" className={classes.bold}>
        Preprocesando las secuencias genómicas SARS-CoV-2
      </Typography>
    </div>
  );
}
