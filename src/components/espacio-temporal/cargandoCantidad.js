import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";
import FadeLoader from "react-spinners/FadeLoader";

const useStyles = makeStyles((theme) => ({
  spinner: {
    padding: "5px",
    marginTop: "5px",
    align: "center",
    textAlign: "center",
  },
}));

const override = {
  padding: "5px",
  display: "block",
  margin: "0 auto",
};

export default function CargandoCantidad() {
  const classes = useStyles();
  return (
    <div className={classes.spinner}>
      <FadeLoader
        color="#003E97"
        cssOverride={override}
        radius={15}
        height={15}
        width={5}
        margin="2px"
      />
    </div>
  );
}
