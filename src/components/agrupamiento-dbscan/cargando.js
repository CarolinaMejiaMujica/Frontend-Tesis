import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";
import FadeLoader from "react-spinners/FadeLoader";

const useStyles = makeStyles((theme) => ({
  spinner: {
    padding: "10px",
    marginTop: "200px",
    marginBottom: "200px",
    align: "center",
    textAlign: "center",
  },
}));

const override = {
  padding: "5px",
  display: "block",
  margin: "0 auto",
};

export default function Cargando() {
  const classes = useStyles();
  return (
    <div className={classes.spinner}>
      <FadeLoader
        cssOverride={override}
        color="#003E97"
        radius={20}
        height={15}
        width={5}
        margin="2px"
      />
    </div>
  );
}
